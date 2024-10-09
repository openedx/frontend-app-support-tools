import React, {
  useMemo,
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import {
  Container, DataTable, Icon, OverlayTrigger, TextFilter, Tooltip,
} from '@openedx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { camelCaseObject } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';
import { InfoOutline } from '@openedx/paragon/icons';

import {
  CustomerDetailLink,
  SSOCheck,
  LmsCheck,
  ApiCheck,
} from './CustomerDetails';
import LmsApiService from '../../../data/services/EnterpriseApiService';
import CustomerDetailRowSubComponent from './CustomerDetailSubComponent';

const expandAllRowsHandler = ({ getToggleAllRowsExpandedProps }) => (
  <button type="button" className="btn btn-link btn-inline font-weight-bold" {...getToggleAllRowsExpandedProps()}>
    View subsidies
    <OverlayTrigger
      key="other-subsidies-tooltip"
      placement="top"
      overlay={(
        <Tooltip id="other-subsidies-tooltip">
          <div>
            <FormattedMessage
              id="configuration.customersPage.viewSubsidiesColumn.tooltip"
              defaultMessage="A checkmark indicates an active subsidy."
              description="Tooltip for the View subsidies column header in the Customers table"
            />
          </div>
        </Tooltip>
      )}
    >
      <Icon size="xs" src={InfoOutline} className="ml-1 d-inline-flex" />
    </OverlayTrigger>
  </button>
);

const CustomersPage = () => {
  const [enterpriseList, setEnterpriseList] = useState({
    itemCount: 0,
    pageCount: 0,
    results: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = useCallback(async (args) => {
    try {
      setIsLoading(true);
      const options = {};
      args.filters.forEach((filter) => {
        const { id, value } = filter;
        if (id === 'name') {
          options.user_query = value;
        }
      });
      options.page = args.pageIndex + 1;
      const { data } = await LmsApiService.fetchEnterpriseCustomerSupportTool(options);
      const result = camelCaseObject(data);
      setEnterpriseList({
        itemCount: result.count,
        pageCount: result.numPages,
        results: result.results,
      });
    } catch (error) {
      logError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetchData = useMemo(() => debounce(
    fetchData,
    300,
  ), [fetchData]);

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
          manualPagination
          manualFilters
          isFilterable
          fetchData={debouncedFetchData}
          defaultColumnValues={{ Filter: TextFilter }}
          itemCount={enterpriseList.itemCount}
          pageCount={enterpriseList.pageCount}
          data={enterpriseList.results || []}
          columns={[
            {
              id: 'expander',
              Header: expandAllRowsHandler,
              Cell: DataTable.ExpandRow,
            },
            {
              id: 'name',
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

expandAllRowsHandler.propTypes = {
  getToggleAllRowsExpandedProps: PropTypes.func.isRequired,
};

export default CustomersPage;
