import {
  DataTable, TextFilter, IconButton, Icon, Hyperlink, Badge,
} from '@edx/paragon';
import React, {
  useCallback,
} from 'react';
import { useContextSelector } from 'use-context-selector';
import { useHistory } from 'react-router';
import { EditOutline, DjangoShort } from '@edx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';
import { DashboardContext } from './DashboardContext';
import { MAX_PAGE_SIZE } from './data/constants';
import { useDashboardContext } from './data/hooks';

const TableActions = (args) => {
  const rowUuid = args.row.values.uuid;
  const { DJANGO_ADMIN_SUBSIDY_BASE_URL } = getConfig();
  const history = useHistory();

  return [
    <IconButton
      key="edit-icon"
      size="sm"
      src={EditOutline}
      iconAs={Icon}
      onClick={() => history.push(`/enterprise-configuration/learner-credit/${rowUuid}/edit`)}
      alt="Edit Subsidy Icon Button"

    />,
    <Hyperlink
      key="django-icon"
      destination={`${DJANGO_ADMIN_SUBSIDY_BASE_URL}/admin/subsidy/subsidy/?uuid=${rowUuid}`}
      target="_blank"
      showLaunchIcon={false}
    >
      <IconButton
        size="sm"
        src={DjangoShort}
        iconAs={Icon}
        alt="Django Admin Icon Button"
      />
    </Hyperlink>,
  ];
};

const TableBadges = (args) => {
  const { isActive } = args.row.values;
  return (
    <Badge
      variant={isActive ? 'success' : 'danger'}
    >
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
};

const DashboardDatatable = () => {
  const data = useContextSelector(DashboardContext, v => v[0]);
  const { hydrateEnterpriseSubsidies } = useDashboardContext();

  // Implementation due to filterText value displaying accessor value customerName as opposed to Customer Name
  const filterStatus = (rest) => <DataTable.FilterStatus showFilteredFields={false} {...rest} />;

  const fetchData = useCallback((datableProps) => {
    const fetch = async () => {
      await hydrateEnterpriseSubsidies(datableProps.pageIndex + 1);
    };
    fetch();
  }, [hydrateEnterpriseSubsidies]);
  return (
    <section className="mt-5">
      <DataTable
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
            Header: 'Plan Status',
            accessor: 'isActive',
            Cell: TableBadges,
          },
          {
            Header: 'Customer name',
            accessor: 'enterpriseCustomerName',
          },
          {
            Header: 'Start date',
            accessor: 'activeDatetime',
            disableFilters: true,
            Cell: ({ row }) => {
              const { activeDatetime } = row.values;
              return new Date(activeDatetime).toLocaleDateString().replace(/\//g, '-');
            },
          },
          {
            Header: 'End date',
            accessor: 'expirationDatetime',
            disableFilters: true,
            Cell: ({ row }) => {
              const { expirationDatetime } = row.values;
              return new Date(expirationDatetime).toLocaleDateString().replace(/\//g, '-');
            },
          },
          {
            Header: '',
            accessor: 'actions',
            disableFilters: true,
            Cell: TableActions,
            disableSortBy: true,
          },
        ]}
      />
    </section>
  );
};

export default DashboardDatatable;
