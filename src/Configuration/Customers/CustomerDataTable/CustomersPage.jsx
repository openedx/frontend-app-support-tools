import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
} from 'react';
import debounce from 'lodash.debounce';
import {
  Container, DataTable, TextFilter,
} from '@openedx/paragon';
import { camelCaseObject } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';

import {
  CustomerDetailLink,
  SSOCheck,
  LmsCheck,
  ApiCheck,
} from './CustomerDetails';
import LmsApiService from '../../../data/services/EnterpriseApiService';
import CustomerDetailRowSubComponent from './CustomerDetailSubComponent';

const CustomersPage = () => {
  const [enterpriseList, setEnterpriseList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(
    async () => {
      try {
        const { data } = await LmsApiService.fetchEnterpriseCustomerSupportTool();
        const result = camelCaseObject(data);
        setEnterpriseList(result);
      } catch (error) {
        logError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const debouncedFetchData = useMemo(() => debounce(
    fetchData,
    300,
  ), [fetchData]);

  useEffect(() => {
    debouncedFetchData();
  }, [debouncedFetchData]);

  return (
    <Container className="mt-5">
      <h1>Customers</h1>
      <section className="mt-5">
        <DataTable
          isLoading={isLoading}
          isExpandable
          initialState={{
            pageSize: 12,
          }}
          renderRowSubComponent={({ row }) => <CustomerDetailRowSubComponent row={row} />}
          isPaginated
          isSortable
          isFilterable
          defaultColumnValues={{ Filter: TextFilter }}
          itemCount={enterpriseList?.length || 0}
          data={enterpriseList || []}
          columns={[
            {
              id: 'expander',
              Header: DataTable.ExpandAll,
              Cell: DataTable.ExpandRow,
            },
            {
              id: 'customer details',
              Header: 'Customer details',
              accessor: 'name',
              Cell: CustomerDetailLink,
            },
            {
              id: 'sso',
              Header: 'SSO',
              accessor: 'activeSsoConfigurations',
              disableFilters: true,
              Cell: SSOCheck,
            },
            {
              id: 'lms',
              Header: 'LMS',
              accessor: 'activeIntegrations',
              disableFilters: true,
              Cell: LmsCheck,
            },
            {
              id: 'api',
              Header: 'API',
              accessor: 'enableGenerationOfApiCredentials',
              disableFilters: true,
              Cell: ApiCheck,
            },
          ]}
        />
      </section>
    </Container>
  );
};

export default CustomersPage;
