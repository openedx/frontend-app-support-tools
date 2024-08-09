import { DataTable, TextFilter } from '@openedx/paragon';
import React, { useCallback, useMemo, useState } from 'react';
import { useContextSelector } from 'use-context-selector';
import debounce from 'lodash.debounce';
import { logError } from '@edx/frontend-platform/logging';
import { DashboardContext } from '../DashboardContext';
import { MAX_PAGE_SIZE } from '../data/constants';
import { useDashboardContext } from '../data/hooks';
import {
  CustomerNameHyperlink,
  DjangoIconHyperlink,
  PlanIdHyperlink,
  PlanTitleHyperlink,
} from './DashboardTableLinks';
import DashboardTableBadges from './DashboardTableBadges';
import { sortDataTableData, transformDataTableData, transformDatatableDate } from '../data/utils';

// Implementation due to filterText value displaying accessor value customerName as opposed to Customer Name

const FilterStatus = (rest) => <DataTable.FilterStatus showFilteredFields={false} {...rest} />;

const DashboardDataTable = () => {
  const { enterpriseSubsidies } = useContextSelector(DashboardContext, v => v[0]);
  const { hydrateEnterpriseSubsidies } = useDashboardContext();
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (datatableProps) => {
    setIsLoading(true);
    try {
      await hydrateEnterpriseSubsidies({
        pageIndex: datatableProps.pageIndex + 1,
        sortBy: sortDataTableData(datatableProps),
        filterBy: transformDataTableData(datatableProps),
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
        FilterStatusComponent={FilterStatus}
        columns={[
          {
            Header: 'Customer name',
            accessor: 'enterpriseCustomerName',
            disableSortBy: true,
            Cell: CustomerNameHyperlink,
          },
          {
            Header: 'Plan name',
            accessor: 'title',
            Cell: PlanTitleHyperlink,
          },
          {
            Header: 'Plan ID',
            accessor: 'uuid',
            Cell: PlanIdHyperlink,
          },
          {
            Header: 'Plan Status',
            accessor: 'isActive',
            disableFilters: true,
            Cell: DashboardTableBadges,
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
            Cell: DjangoIconHyperlink,
          },
        ]}
      />
    </section>
  );
};

export default DashboardDataTable;
