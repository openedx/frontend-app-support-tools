import React, { useCallback, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  ActionRow,
  Button, Input, InputSelect, ModalDialog,
} from '@openedx/paragon';

import AlertList from '../../userMessages/AlertList';
import { postEnrollment } from '../data/api';
import UserMessagesContext from '../../userMessages/UserMessagesContext';
import { reasons, modes } from './constants';

export default function CreateEnrollmentForm({
  user,
  closeHandler,
  forwardedRef,
  changeHandler,
}) {
  const [courseID, setCourseID] = useState('');
  const [mode, setMode] = useState('');
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const { add, clear } = useContext(UserMessagesContext);

  const submit = useCallback(() => {
    clear('createEnrollments');
    setShowLoader(true);
    const sendReason = (reason === 'other') ? comments : reason;
    postEnrollment({
      user,
      courseID,
      mode,
      reason: sendReason,
    }).then((result) => {
      if (result.errors !== undefined) {
        result.errors.forEach(error => add(error));
      } else {
        const successMessage = {
          code: null,
          dismissible: true,
          text: 'New Enrollment successfully created.',
          type: 'success',
          topic: 'createEnrollments',
        };
        add(successMessage);
        changeHandler();
      }
      setShowLoader(false);
    });
  });

  const createEnrollmentForm = (
    <form data-testid="create-enrollment-form">
      <AlertList topic="createEnrollments" className="mb-3" />
      <div className="form-group">
        <Input
          type="text"
          id="courseID"
          name="courseID"
          placeholder="Course Run ID"
          onChange={(event) => setCourseID(event.target.value)}
          ref={forwardedRef}
        />
        <InputSelect
          className="mb-n3 small"
          type="select"
          options={modes}
          id="mode"
          name="mode"
          value=""
          onChange={(event) => setMode(event)}
        />
        <InputSelect
          className="mb-4 small"
          type="select"
          options={reasons}
          id="reason"
          name="reason"
          value=""
          onChange={(event) => setReason(event)}
        />
        <Input
          placeholder="Explanation"
          type="textarea"
          id="comments"
          name="comments"
          defaultValue=""
          onChange={(event) => setComments(event.target.value)}
        />
      </div>
    </form>
  );

  return (
    <ModalDialog
      isOpen={modalIsOpen}
      onClose={() => {
        closeHandler(false);
        setModalIsOpen(false);
        clear('createEnrollments');
      }}
      hasCloseButton
      id="create-enrollment"
      size="lg"
    >
      <ModalDialog.Header className="mb-3">
        <ModalDialog.Title data-testid="create-enrollment-form-heading" className="modal-title">
          Create New Enrollment
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        {createEnrollmentForm}
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <ModalDialog.CloseButton
            data-testid="close-button-create-enrollment-modal"
            variant="link"
          >
            Close
          </ModalDialog.CloseButton>
          {showLoader
            ? (<div className="spinner-border text-primary" role="status" />)
            : (
              <Button
                variant="primary"
                disabled={!(courseID && reason)}
                className="mr-3"
                onClick={submit}
              >
                Submit
              </Button>
            )}
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
}

CreateEnrollmentForm.propTypes = {
  user: PropTypes.string.isRequired,
  closeHandler: PropTypes.func.isRequired,
  changeHandler: PropTypes.func.isRequired,
  forwardedRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

CreateEnrollmentForm.defaultProps = {
  forwardedRef: null,
};
