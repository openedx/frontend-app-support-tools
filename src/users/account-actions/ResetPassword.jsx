import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import {
  Button, Alert, ModalDialog, ActionRow,
} from '@openedx/paragon';
import { postResetPassword } from '../data/api';

export default function ResetPassword({
  email,
  changeHandler,
}) {
  const [resetPasswordModalIsOpen, setResetPasswordModalIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const resetPassword = async () => {
    const resp = await postResetPassword(email);
    if (resp.errors) {
      setErrorMessage(resp.errors[0].text || 'Something went wrong. Please try again later!');
    } else {
      changeHandler();
    }
  };

  const closeResetPasswordModal = () => {
    setResetPasswordModalIsOpen(false);
    setErrorMessage(null);
  };

  const modalBody = (
    errorMessage ? <Alert variant="danger">{errorMessage}</Alert>
      : (
        <div>
          <Alert variant="warning">
            <FormattedMessage
              id="supportTools.accountActions.resetPassword"
              tagName="p"
              description="Password reset email instructions prompt"
              defaultMessage="We will send a message with password recovery instructions to the email address {email}. Do you wish to proceed?"
              values={{
                email: <strong>{email}</strong>,
              }}
            />
          </Alert>
        </div>
      )
  );

  return (
    <div>
      <Button
        id="reset-password"
        variant="btn btn-danger"
        onClick={() => setResetPasswordModalIsOpen(true)}
        className="mr-1 mb-2"
      >Reset Password
      </Button>
      <ModalDialog
        isOpen={resetPasswordModalIsOpen}
        onClose={closeResetPasswordModal}
        hasCloseButton
        id="user-account-reset-password"
        size="lg"
      >
        <ModalDialog.Header className="mb-3 mt-1">
          <ModalDialog.Title className="modal-title">
            Reset Password
          </ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body className="mb-3">
          {modalBody}
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <ActionRow>
            <ModalDialog.CloseButton
              variant="link"
            >
              Close
            </ModalDialog.CloseButton>
            {errorMessage ? null
              : (
                <Button
                  variant="danger"
                  onClick={resetPassword}
                >
                  Confirm
                </Button>
              )}
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>
    </div>
  );
}

ResetPassword.propTypes = {
  email: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
};
