import React, { useCallback, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  ActionRow,
  Button, Form, Input, InputSelect, ModalDialog,
} from '@edx/paragon';

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

    <form>
      <AlertList topic="createEnrollments" className="mb-3" />
      <Form.Group>
        <Form.Control
          id="courseID"
          placeholder="Course Run ID"
          name="courseID"
          onChange={(event) => setCourseID(event.target.value)}
          ref={forwardedRef}
        />
      </Form.Group>
      <Form.Group>
        <Form.Control
          as="select"
          id="mode"
          name="mode"
          onChange={(event) => setMode(event.target.value)}
        >
          {modes.map(item => (
            <option
              value={item.value}
            >
              {item.label}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Control
          as="select"
          id="reason"
          name="reason"
          onChange={(event) => setReason(event.target.value)}
        >
          {reasons.map(item => (
            <option
              value={item.value}
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
          onChange={(event) => setComments(event.target.value)}
        />
      </Form.Group>
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
        <ModalDialog.Title className="modal-title">
          Create New Enrollment
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        {createEnrollmentForm}
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
