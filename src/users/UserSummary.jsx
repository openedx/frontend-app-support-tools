import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Input } from '@edx/paragon';
import { getConfig } from '@edx/frontend-platform';
import { postTogglePasswordStatus, postResetPassword } from './data/api';
import Table from '../Table';
import { formatDate, titleCase } from '../utils';
import { getAccountActivationUrl } from './data/urls';
import IdentityVerificationStatus from './IdentityVerificationStatus';
import SingleSignOnRecords from './SingleSignOnRecords';

export default function UserSummary({
  userData,
  onboardingData,
  changeHandler,
}) {
  const [disableUserModalIsOpen, setDisableUserModalIsOpen] = useState(false);
  const [disableHistoryModalIsOpen, setDisableHistoryModalIsOpen] = useState(false);
  const [resetPasswordModalIsOpen, setResetPasswordModalIsOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [userPasswordHistoryData, setUserPasswordHistoryData] = useState([]);
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

  const proctoringColumns = [
    {
      label: 'Onboarding Status',
      key: 'status',
    },
    {
      label: 'Expiration Date',
      key: 'expirationDate',
    },
    {
      label: 'Onboarding Link',
      key: 'onboardingLink',
    },
  ];

  const proctoringData = [onboardingData].map(result => ({
    status: result.onboardingStatus ? titleCase(result.onboardingStatus) : 'Not Started',
    expirationDate: formatDate(result.expirationDate),
    onboardingLink: result.onboardingLink ? {
      displayValue: <a href={`${getConfig().LMS_BASE_URL}${result.onboardingLink}`} rel="noopener noreferrer" target="_blank" className="word_break">Link</a>,
      value: result.onboardingLink,
    } : 'N/A',
  }));

  if (!userData.isActive) {
    let dataValue;
    if (userData.activationKey !== null) {
      dataValue = {
        displayValue: <a href={getAccountActivationUrl(userData.activationKey)} rel="noopener noreferrer" target="_blank" className="word_break">{userData.activationKey}</a>,
      };
    } else {
      dataValue = 'N/A';
    }

    userAccountData.splice(5, 0,
      {
        dataName: 'Activation Key/Link',
        dataValue,
      });
  }

  return (
    <section className="mb-3">
      <div className="d-flex flex-row flex-wrap">
        <div className="col-sm-6">
          <div id="account-table" className="flex-column p-4 m-3 card">
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
              <h4>Proctoring Information</h4>
              <Table
                id="proctoring-data"
                data={proctoringData}
                columns={proctoringColumns}
              />
            </div>
            <IdentityVerificationStatus username={userData.username} />
            <SingleSignOnRecords username={userData.username} />
          </div>
        </div>
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
    activationKey: PropTypes.string,
    isActive: PropTypes.bool,
    country: PropTypes.string,
    dateJoined: PropTypes.string,
    lastLogin: PropTypes.string,
    passwordStatus: PropTypes.shape({
      status: PropTypes.string,
      passwordToggleHistory: PropTypes.shape([]),
    }),
  }),
  onboardingData: PropTypes.shape({
    onboardingStatus: PropTypes.string,
    expirationDate: PropTypes.string,
    onboardingLink: PropTypes.string,
  }),
  changeHandler: PropTypes.func.isRequired,
};

UserSummary.defaultProps = {
  userData: null,
  onboardingData: null,
};
