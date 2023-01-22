import React, { useCallback, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  ActionRow,
  Button, ModalDialog, Form,
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

    modeList.push(
      <option value="">
        New Mode
      </option>,
    );
    enrollment.courseModes.map(enrollmentMode => (
      !(enrollmentMode.slug === enrollment.mode) && modeList.push(<option>{ enrollmentMode.slug}</option>)
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
        <Form.Group>
          <Form.Control
            as="select"
            id="mode"
            name="mode"
            disabled={hideOnSubmit}
            onChange={(event) => setMode(event.target.value)}
          >
            {getModes()}

          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Control
            className="mb-4"
            as="select"
            id="reason"
            value=""
            name="reason"
            disabled={hideOnSubmit}
            onChange={(event) => setReason(event.target.value)}
          >
            {reasons.map(item => (
              <option
                value={item.value}
                disabled={item.disabled}
              >
                {item.label}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Control
            placeholder="Explanation"
            as="textarea"
            autoResize
            id="comments"
            name="comments"
            defaultValue=""
            disabled={hideOnSubmit}
            ref={forwardedRef}
            onChange={(event) => setComments(event.target.value)}
          />
        </Form.Group>
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
            )}
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
    courseModes: PropTypes.shape([]),
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
