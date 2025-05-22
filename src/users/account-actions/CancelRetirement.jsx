import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import {
  Button, Alert, ModalDialog, ActionRow,
} from '@openedx/paragon';
import { postCancelRetirement } from '../data/api';

export default function CancelRetirement({
  retirementId,
  changeHandler,
}) {
  const [cancelRetirementModalIsOpen, setCancelRetirementModalIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const cancelRetirement = async () => {
    const resp = await postCancelRetirement(retirementId);
    if (resp.errors) {
      setErrorMessage(resp.errors[0].text || 'Something went wrong. Please try again later!');
    } else {
      changeHandler();
    }
  };

  const closeCancelRetirementModal = () => {
    setCancelRetirementModalIsOpen(false);
    setErrorMessage(null);
  };

  const modalBody = (
    errorMessage ? <Alert variant="danger">{errorMessage}</Alert>
      : (
        <div data-testid="cancel-retirement-modal-body">
          <Alert variant="warning">
            <FormattedMessage
              id="supportTools.accountActions.cancelRetirement"
              tagName="p"
              description="Cancel Retirement instructions prompt"
              defaultMessage="This will cancel retirement for the requested user. Do you wish to proceed?"
            />
          </Alert>
        </div>
      )
  );

  return (
    <div>
      <Button
        id="cancel-retirement"
        variant="btn btn-danger"
        onClick={() => setCancelRetirementModalIsOpen(true)}
        className="mr-1 mb-2"
      >Cancel Retirement
      </Button>
      <ModalDialog
        isOpen={cancelRetirementModalIsOpen}
        onClose={closeCancelRetirementModal}
        hasCloseButton
        id="user-account-cancel-retirement"
        size="lg"
      >
        <ModalDialog.Header className="mb-3">
          <ModalDialog.Title data-testid="cancel-retirement-modal-title" className="modal-title">
            Cancel Retirement
          </ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body className="mb-3">
          {modalBody}
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <ActionRow>
            <ModalDialog.CloseButton
              variant="link"
              data-testid="cancel-retirement-modal-close-button"
            >
              Close
            </ModalDialog.CloseButton>
            {
              errorMessage ? null
                : (
                  <Button
                    data-testid="cancel-retirement-confirmation-button"
                    variant="danger"
                    onClick={cancelRetirement}
                  >
                    Confirm
                  </Button>
                )
}
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>
    </div>
  );
}

CancelRetirement.propTypes = {
  retirementId: PropTypes.number.isRequired,
  changeHandler: PropTypes.func.isRequired,
};
