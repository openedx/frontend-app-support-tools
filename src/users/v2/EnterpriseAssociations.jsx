import React, { useEffect, useState, useMemo } from 'react';
import { DataTable } from '@edx/paragon';
import PropTypes from 'prop-types';
import { camelCaseObject } from '@edx/frontend-platform';
import { getEnterpriseCustomerUsers } from '../data/api';

export default function EnterpriseAssociations({ username }) {
  const [enterpriseCustomerUsers, setEnterpriseCustomerUsers] = useState(null);

  useEffect(() => {
    getEnterpriseCustomerUsers(username).then(data => {
      const camelCaseData = camelCaseObject(data);
      setEnterpriseCustomerUsers(camelCaseData);
    });
  }, [username]);

  // Map EnterpriseCustomerUsers to rows for data table
  const rows = useMemo(
    () => enterpriseCustomerUsers?.results?.map(ecu => ({
      enterpriseCustomerName: ecu.enterpriseCustomer.name,
      enterpriseCustomerUUID: ecu.enterpriseCustomer.uuid,
      enterpriseCustomerUserId: ecu.id,
      created: ecu.created,
      active: String(ecu.active),
      inviteKey: ecu.inviteKey,
    })),
    [enterpriseCustomerUsers],
  );

  return (
    <div className="enterprise-associations">
      <h3 className="my-3">Enterprise Associations</h3>
      <DataTable
        itemCount={rows?.length}
        data={rows ?? []}
        columns={[
          {
            Header: 'Id',
            accessor: 'enterpriseCustomerUserId',
          },
          {
            Header: 'Enterprise Name',
            accessor: 'enterpriseCustomerName',
          },
          {
            Header: 'Enterprise UUID',
            accessor: 'enterpriseCustomerUUID',
          },
          {
            Header: 'Created',
            accessor: 'created',
          },
          {
            Header: 'Active',
            accessor: 'active',
          },
          {
            Header: 'Invite Key',
            accessor: 'inviteKey',
          },
        ]}
        EmptyTableComponent={
          () => <DataTable.EmptyTable content={!enterpriseCustomerUsers ? 'Loading...' : 'User is not associated with any enterprises.'} />
        }
      />
    </div>
  );
}

EnterpriseAssociations.propTypes = {
  username: PropTypes.string.isRequired,
};
