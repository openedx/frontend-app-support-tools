/* eslint-disable react/prop-types */
import { fireEvent, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { camelCaseObject } from '@edx/frontend-platform';
import ROUTES from '../../../data/constants/routes';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import ProvisioningPage from '../ProvisioningPage';
import { DashboardContext, initialStateValue } from '../../testData/Dashboard';
import { sampleDataTableData } from '../../testData/constants';

const { CONFIGURATION: { SUB_DIRECTORY: { PROVISIONING } } } = ROUTES;

const mockHistoryPush = jest.fn();
const historyMock = { push: mockHistoryPush, location: {}, listen: jest.fn() };

// Mock the subsidy list
const mockGetAllSubsidiesData = sampleDataTableData(10);
jest.mock('../../../data/services/SubsidyApiService', () => ({
  getAllSubsidies: () => Promise.resolve({
    data: mockGetAllSubsidiesData,
  }),
}));

// Mock the enterprise customers list
const mockCustomerData = camelCaseObject(mockGetAllSubsidiesData).results.map((subsidy) => ({
  id: subsidy.enterpriseCustomerUuid,
  name: subsidy.customerName,
}));
jest.mock('../../../data/services/EnterpriseApiService', () => ({
  fetchEnterpriseCustomersBasicList: () => Promise.resolve({
    data: mockCustomerData,
  }),
}));

const ProvisioningPageWrapper = ({
  value = initialStateValue,
}) => (
  <Router history={historyMock}>
    <DashboardContext value={value}>
      <ProvisioningPage />
    </DashboardContext>
  </Router>
);

describe('ProvisioningPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('renders the header and new button', () => {
    renderWithRouter(<ProvisioningPageWrapper value={initialStateValue} />);
    expect(screen.getByText(PROVISIONING_PAGE_TEXT.DASHBOARD.TITLE)).toBeTruthy();
    expect(screen.getByText(PROVISIONING_PAGE_TEXT.DASHBOARD.BUTTON.new)).toBeTruthy();
  });
  it('redirects to /new when the user clicks the new button', () => {
    renderWithRouter(<ProvisioningPageWrapper />);
    const newButton = screen.getByText(PROVISIONING_PAGE_TEXT.DASHBOARD.BUTTON.new);
    fireEvent.click(newButton);
    expect(mockHistoryPush).toHaveBeenCalledWith(`${PROVISIONING.SUB_DIRECTORY.NEW}`);
  });
});
