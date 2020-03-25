import React from 'react';
import PropTypes from 'prop-types';
import Table from '../Table';

const notSetStr = 'not set';

export default function UserSummary({ data }) {

  const tableData = [{
    username: data.username,
    name: data.name || notSetStr,
    isActive: data.isActive ? 'yes' : 'no',
    email: data.email,
    country: data.country || notSetStr,
    dateJoined: data.dateJoined,
  }];

  const columns = [
    {
      label: 'Username',
      key: 'username',
    },
    {
      label: 'Email',
      key: 'email',
    },
    {
      label: 'Active',
      key: 'isActive',
    },
    {
      label: 'Full Name',
      key: 'name',
    },
    {
      label: 'Country',
      key: 'country',
    },
    {
      label: 'Date Joined',
      key: 'dateJoined',
      date: true,
    },
  ];

  return (
    <section className="mb-3">
      <h3>User Summary</h3>
      <Table
        data={tableData}
        columns={columns}
      />
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
