/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { camelCaseObject } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { DashboardContext, initialStateValue } from '../../../testData/Dashboard';
import DashboardDataTable from '../DashboardDataTable';
import { sampleDataTableData } from '../../../testData/constants';
import SubsidyApiService from '../../../../data/services/SubsidyApiService';

// Mock the debounce function
jest.mock('lodash.debounce', () => jest.fn((fn) => fn));

// Mock the subsidy list
const mockGetAllSubsidiesData = sampleDataTableData(10);
const apiMock = jest
  .spyOn(SubsidyApiService, 'getAllSubsidies')
  .mockImplementation(() => Promise.resolve({ data: mockGetAllSubsidiesData }));

// Mock the enterprise customers list
const mockCustomerData = camelCaseObject(mockGetAllSubsidiesData).results.map((subsidy) => ({
  id: subsidy.enterpriseCustomerUuid,
  name: subsidy.customerName,
}));
jest.mock('../../../../data/services/EnterpriseApiService', () => ({
  fetchEnterpriseCustomersBasicList: () => Promise.resolve({
    data: mockCustomerData,
  }),
}));

const DashboardDatatableWrapper = ({
  value = initialStateValue,
}) => (
  <IntlProvider locale="en">
    <DashboardContext value={value}>
      <DashboardDataTable />
    </DashboardContext>
  </IntlProvider>
);

describe('DashboardDatatable', () => {
  it('renders the datatable', () => {
    renderWithRouter(<DashboardDatatableWrapper />);
    expect(screen.getByText('loading')).toBeTruthy();
  });
  it('renders the datatable with data', async () => {
    renderWithRouter(<DashboardDatatableWrapper />);
    expect(screen.getByText('loading')).toBeTruthy();
    await waitFor(() => expect(screen.getByText('Enterprise Customer 1')).toBeTruthy());
  });
});

describe('DashboardDatatable SortBy', () => {
  it('sorts the data asc and desc', async () => {
    renderWithRouter(<DashboardDatatableWrapper />);
    const tableHeader = screen.getByText('Start date');

    userEvent.click(tableHeader);
    await waitFor(() => expect(apiMock).toHaveBeenCalledWith(
      expect.objectContaining(
        { sortBy: 'active_datetime' },
      ),
    ));

    userEvent.click(tableHeader);
    await waitFor(() => expect(apiMock).toHaveBeenCalledWith(
      expect.objectContaining(
        { sortBy: 'active_datetime' },
      ),
    ));
  });
});
