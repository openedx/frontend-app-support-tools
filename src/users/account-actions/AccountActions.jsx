import React from 'react';
import PropTypes from 'prop-types';

import TogglePasswordStatus from './v2/TogglePasswordStatus';
import ResetPassword from './v2/ResetPassword';
import PasswordHistory from './v2/PasswordHistory';

export default function AccountActions({ userData, changeHandler }) {
  return (
    <>
      <h3 className="w-100">Account Actions</h3>
      <TogglePasswordStatus
        username={userData.username}
        passwordStatus={userData.passwordStatus}
        changeHandler={changeHandler}
      />
      <ResetPassword
        email={userData.email}
        changeHandler={changeHandler}
      />
      <PasswordHistory
        passwordStatus={userData.passwordStatus}
      />
    </>
  );
}

AccountActions.propTypes = {
  userData: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
    passwordStatus: PropTypes.shape({
      status: PropTypes.string,
      passwordToggleHistory: PropTypes.arrayOf(PropTypes.shape(
        {
          created: PropTypes.string.isRequired,
          comment: PropTypes.string.isRequired,
          disabled: PropTypes.bool.isRequired,
          createdBy: PropTypes.string.isRequired,
        },
      )),
    }),
  }).isRequired,
  changeHandler: PropTypes.func.isRequired,
};
