import {
  DataTable, TextFilter, IconButton, Icon,
} from '@edx/paragon';
import React, {
  useCallback,
  useEffect, useState,
} from 'react';
import { useContextSelector } from 'use-context-selector';
import { useHistory } from 'react-router';
import { EditOutline } from '@edx/paragon/icons';
import { DashboardContext } from './DashboardContext';
import { MAX_PAGE_SIZE } from './data/constants';
import { useDashboardContext } from './data/hooks';

const DashboardDatatable = () => {
  const data = useContextSelector(DashboardContext, v => v[0]);
  const { hydrateEnterpriseSubsidies } = useDashboardContext();
  const history = useHistory();

  const editLearnerCreditPlan = (uuid) => {
    // TODO: Navigate to the edit page for the selected learner credit plan based on UUID
    history.push(`/enterprise-configuration/learner-credit/${uuid}/edit`);
  };

  const editAction = (onIconInteraction) => (
    <IconButton
      src={EditOutline}
      iconAs={Icon}
      onClick={onIconInteraction}
    />
  );

  const [learnerCreditCustomers, setLearnerCreditCustomers] = useState(data?.enterpriseSubsidies || []);
  const [pageIndex, setPageIndex] = useState(0);
  const [stateChange, setStateChange] = useState(true);
  // Implementation due to filterText value displaying accessor value customerName as opposed to Customer Name
  const filterStatus = (rest) => <DataTable.FilterStatus showFilteredFields={false} {...rest} />;
  const fetchData = useCallback((datableProps) => {
    setStateChange(pageIndex !== datableProps.pageIndex);
    if (stateChange) {
      setPageIndex(datableProps.pageIndex);
      hydrateEnterpriseSubsidies(pageIndex, editAction, editLearnerCreditPlan);
    }
  }, [stateChange]);
  useEffect(() => {
    if (data.enterpriseSubsidies) {
      setLearnerCreditCustomers(data.enterpriseSubsidies);
      setStateChange(false);
    }
  }, [data.enterpriseSubsidies]);
  return (
    <section className="mt-5">
      <DataTable
        showFiltersInSidebar
        isPaginated
        isSortable
        isFilterable
        defaultColumnValues={{ Filter: TextFilter }}
        pageCount={data.enterpriseSubsidies.pageCount}
        initialState={{
          pageSize: MAX_PAGE_SIZE,
          pageIndex,
        }}
        manualPagination
        itemCount={learnerCreditCustomers?.count || 0}
        data={learnerCreditCustomers?.results || []}
        fetchData={fetchData}
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
