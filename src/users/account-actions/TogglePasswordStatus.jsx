import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Input, Alert, ModalDialog, ActionRow,
} from '@edx/paragon';
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
    postTogglePasswordStatus(username, comment).then(() => {
      changeHandler();
    });
  };

  return (
    <div>
      <Button
        id="toggle-password"
        variant={`${passwordStatus.status === PASSWORD_STATUS.USABLE ? 'danger' : 'primary'}`}
        onClick={() => setDisableUserModalIsOpen(true)}
        className="mr-1 mb-2"
      >
        {passwordStatus.status === PASSWORD_STATUS.USABLE ? DISABLE_USER : ENABLE_USER}
      </Button>
      <ModalDialog
        isOpen={disableUserModalIsOpen}
        onClose={() => setDisableUserModalIsOpen(false)}
        hasCloseButton
        id="user-account-status-toggle"
      >
        <ModalDialog.Header className="mb-3 mt-1 ">
          <ModalDialog.Title className="modal-title">
            {`${passwordStatus.status === PASSWORD_STATUS.USABLE ? DISABLE_USER_CONFIRMATION : ENABLE_USER_CONFIRMATION}`}
          </ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body className="mb-3">
          <div>
            <Alert variant="warning">
              <p>
                Please provide the reason for {`${passwordStatus.status === PASSWORD_STATUS.USABLE ? 'disabling' : 'enabling'}`} the user <b>{username}</b>.
              </p>
            </Alert>
            <label htmlFor="comment">Reason: </label>
            <Input
              name="comment"
              type="text"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </div>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <ActionRow>
            <ModalDialog.CloseButton
              variant="link"
            >
              Close
            </ModalDialog.CloseButton>
            <Button
              variant="danger"
              onClick={togglePasswordStatus}
            >
              Confirm
            </Button>
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>
    </div>
  );
}

TogglePasswordStatus.propTypes = {
  username: PropTypes.string.isRequired,
  passwordStatus: PropTypes.shape({
    status: PropTypes.string.isRequired,
  }).isRequired,
  changeHandler: PropTypes.func.isRequired,
};
