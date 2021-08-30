import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from '@edx/paragon';
import { postResetPassword } from '../data/api';

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
        variant="btn btn-danger ml-1"
        onClick={() => setResetPasswordModalIsOpen(true)}
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
        title="Reset Password"
        body={(
          <div>
            { /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
            <label>
              We will send a message with password recovery instructions to this email address {email}.
              Do you wish to proceed?
            </label>
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
