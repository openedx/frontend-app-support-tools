import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Table } from '@edx/paragon';
import { formatDate } from '../../../utils';

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
      label: 'Date',
      key: 'created',
    },
    {
      label: 'Comment',
      key: 'comment',
    },
    {
      label: 'Action',
      key: 'disabled',
    },
    {
      label: 'By',
      key: 'createdBy',
    },
  ];

  return (
    <div>

      {passwordStatus.passwordToggleHistory.length > 0 && (
      <Button
        id="toggle-password-history"
        variant="outline-primary ml-1"
        onClick={() => openHistoryModal()}
      >
        Show History
      </Button>
      )}

      <Modal
        open={passwordHistoryModalIsOpen}
        onClose={() => setPasswordHistoryModalIsOpen(false)}
        title="Enable/Disable History"
        id="password-history"
        dialogClassName="modal-xl"
        body={(
          <Table
            data={passwordHistoryData}
            columns={userPasswordHistoryColumns}
          />
          )}
      />
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
