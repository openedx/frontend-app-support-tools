import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { Modal, Button, Alert } from '@edx/paragon';
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
        <div>
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

      <Modal
        open={cancelRetirementModalIsOpen}
        id="user-account-cancel-retirement"
        buttons={[errorMessage ? (<></>)
          : (
            <Button
              variant="danger"
              onClick={cancelRetirement}
            >
              Confirm
            </Button>
          ),
        ]}
        onClose={closeCancelRetirementModal}
        dialogClassName="modal-lg modal-dialog-centered justify-content-center"
        title="Cancel Retirement"
        body={modalBody}
      />
    </div>
  );
}

CancelRetirement.propTypes = {
  retirementId: PropTypes.number.isRequired,
  changeHandler: PropTypes.func.isRequired,
};
