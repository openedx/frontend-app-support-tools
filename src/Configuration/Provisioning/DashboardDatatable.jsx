import { DataTable, TextFilter } from '@edx/paragon';
import React, { useEffect, useState } from 'react';
import { useContextSelector } from 'use-context-selector';
import { DashboardContext } from './DashboardContext';
import { MAX_PAGE_SIZE } from './data/constants';

const DashboardDatatable = () => {
  const data = useContextSelector(DashboardContext, v => v[0]);
  const [learnerCreditCustomers, setLearnerCreditCustomers] = useState([]);

  useEffect(() => {
    if (data.enterpriseSubsidies) {
      setLearnerCreditCustomers(data.enterpriseSubsidies[0] || []);
    }
  }, [data.enterpriseSubsidies]);

  // Implementation due to filterText value displaying accessor value customerName as opposed to Customer Name
  const filterStatus = (rest) => <DataTable.FilterStatus showFilteredFields={false} {...rest} />;
  return (
    <section className="mt-5">
      <DataTable
        isPaginated
        isSortable
        isFilterable
        defaultColumnValues={{ Filter: TextFilter }}
        initialState={{
          pageSize: MAX_PAGE_SIZE,
          pageIndex: 0,
        }}
        itemCount={learnerCreditCustomers?.length}
        data={learnerCreditCustomers}
        FilterStatusComponent={filterStatus}
        columns={[
          {
            Header: 'Plan ID',
            accessor: 'uuid',
          },
          {
            Header: 'Plan name',
            accessor: 'title',
          },
          {
            Header: 'Customer name',
            accessor: 'customerName',
          },
          {
            Header: 'Start date',
            accessor: 'activeDatetime',
            disableFilters: true,

          },
          {
            Header: 'End date',
            accessor: 'expirationDatetime',
            disableFilters: true,

          },
          {
            Header: '',
            accessor: 'actions',
            disableFilters: true,
          },
        ]}
      />
    </section>
  );
};

export default DashboardDatatable;
