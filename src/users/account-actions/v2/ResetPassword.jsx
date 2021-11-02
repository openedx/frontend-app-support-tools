import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { Modal, Button, Alert } from '@edx/paragon';
import { postResetPassword } from '../../data/api';

export default function ResetPassword({
  email,
  changeHandler,
}) {
  const [resetPasswordModalIsOpen, setResetPasswordModalIsOpen] = useState(false);

  const resetPassword = () => {
    postResetPassword(email);
    changeHandler();
  };

  return (
    <div>
      <Button
        id="reset-password"
        variant="btn btn-danger"
        onClick={() => setResetPasswordModalIsOpen(true)}
        className="mr-1 mb-2"
      >Reset Password
      </Button>

      <Modal
        open={resetPasswordModalIsOpen}
        id="user-account-reset-password"
        buttons={[
          <Button
            variant="danger"
            onClick={resetPassword}
          >
            Confirm
          </Button>,
        ]}
        onClose={() => setResetPasswordModalIsOpen(false)}
        dialogClassName="modal-lg modal-dialog-centered justify-content-center"
        title="Reset Password"
        body={(
          <div>
            <Alert variant="warning">
              <FormattedMessage
                id="supportTools.accountActions.resetPassword"
                tagName="p"
                description="Password reset email instructions prompt"
                defaultMessage="We will send a message with password recovery instructions to the email address {email}.
                Do you wish to proceed?"
                values={{
                  email: <strong>{email}</strong>,
                }}
              />
            </Alert>
          </div>
          )}
      />
    </div>
  );
}

ResetPassword.propTypes = {
  email: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
};
