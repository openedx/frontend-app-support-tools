import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, DataTable, ModalDialog, ActionRow,
} from '@openedx/paragon';
import { formatDate } from '../../utils';

export default function PasswordHistory({
  passwordStatus,
}) {
  const [passwordHistoryData, setPasswordHistoryData] = useState([]);
  const [passwordHistoryModalIsOpen, setPasswordHistoryModalIsOpen] = useState(false);

  const openHistoryModal = () => {
    const tableData = passwordStatus.passwordToggleHistory.map(result => ({
      created: formatDate(result.created),
      comment: result.comment,
      disabled: result.disabled ? 'Disabled' : 'Enabled',
      createdBy: result.createdBy,
    }));
    setPasswordHistoryData(tableData);
    setPasswordHistoryModalIsOpen(true);
  };

  const userPasswordHistoryColumns = [
    {
      Header: 'Date',
      accessor: 'created',
    },
    {
      Header: 'Comment',
      accessor: 'comment',
    },
    {
      Header: 'Action',
      accessor: 'disabled',
    },
    {
      Header: 'By',
      accessor: 'createdBy',
    },
  ];

  return (
    <div>

      {passwordStatus.passwordToggleHistory.length > 0 && (
        <Button
          id="toggle-password-history"
          variant="outline-primary"
          onClick={() => openHistoryModal()}
          className="mr-1 mb-2"
        >
          Show History
        </Button>
      )}

      <ModalDialog
        isOpen={passwordHistoryModalIsOpen}
        onClose={() => setPasswordHistoryModalIsOpen(false)}
        hasCloseButton
        id="password-history"
        size="xl"
      >
        <ModalDialog.Header className="mb-3">
          <ModalDialog.Title className="modal-title">
            Enable/Disable History
          </ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body data-testid="password-history-modal-body" className="mb-3">
          <DataTable
            data={passwordHistoryData}
            columns={userPasswordHistoryColumns}
            itemCount={passwordHistoryData.length}
          />
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <ActionRow>
            <ModalDialog.CloseButton
              variant="link"
              data-testid="password-history-modal-close-button"
            >
              Close
            </ModalDialog.CloseButton>
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>
    </div>
  );
}

PasswordHistory.propTypes = {
  passwordStatus: PropTypes.shape({
    passwordToggleHistory: PropTypes.arrayOf(PropTypes.shape(
      {
        created: PropTypes.string.isRequired,
        comment: PropTypes.string.isRequired,
        disabled: PropTypes.bool.isRequired,
        createdBy: PropTypes.string.isRequired,
      },
    )),
  }).isRequired,
};
