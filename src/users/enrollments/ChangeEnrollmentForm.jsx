import React, { useCallback, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  ActionRow,
  Button, Input, InputSelect, ModalDialog,
} from '@edx/paragon';
import AlertList from '../../userMessages/AlertList';
import { patchEnrollment } from '../data/api';
import UserMessagesContext from '../../userMessages/UserMessagesContext';
import { reasons } from './constants';

export default function ChangeEnrollmentForm({
  user,
  enrollment,
  closeHandler,
  forwardedRef,
  changeHandler,
}) {
  const [mode, setMode] = useState(enrollment.mode);
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const [hideOnSubmit, setHideOnSubmit] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const { add, clear } = useContext(UserMessagesContext);

  reasons[0] = { label: 'Reason for Change', value: '', disabled: true };

  const getModes = () => {
    const modeList = [];
    modeList.push({ label: 'New Mode', value: '', disabled: true });
    enrollment.courseModes.map(enrollmentMode => (
      !(enrollmentMode.slug === enrollment.mode) && modeList.push(enrollmentMode.slug)
    ));
    return modeList;
  };

  const submit = useCallback(() => {
    clear('changeEnrollments');
    setShowLoader(true);
    const sendReason = (reason === 'other') ? comments : reason;
    patchEnrollment({
      user,
      courseID: enrollment.courseId,
      oldMode: enrollment.mode,
      newMode: mode,
      reason: sendReason,
    }).then((result) => {
      if (result.errors !== undefined) {
        result.errors.forEach(error => add(error));
      } else {
        const successMessage = {
          code: null,
          dismissible: true,
          text: 'Enrollment successfully changed.',
          type: 'success',
          topic: 'changeEnrollments',
        };
        setHideOnSubmit(true);
        add(successMessage);
        changeHandler();
      }
      setShowLoader(false);
    });
  });

  const changeEnrollmentForm = (
    <form>
      <AlertList topic="changeEnrollments" className="mb-3" />
      <div className="form-group">

        <div className="row small">
          <div className="col-sm-6">
            Course Run ID
          </div>
          <div className="col-sm-6">
            {enrollment.courseId}
          </div>
        </div>
        <hr />

        <div className="row small">
          <div className="col-sm-6">
            Mode
          </div>
          <div className="col-sm-6">
            {enrollment.mode}
          </div>
        </div>
        <hr />

        <div className="row small">
          <div className="col-sm-6">
            Active
          </div>
          <div className="col-sm-6">
            {enrollment.isActive.toString()}
          </div>
        </div>
        <hr />

        <InputSelect
          className="mb-n3"
          type="select"
          options={getModes()}
          value=""
          id="mode"
          name="mode"
          onChange={(event) => setMode(event)}
          disabled={hideOnSubmit}
        />
        <InputSelect
          className="mb-4"
          type="select"
          options={reasons}
          id="reason"
          name="reason"
          value=""
          onChange={(event) => setReason(event)}
          disabled={hideOnSubmit}
        />
        <Input
          placeholder="Explanation"
          type="textarea"
          id="comments"
          name="comments"
          defaultValue=""
          onChange={(event) => setComments(event.target.value)}
          disabled={hideOnSubmit}
          ref={forwardedRef}
        />
      </div>
    </form>
  );

  return (
    <ModalDialog
      isOpen={modalIsOpen}
      onClose={() => {
        setModalIsOpen(false);
        closeHandler(false);
        clear('changeEnrollments');
      }}
      hasCloseButton
      id="change-enrollment"
      size="lg"
    >
      <ModalDialog.Header className="mb-2">
        <ModalDialog.Title className="modal-title">
          Change Enrollment
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        {changeEnrollmentForm}
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <ModalDialog.CloseButton
            variant="link"
          >
            Close
          </ModalDialog.CloseButton>
          {showLoader
            ? (<div className="spinner-border text-primary" role="status" />)
            : (
              <Button
                variant="primary"
                disabled={!(mode && reason)}
                className="mr-3"
                onClick={submit}
                hidden={hideOnSubmit}
              >
                Submit
              </Button>
            )},
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
}

ChangeEnrollmentForm.propTypes = {
  enrollment: PropTypes.shape({
    courseId: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    courseModes: PropTypes.array,
  }),
  user: PropTypes.string.isRequired,
  closeHandler: PropTypes.func.isRequired,
  changeHandler: PropTypes.func.isRequired,
  forwardedRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

ChangeEnrollmentForm.defaultProps = {
  enrollment: {
    courseId: '',
    mode: '',
    isActive: false,
  },
  forwardedRef: null,
};
