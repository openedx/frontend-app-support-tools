import React from 'react';
import PropTypes from 'prop-types';
import Table from '@edx/paragon/dist/Table';

export default function UserSummary({ data }) {
  if (data === null) { // FIXME in theory we shouldn't have to do this but in practice we do :(
    return null;
  }
  const tableData = [{
    name: data.name || 'not set',
    isActive: data.isActive ? 'yes' : 'no',
    email: data.email,
    country: data.country,
  }];

  const columns = [
    {
      label: 'Full Name',
      key: 'name',
      width: 'col-3',
    },
    {
      label: 'Active',
      key: 'isActive',
      width: 'col-3',
    },
    {
      label: 'Email',
      key: 'email',
      width: 'col-3',
    },
    {
      label: 'Country',
      key: 'country',
      width: 'col-3',
    },
  ];

  return (
    <section className="mb-3">
      <h3>User Summary</h3>

      {data === null
        ? (
          <div>
          User not found.
          </div>
        )
        : (
          <Table
            data={tableData}
            columns={columns}
          />
        )}
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
