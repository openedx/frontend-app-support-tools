import {
  DataTable,
  TextFilter,
} from '@edx/paragon';
import React, {
  useCallback, useMemo, useState,
} from 'react';
import { useContextSelector } from 'use-context-selector';
import debounce from 'lodash.debounce';
import { logError } from '@edx/frontend-platform/logging';
import { DashboardContext } from '../DashboardContext';
import { MAX_PAGE_SIZE } from '../data/constants';
import { useDashboardContext } from '../data/hooks';
import DashboardTableActions from './DashboardTableActions';
import DashboardTableBadges from './DashboardTableBadges';
import { filterDatatableData, sortDatatableData, transformDatatableDate } from '../data/utils';

const DashboardDatatable = () => {
  const { enterpriseSubsidies } = useContextSelector(DashboardContext, v => v[0]);
  const { hydrateEnterpriseSubsidies } = useDashboardContext();
  const [isLoading, setIsLoading] = useState(true);

  // Implementation due to filterText value displaying accessor value customerName as opposed to Customer Name
  const filterStatus = (rest) => <DataTable.FilterStatus showFilteredFields={false} {...rest} />;

  const fetchData = useCallback(async (datatableProps) => {
    setIsLoading(true);
    try {
      await hydrateEnterpriseSubsidies({
        pageIndex: datatableProps.pageIndex + 1,
        sortBy: sortDatatableData(datatableProps),
        filterBy: filterDatatableData(datatableProps),
      });
    } catch (e) {
      logError(e);
    } finally {
      setIsLoading(false);
    }
  }, [hydrateEnterpriseSubsidies]);

  const debouncedFetchData = useMemo(() => debounce(
    fetchData,
    300,
    {
      leading: false,
    },
  ), [fetchData]);

  return (
    <section className="mt-5">
      <DataTable
        isLoading={isLoading}
        isPaginated
        manualPagination
        isSortable
        manualSortBy
        isFilterable
        manualFilters
        defaultColumnValues={{ Filter: TextFilter }}
        pageCount={enterpriseSubsidies.pageCount || 0}
        initialState={{
          pageSize: MAX_PAGE_SIZE,
          pageIndex: 0,
        }}
        itemCount={enterpriseSubsidies?.count || 0}
        data={enterpriseSubsidies.results}
        fetchData={debouncedFetchData}
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
            Header: 'Plan Status',
            accessor: 'isActive',
            disableFilters: true,
            Cell: DashboardTableBadges,
          },
          {
            Header: 'Customer name',
            accessor: 'enterpriseCustomerName',
            disableSortBy: true,
          },
          {
            Header: 'Start date',
            accessor: 'activeDatetime',
            disableFilters: true,
            Cell: ({ row }) => transformDatatableDate(row.values.activeDatetime),
          },
          {
            Header: 'End date',
            accessor: 'expirationDatetime',
            disableFilters: true,
            Cell: ({ row }) => transformDatatableDate(row.values.expirationDatetime),
          },
          {
            Header: '',
            accessor: 'actions',
            disableFilters: true,
            disableSortBy: true,
            Cell: DashboardTableActions,
          },
        ]}
      />
    </section>
  );
};

export default DashboardDatatable;
