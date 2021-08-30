import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Input } from '@edx/paragon';
import { postTogglePasswordStatus } from '../data/api';

import {
  DISABLE_USER, ENABLE_USER, DISABLE_USER_CONFIRMATION, ENABLE_USER_CONFIRMATION, PASSWORD_STATUS,
} from './constants';

export default function TogglePasswordStatus({
  username,
  passwordStatus,
  changeHandler,
}) {
  const [disableUserModalIsOpen, setDisableUserModalIsOpen] = useState(false);
  const [comment, setComment] = useState('');

  const togglePasswordStatus = () => {
    postTogglePasswordStatus(username, comment);
    changeHandler();
  };

  return (
    <div>
      <Button
        id="toggle-password"
        variant={`${passwordStatus.status === PASSWORD_STATUS.USABLE ? 'danger' : 'primary'}`}
        onClick={() => setDisableUserModalIsOpen(true)}
      >
        {passwordStatus.status === PASSWORD_STATUS.USABLE ? DISABLE_USER : ENABLE_USER}
      </Button>
      <Modal
        open={disableUserModalIsOpen}
        id="user-account-status-toggle"
        buttons={[
          <Button
            variant="danger"
            onClick={togglePasswordStatus}
          >
            Confirm
          </Button>,
        ]}
        onClose={() => setDisableUserModalIsOpen(false)}
        title={`${passwordStatus.status === PASSWORD_STATUS.USABLE ? DISABLE_USER_CONFIRMATION : ENABLE_USER_CONFIRMATION}`}
        body={(
          <div>
            <label htmlFor="comment">Reason: </label>
            <Input
              name="comment"
              type="text"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </div>
          )}
      />
    </div>
  );
}

TogglePasswordStatus.propTypes = {
  username: PropTypes.string.isRequired,
  passwordStatus: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
};
