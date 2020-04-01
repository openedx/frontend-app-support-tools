import React from 'react';
import PropTypes from 'prop-types';
import Table from '../Table';
import moment from 'moment';

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
      dataValue: moment(userData.dateJoined).format('lll'),
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
      dataValue: verificationData.expirationDatetime ? moment(
        verificationData.expirationDatetime
      ).format('lll') : 'Not Available'
    },
    {
      dataName: 'Verified',
      dataValue: verificationData.isVerified ? 'Yes' : 'No',
    },

  ];

  return (
    <section className="mb-3">
      <h3>User Summary</h3>
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
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
};

UserSummary.defaultProps = {
  data: null,
};
