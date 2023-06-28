/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { screen, waitFor } from '@testing-library/react';
import { camelCaseObject } from '@edx/frontend-platform';
import { DashboardContext, initialStateValue } from '../../../testData/Dashboard';
import DashboardDatatable from '../DashboardDatatable';
import { sampleDataTableData } from '../../../testData/constants';

// Mock the debounce function
jest.mock('lodash.debounce', () => jest.fn((fn) => fn));

// Mock the subsidy list
const mockGetAllSubsidiesData = sampleDataTableData(10);
jest.mock('../../../../data/services/SubsidyApiService', () => ({
  getAllSubsidies: () => Promise.resolve({
    data: mockGetAllSubsidiesData,
  }),
}));

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
  <DashboardContext value={value}>
    <DashboardDatatable />
  </DashboardContext>
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
