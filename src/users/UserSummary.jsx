import React from 'react';
import PropTypes from 'prop-types';

import Table from '../Table';
import formatDate from '../dates/formatDate';

export default function UserSummary({ userData, verificationData }) {
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

  return (
    <section className="mb-3">
      <div className="d-flex flex-row ">
        <div className="flex-column p-4 m-3 card">
          <h4>Account</h4>
          <Table
            data={userAccountData}
            columns={columns}
          />
        </div>
        <div className="flex-column p-4 m-3 card">
          <h4>ID Verification Status</h4>
          <Table
            data={userIDVerificationData}
            columns={columns}
          />
        </div>
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
  }),
  verificationData: PropTypes.shape({
    status: PropTypes.string,
    expirationDatetime: PropTypes.string,
    isVerified: PropTypes.bool,
  }),
};

UserSummary.defaultProps = {
  userData: null,
  verificationData: null,
};
