import { DataTable, TextFilter } from '@edx/paragon';
import React, { useEffect, useState } from 'react';
import { useContextSelector } from 'use-context-selector';
import { DashboardContext } from './DashboardContext';

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
          pageSize: 12,
          pageIndex: 0,
        }}
        itemCount={learnerCreditCustomers?.length}
        pageCount={12}
        data={learnerCreditCustomers}
        FilterStatusComponent={filterStatus}
        columns={[
          {
            Header: 'Customer name',
            accessor: 'customerName',
          },
          {
            Header: 'Start date',
            accessor: 'startDate',
            disableFilters: true,

          },
          {
            Header: 'End date',
            accessor: 'endDate',
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
