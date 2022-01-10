import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { camelCaseObject } from '@edx/frontend-platform';
import { Alert } from '@edx/paragon';
import { getEnterpriseCustomerUsers } from '../data/api';
import TableV2 from '../../components/Table';
import PageLoading from '../../components/common/PageLoading';
import { formatDate } from '../../utils';

export default function EnterpriseAssociations({ username }) {
  const [enterpriseCustomerUsers, setEnterpriseCustomerUsers] = useState(null);
  const [error, setError] = useState();

  useEffect(() => {
    getEnterpriseCustomerUsers(username).then(data => {
      const camelCaseData = camelCaseObject(data);
      setEnterpriseCustomerUsers(camelCaseData);
    }).catch(er => {
      setError(er);
    });
  }, [username]);

  // Map EnterpriseCustomerUsers to table data
  const tableData = useMemo(
    () => enterpriseCustomerUsers?.map(ecu => ({
      enterpriseCustomerName: ecu.enterpriseCustomer.name,
      enterpriseCustomerUUID: ecu.enterpriseCustomer.uuid,
      enterpriseCustomerUserId: ecu.id,
      created: formatDate(ecu.created),
      active: String(ecu.active),
      roleAssignments: ecu.roleAssignments.join(', '),
      inviteKey: ecu.inviteKey,
    })),
    [enterpriseCustomerUsers],
  );

  return (
    <div className="enterprise-associations">
      <h3 className="my-3">Enterprise Associations {tableData && `(${tableData.length})`}</h3>
      {error && <Alert variant="danger">Failed to retrieve enterprise associations.</Alert>}
      {!error && enterpriseCustomerUsers ? (
        <TableV2
          styleName="custom-table"
          data={tableData}
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
              Header: 'Roles',
              accessor: 'roleAssignments',
            },
            {
              Header: 'Invite Key',
              accessor: 'inviteKey',
            },
          ]}
        />
      ) : <PageLoading srMessage="Loading.." />}
    </div>
  );
}

EnterpriseAssociations.propTypes = {
  username: PropTypes.string.isRequired,
};
