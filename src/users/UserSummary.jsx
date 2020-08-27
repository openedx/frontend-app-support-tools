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
  const [ssoModalIsOpen, setSsoModalIsOpen] = useState(false);
  const [idvModalIsOpen, setIdvModalIsOpen] = useState(false);
  const [extraSsoDataTitle, setSsoExtraDataTitle] = useState('');
  const [detailIdvDataTitle, setDetailIdvDataTitle] = useState('');
  const [ssoExtraData, setSsoExtraData] = useState([]);
  const [detailIdvData, setDetailIdvData] = useState([]);
  const userToggleVisible = false;
  // TO-DO: Only expose "Disable/Enable User" for specific roles

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

  const idvColumns = [
    {
      label: 'Status',
      key: 'status',
    },
    {
      label: 'Expiration Date',
      key: 'expirationDatetime',
    },
    {
      label: 'Is Verified',
      key: 'isVerified',
    },
    {
      label: 'Details',
      key: 'extra',
    },
  ];

  const idvDetailsColumns = [
    {
      label: 'Type',
      key: 'type',
    },
    {
      label: 'Status',
      key: 'status',
    },
    {
      label: 'Expiration Date',
      key: 'expirationDatetime',
    },
    {
      label: 'Message',
      key: 'message',
    },
    {
      label: 'Updated',
      key: 'updatedAt',
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
  const openSSOModal = (title, data) => {
    const tableData = Object.entries(data).map(([key, value]) => ({
      dataName: key,
      dataValue: value,
    }));
    setSsoExtraData(tableData);
    setSsoExtraDataTitle(title);
    setSsoModalIsOpen(true);
  };

  const ssoData = ssoRecords.map(result => ({
    provider: result.provider,
    uid: result.uid,
    modified: formatDate(result.modified),
    extra: {
      displayValue: Object.keys(result.extraData).length > 0 ? (
        <Button
          className="btn-link px-0 neg-margin-top"
          onClick={() => openSSOModal(result.provider, result.extraData)}
        >
          Show
        </Button>
      ) : 'N/A',
      value: result.extraData,
    },
  }));

  // Modal to display extra data for Idv records
  const openIDVModal = (title, data) => {
    const tableData = data.map(result => ({
      type: result.type,
      status: result.status,
      updatedAt: formatDate(result.updatedAt),
      expirationDatetime: formatDate(result.expirationDatetime),
      message: result.message,
    }));
    setDetailIdvData(tableData);
    setDetailIdvDataTitle(title);
    setIdvModalIsOpen(true);
  };

  const IdvData = [verificationData].map(result => ({
    status: result.status,
    isVerified: result.isVerified.toString(),
    expirationDatetime: formatDate(result.expirationDatetime),
    extra: {
      displayValue: result.extraData && result.extraData.length > 0 ? (
        <Button
          className="btn-link px-0 neg-margin-top"
          onClick={() => openIDVModal('ID Verification Details', result.extraData)}
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
          {userToggleVisible && (
            <Button
              className={`${userData.passwordStatus === PASSWORD_STATUS.USABLE ? 'btn-outline-danger' : 'btn-outline-primary'} toggle-password`}
              onClick={togglePasswordStatus}
            >
              {userData.passwordStatus === PASSWORD_STATUS.USABLE ? 'Disable User' : 'Enable User'}
            </Button>
          )}
        </div>
        <div className="flex-column">
          <div className="flex-column p-4 m-3 card">
            <h4>ID Verification Status</h4>
            <Table
              data={IdvData}
              columns={idvColumns}
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
          open={ssoModalIsOpen}
          onClose={() => setSsoModalIsOpen(false)}
          title={extraSsoDataTitle}
          body={(
            <Table
              data={ssoExtraData}
              columns={columns}
            />
          )}
        />
        <Modal
          open={idvModalIsOpen}
          onClose={() => setIdvModalIsOpen(false)}
          title={detailIdvDataTitle}
          body={(
            <Table
              data={detailIdvData}
              columns={idvDetailsColumns}
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
    extraData: PropTypes.shape([]),
  }),
  ssoRecords: PropTypes.shape([]),
  changeHandler: PropTypes.func.isRequired,
};

UserSummary.defaultProps = {
  userData: null,
  verificationData: null,
  ssoRecords: [],
};
