import React from 'react';
import PropTypes from 'prop-types';
import Table from '../Table';
import { formatDate } from '../utils';
import { getAccountActivationUrl } from './data/urls';
import IdentityVerificationStatus from './IdentityVerificationStatus';
import OnboardingStatus from './OnboardingStatus';
import SingleSignOnRecords from './SingleSignOnRecords';
import TogglePasswordStatus from './account-actions/TogglePasswordStatus';
import ResetPassword from './account-actions/ResetPassword';
import PasswordHistory from './account-actions/PasswordHistory';

export default function UserSummary({
  userData,
  changeHandler,
}) {
  const userToggleVisible = true;
  // TO-DO: Only expose "Disable/Enable User" for specific roles

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
              <div className="row ml-2">
                <TogglePasswordStatus
                  username={userData.username}
                  passwordStatus={userData.passwordStatus}
                  changeHandler={changeHandler}
                />
                <ResetPassword
                  email={userData.email}
                  changeHandler={changeHandler}
                />
                <PasswordHistory
                  passwordStatus={userData.passwordStatus}
                />
              </div>
            )}
          </div>
        </div>
        <div className="col-sm-6">
          <div className="flex-column">
            <IdentityVerificationStatus username={userData.username} />
            <OnboardingStatus username={userData.username} />
            <SingleSignOnRecords username={userData.username} />
          </div>
        </div>
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
  changeHandler: PropTypes.func.isRequired,
};

UserSummary.defaultProps = {
  userData: null,
};
