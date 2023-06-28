import {
  DataTable, TextFilter, IconButton, Icon, Hyperlink, Badge,
} from '@edx/paragon';
import React, {
  useCallback, useMemo,
} from 'react';
import { useContextSelector } from 'use-context-selector';
import { useHistory } from 'react-router';
import { EditOutline, DjangoShort } from '@edx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';
import debounce from 'lodash.debounce';
import { DashboardContext } from './DashboardContext';
import { MAX_PAGE_SIZE } from './data/constants';
import { useDashboardContext } from './data/hooks';

const TableActions = (args) => {
  const rowUuid = args.row.values.uuid;
  const { DJANGO_ADMIN_SUBSIDY_BASE_URL } = getConfig();
  const history = useHistory();
  return [
    getConfig().FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION && (
      <IconButton
        key="edit-icon"
        size="sm"
        src={EditOutline}
        iconAs={Icon}
        onClick={() => history.push(`/enterprise-configuration/learner-credit/${rowUuid}/edit`)}
        alt="Edit Subsidy Icon Button"
      />
    ),
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

  const fetchData = useCallback((datatableProps) => {
    const filter = () => {
      const filterObj = {};
      if (datatableProps.filters.length > 0) {
        datatableProps.filters.forEach((filterItem) => {
          filterObj[filterItem.id] = filterItem.value;
        });
      }
      return filterObj;
    };
    const sort = () => {
      if (datatableProps.sortBy[0]?.id) {
        if (datatableProps.sortBy[0].id === 'isActive') {
          return datatableProps.sortBy[0].desc ? '-expirationDatetime' : 'expirationDatetime';
        }
        return datatableProps.sortBy[0].desc ? datatableProps.sortBy[0].id : `-${datatableProps.sortBy[0].id}`;
      }
      return null;
    };
    const fetch = async ({ sortBy, filterBy }) => {
      await hydrateEnterpriseSubsidies({
        pageIndex: datatableProps.pageIndex + 1,
        sortBy,
        filterBy,
      });
    };
    fetch({
      sortBy: sort(),
      filterBy: filter(),
    });
  }, [hydrateEnterpriseSubsidies]);

  const debouncedFetchData = useMemo(() => debounce(fetchData, 250, {
    leading: false,
  }), [fetchData]);

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
            Cell: TableBadges,
            disableFilters: true,
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
