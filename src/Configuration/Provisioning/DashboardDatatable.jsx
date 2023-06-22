import {
  DataTable, TextFilter, IconButton, Icon, Hyperlink,
} from '@edx/paragon';
import React, {
  useCallback,
  useEffect, useMemo, useState,
} from 'react';
import { useContextSelector } from 'use-context-selector';
import { useHistory } from 'react-router';
import { EditOutline } from '@edx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';
import { DashboardContext } from './DashboardContext';
import { MAX_PAGE_SIZE } from './data/constants';
import { useDashboardContext } from './data/hooks';
import SvgDjango from './data/images/SvgDjango';

const DashboardDatatable = () => {
  const data = useContextSelector(DashboardContext, v => v[0]);
  const { hydrateEnterpriseSubsidies } = useDashboardContext();
  const history = useHistory();
  const { DJANGO_ADMIN_SUBSIDY_BASE_URL } = getConfig();

  const dashboardPageAction = useCallback((uuid) => (
    [
      <IconButton
        src={EditOutline}
        iconAs={Icon}
        onClick={() => history.push(`/enterprise-configuration/learner-credit/${uuid}/edit`)}
      />,
      <Hyperlink
        destination={`${DJANGO_ADMIN_SUBSIDY_BASE_URL}/admin/subsidy/subsidy/?uuid=${uuid}`}
        target="_blank"
        showLaunchIcon={false}
      >
        <IconButton
          src={SvgDjango}
          iconAs={Icon}
        />
      </Hyperlink>,
    ]
  ), [DJANGO_ADMIN_SUBSIDY_BASE_URL, history]);

  // Implementation due to filterText value displaying accessor value customerName as opposed to Customer Name
  const filterStatus = (rest) => <DataTable.FilterStatus showFilteredFields={false} {...rest} />;

  const fetchData = useCallback((datableProps) => {
    const fetch = async () => {
      await hydrateEnterpriseSubsidies(datableProps.pageIndex + 1, dashboardPageAction);
    };
    fetch();
  }, [hydrateEnterpriseSubsidies, dashboardPageAction]);

  return (
    <section className="mt-5">
      <DataTable
        showFiltersInSidebar
        isLoading
        isPaginated
        manualPagination
        isSortable
        manualSortBy
        isFilterable
        manualFilters
        defaultColumnValues={{ Filter: TextFilter }}
        pageCount={data.enterpriseSubsidies.pageCount || 0}
        initialState={{
          pageSize: MAX_PAGE_SIZE,
          pageIndex: 0,
        }}
        itemCount={data.enterpriseSubsidies?.count || 0}
        data={data.enterpriseSubsidies.results}
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
            accessor: 'enterpriseCustomerName',
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
