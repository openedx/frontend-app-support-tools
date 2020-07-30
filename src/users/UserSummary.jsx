import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from '@edx/paragon';

import { postTogglePasswordStatus } from './api';
import Table from '../Table';
import formatDate from '../dates/formatDate';

export default function UserSummary({
  userData,
  verificationData,
  ssoRecords,
  changeHandler,
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [extraDataTitle, setExtraDataTitle] = useState('');
  const [ssoExtraData, setSsoExtraData] = useState([]);

  const PASSWORD_STATUS = {
    USABLE: 'Usable',
    UNUSABLE: 'Unusable',
  };

  const togglePasswordStatus = () => {
    postTogglePasswordStatus(userData.username);
    changeHandler();
  };

  const userAccountData = [
    {
      dataName: 'Full Name',
      dataValue: userData.name,
    },
    {
      dataName: 'Username',
      dataValue: userData.username,
    },
    {
      dataName: 'Email',
      dataValue: userData.email,
    },
    {
      dataName: 'Active',
      dataValue: userData.isActive ? 'yes' : 'no',
    },
    {
      dataName: 'Country',
      dataValue: userData.country,
    },
    {
      dataName: 'Join Date/Time',
      dataValue: formatDate(userData.dateJoined),
    },
    {
      dataName: 'Password Status',
      dataValue: userData.passwordStatus,
    },
  ];

  const columns = [
    {
      label: 'Name',
      key: 'dataName',
    },
    {
      label: 'Value',
      key: 'dataValue',
    },
  ];

  const userIDVerificationData = [
    {
      dataName: 'Status',
      dataValue: verificationData.status,
    },
    {
      dataName: 'Expiration Date',
      dataValue: formatDate(verificationData.expirationDatetime),
    },
    {
      dataName: 'Verified',
      dataValue: verificationData.isVerified ? 'Yes' : 'No',
    },
  ];

  const ssoColumns = [
    {
      label: 'Provider',
      key: 'provider',
    },
    {
      label: 'UID',
      key: 'uid',
    },
    {
      label: 'Modified',
      key: 'modified',
    },
    {
      label: 'Extra Data',
      key: 'extra',
    },
  ];

  // Modal to display extra data for SSO records
  const openModal = (title, data) => {
    const tableData = Object.entries(data).map(([key, value]) => ({
      dataName: key,
      dataValue: value,
    }));
    setSsoExtraData(tableData);
    setExtraDataTitle(title);
    setModalIsOpen(true);
  };

  const ssoData = ssoRecords.map(result => ({
    provider: result.provider,
    uid: result.uid,
    modified: formatDate(result.modified),
    extra: {
      displayValue: Object.keys(result.extraData).length > 0 ? (
        <Button
          className="btn-link px-0"
          onClick={() => openModal(result.provider, result.extraData)}
        >
          Show
        </Button>
      ) : 'N/A',
      value: result.extraData,
    },
  }));

  return (
    <section className="mb-3">
      <div className="d-flex flex-row flex-wrap">
        <div className="flex-column p-4 m-3 card">
          <h4>Account</h4>
          <Table
            data={userAccountData}
            columns={columns}
          />
          <Button
            className={`${userData.passwordStatus === PASSWORD_STATUS.USABLE ? 'btn-outline-danger' : 'btn-outline-primary'} toggle-password`}
            onClick={togglePasswordStatus}
          >
            {userData.passwordStatus === PASSWORD_STATUS.USABLE ? 'Disable User' : 'Enable User'}
          </Button>
        </div>
        <div className="flex-column">
          <div className="flex-column p-4 m-3 card">
            <h4>ID Verification Status</h4>
            <Table
              data={userIDVerificationData}
              columns={columns}
            />
          </div>
          <div className="flex-column p-4 m-3 card">
            <h4>SSO Records</h4>
            <Table
              data={ssoData}
              columns={ssoColumns}
            />
          </div>
        </div>
        <Modal
          open={modalIsOpen}
          onClose={() => setModalIsOpen(false)}
          title={extraDataTitle}
          body={(
            <Table
              data={ssoExtraData}
              columns={columns}
            />
          )}
        />
      </div>
    </section>
  );
}

UserSummary.propTypes = {
  userData: PropTypes.shape({
    name: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    isActive: PropTypes.bool,
    country: PropTypes.string,
    dateJoined: PropTypes.string,
    passwordStatus: PropTypes.string,
  }),
  verificationData: PropTypes.shape({
    status: PropTypes.string,
    expirationDatetime: PropTypes.string,
    isVerified: PropTypes.bool,
  }),
  ssoRecords: PropTypes.shape([]),
  changeHandler: PropTypes.func.isRequired,
};

UserSummary.defaultProps = {
  userData: null,
  verificationData: null,
  ssoRecords: [],
};
