import React, { useMemo } from 'react';

import {
  DataTable, Icon, OverlayTrigger, Stack, TextFilter, Tooltip,
} from '@edx/paragon';
import { Check, InfoOutline } from '@edx/paragon/icons';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

export const OtherSubsidies = () => (
  <Stack gap={1} direction="horizontal">
    <span data-testid="members-table-status-column-header">
      <FormattedMessage
        id="configuration.customersPage.otherSubsidiesColumn"
        defaultMessage="Other Subsidies"
        description="Other subsidies column header in the Customers table"
      />
    </span>
    <OverlayTrigger
      key="other-subsidies-tooltip"
      placement="top"
      overlay={(
        <Tooltip id="other-subsidies-tooltip">
          <div>
            <FormattedMessage
              id="configuration.customersPage.otherSubsidiesColumn.tooltip"
              defaultMessage="Includes Offers and Codes"
              description="Tooltip for the Other Subsidies column header in the Customers table"
            />
          </div>
        </Tooltip>
      )}
    >
      <Icon size="xs" src={InfoOutline} className="ml-1 d-inline-flex" />
    </OverlayTrigger>
  </Stack>
);

const CheckIcon = () => (
  <Icon src={Check} className="ml-3" />
);

const CustomersPage = () => {
  const data = useMemo(() => [
    {
      customerDetails: 'customer1',
    },
    {
      customerDetails: 'customer2',
    },
    {
      customerDetails: 'customer3',
    },
  ], []);

  return (
    <div className="container-fluid">
      <section className="mt-3">
        <h2 className="font-weight-bold">Customers</h2>
      </section>
      <DataTable
        isExpandable
        renderRowSubComponent={OtherSubsidies}
        isPaginated
        isSortable
        isFilterable
        manualFilters
        defaultColumnValues={{ Filter: TextFilter }}
        pageCount={0}
        itemCount={data.length}
        data={data}
        columns={[
          {
            id: 'expander',
            Header: DataTable.ExpandAll,
            Cell: DataTable.ExpandRow,
          },
          {
            id: 'customerDetails',
            Header: 'Customer details',
            accessor: 'customerDetails',
          },
          {
            id: 'subscription',
            Header: 'Subscription',
            Cell: CheckIcon,
          },
          {
            id: 'learnerCredit',
            Header: 'Learner Credit',
            Cell: CheckIcon,
          },
          {
            id: 'sso',
            Header: 'SSO',
            Cell: CheckIcon,
          },
          {
            id: 'lms',
            Header: 'LMS',
            Cell: CheckIcon,
          },
          {
            id: 'api',
            Header: 'API',
            Cell: CheckIcon,
          },
        ]}
      />
    </div>
  );
};

export default CustomersPage;
