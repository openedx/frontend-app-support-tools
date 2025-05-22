import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import {
  Button, Alert, ModalDialog, ActionRow,
} from '@openedx/paragon';
import { postRetireUser } from '../data/api';

export default function RetireUser({
  username,
  email,
  changeHandler,
}) {
  const [retireUserModalIsOpen, setRetireUserModalIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const isNotRetirable = () => {
    if (email.endsWith('@retired.invalid')) { return true; }
    return false;
  };
  const retireUser = async () => {
    const resp = await postRetireUser(username);
    if (resp.errors) {
      setErrorMessage(resp.errors[0].text || 'Something went wrong. Please try again later!');
    } else {
      changeHandler();
    }
  };

  const closeRetireUserModal = () => {
    setRetireUserModalIsOpen(false);
    setErrorMessage(null);
  };

  const modalBody = (
    errorMessage ? <Alert variant="danger">{errorMessage}</Alert>
      : (
        <div>
          <Alert data-testid="retire-user-alert" variant="warning">
            <FormattedMessage
              id="supportTools.accountActions.retireUser"
              tagName="p"
              description="User retirement confirmation prompt"
              defaultMessage="You are about to retire {username} with the email address: {email}.{br}{br}
              This is a serious action that will revoke this user's access to edX and
              their earned certificates. Furthermore, the email address associated
              with the retired account will not be able to be used to create a new account."
              values={{
                username: <strong>{username}</strong>,
                email: <strong>{email}</strong>,
                br: <br />,
              }}
            />
          </Alert>
        </div>
      )
  );

  return (
    <div>
      <Button
        id="retire-user"
        variant="btn btn-danger"
        onClick={() => setRetireUserModalIsOpen(true)}
        className="mr-1 mb-2 ml-2"
        disabled={isNotRetirable()}
      >
        Retire User
      </Button>
      <ModalDialog
        isOpen={retireUserModalIsOpen}
        onClose={closeRetireUserModal}
        hasCloseButton
        id="user-account-retire"
        size="lg"
      >
        <ModalDialog.Header className="mb-3 mt-1">
          <ModalDialog.Title data-testid="user-account-retire-modal-title" className="modal-title">
            Retire User Confirmation
          </ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body data-testid="user-account-retire-modal-body" className="mb-3">
          {modalBody}
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <ActionRow>
            <ModalDialog.CloseButton
              variant="link"
              data-testid="user-account-retire-modal-close-button"
            >
              Close
            </ModalDialog.CloseButton>
            {errorMessage ? null
              : (
                <Button
                  data-testid="retire-user-account-confirmation-button"
                  variant="danger"
                  onClick={retireUser}
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

RetireUser.propTypes = {
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
};
