import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Input } from '@edx/paragon';

import { postTogglePasswordStatus, postResetPassword } from './data/api';
import Table from '../Table';
import { formatDate } from '../utils';

export default function UserSummary({
  userData,
  verificationData,
  ssoRecords,
  changeHandler,
}) {
  const [ssoModalIsOpen, setSsoModalIsOpen] = useState(false);
  const [idvModalIsOpen, setIdvModalIsOpen] = useState(false);
  const [disableUserModalIsOpen, setDisableUserModalIsOpen] = useState(false);
  const [disableHistoryModalIsOpen, setDisableHistoryModalIsOpen] = useState(false);
  const [resetPasswordModalIsOpen, setResetPasswordModalIsOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [userPasswordHistoryData, setUserPasswordHistoryData] = useState([]);
  const [extraSsoDataTitle, setSsoExtraDataTitle] = useState('');
  const [detailIdvDataTitle, setDetailIdvDataTitle] = useState('');
  const [ssoExtraData, setSsoExtraData] = useState([]);
  const [detailIdvData, setDetailIdvData] = useState([]);
  const userToggleVisible = true;
  // TO-DO: Only expose "Disable/Enable User" for specific roles

  const PASSWORD_STATUS = {
    USABLE: 'Usable',
    UNUSABLE: 'Unusable',
  };

  const togglePasswordStatus = () => {
    postTogglePasswordStatus(userData.username, comment);
    changeHandler();
  };

  const resetPassword = () => {
    postResetPassword(userData.email);
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
      dataName: 'LMS User ID',
      dataValue: userData.id,
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
      dataName: 'Last Login',
      dataValue: formatDate(userData.lastLogin),
    },
    {
      dataName: 'Password Status',
      dataValue: userData.passwordStatus.status,
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
          variant="link"
          className="px-0 neg-margin-top"
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
  const openHistoryModel = () => {
    const tableData = userData.passwordStatus.passwordToggleHistory.map(result => ({
      created: formatDate(result.created),
      comment: result.comment,
      disabled: result.disabled ? 'Disabled' : 'Enabled',
      createdBy: result.createdBy,
    }));
    setUserPasswordHistoryData(tableData);
    setDisableHistoryModalIsOpen(true);
  };

  const IdvData = [verificationData].map(result => ({
    status: result.status,
    isVerified: result.isVerified.toString(),
    expirationDatetime: formatDate(result.expirationDatetime),
    extra: {
      displayValue: result.extraData && result.extraData.length > 0 ? (
        <Button
          variant="link"
          className="px-0 neg-margin-top"
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
        <div className="col-sm-6">
          <div className="flex-column p-4 m-3 card">
            <h4>Account</h4>
            <Table
              data={userAccountData}
              columns={columns}
            />
            {userToggleVisible && (
              <div>
                <Button
                  id="toggle-password"
                  variant={`${userData.passwordStatus.status === PASSWORD_STATUS.USABLE ? 'danger' : 'primary'}`}
                  onClick={() => setDisableUserModalIsOpen(true)}
                >
                  {userData.passwordStatus.status === PASSWORD_STATUS.USABLE ? 'Disable User' : 'Enable User'}
                </Button>
                <Button
                  id="reset-password"
                  variant="btn btn-danger ml-1"
                  onClick={() => setResetPasswordModalIsOpen(true)}
                >Reset Password
                </Button>
                {userData.passwordStatus.passwordToggleHistory.length > 0 && (
                  <Button
                    id="toggle-password-history"
                    variant="outline-primary ml-1"
                    onClick={() => openHistoryModel()}
                  >
                    Show History
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="col-sm-6">
          <div className="flex-column">
            <div className="flex-column p-4 m-3 card">
              <h4>ID Verification Status</h4>
              <Table
                id="idv-data"
                data={IdvData}
                columns={idvColumns}
              />
            </div>
            <div className="flex-column p-4 m-3 card">
              <h4>SSO Records</h4>
              <Table
                id="sso-data"
                data={ssoData}
                columns={ssoColumns}
              />
            </div>
          </div>
        </div>
        <Modal
          open={ssoModalIsOpen}
          onClose={() => setSsoModalIsOpen(false)}
          title={extraSsoDataTitle}
          id="sso-extra-data"
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
          id="idv-extra-data"
          body={(
            <Table
              data={detailIdvData}
              columns={idvDetailsColumns}
            />
          )}
        />
        <Modal
          open={disableHistoryModalIsOpen}
          onClose={() => setDisableHistoryModalIsOpen(false)}
          title="Enable/Disable History"
          id="password-history"
          body={(
            <Table
              data={userPasswordHistoryData}
              columns={userPasswordHistoryColumns}
            />
          )}
        />
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
          title={`${userData.passwordStatus.status === PASSWORD_STATUS.USABLE ? 'Disable user confirmation' : 'Enable user confirmation'}`}
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
        <Modal
          open={resetPasswordModalIsOpen}
          id="user-account-reset-password"
          buttons={[
            <Button
              variant="danger"
              onClick={resetPassword}
            >
              Confirm
            </Button>,
          ]}
          onClose={() => setResetPasswordModalIsOpen(false)}
          title="Reset Password"
          body={(
            <div>
              { /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
              <label>
                We will send a message with password recovery instructions to this email address {userData.email}.
                Do you wish to proceed?
              </label>
            </div>
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
    id: PropTypes.number,
    email: PropTypes.string,
    isActive: PropTypes.bool,
    country: PropTypes.string,
    dateJoined: PropTypes.string,
    lastLogin: PropTypes.string,
    passwordStatus: PropTypes.shape({
      status: PropTypes.string,
      passwordToggleHistory: PropTypes.shape([]),
    }),
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
