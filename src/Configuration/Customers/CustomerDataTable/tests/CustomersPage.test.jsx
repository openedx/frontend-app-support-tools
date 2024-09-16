/* eslint-disable react/prop-types */
import { screen, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import CustomersPage from '../CustomersPage';
import LmsApiService from '../../../../data/services/EnterpriseApiService';

const mockData = [{
  name: 'Ubuntu',
  slug: 'test-ubuntu',
  uuid: 'test-enterprise-uuid',
  activeIntegrations: [{
    channelCode: 'test-channel',
    created: 'jan 1, 1992',
    modified: 'jan 2, 1992',
    displayName: 'test channel',
    active: true,
  }],
  activeSsoConfigurations: [{
    created: 'jan 1, 1992',
    modified: 'jan 2, 1992',
    displayName: 'test channel',
    active: true,
  }],
  enableGenerationOfApiCredentials: true,
}];

jest.mock('lodash.debounce', () => jest.fn((fn) => fn));
jest
  .spyOn(LmsApiService, 'fetchEnterpriseCustomerSupportTool')
  .mockImplementation(() => Promise.resolve({ data: mockData }));

describe('CustomersPage', () => {
  it('renders the datatable with data', async () => {
    render(
      <IntlProvider locale="en">
        <CustomersPage />
      </IntlProvider>,
    );
    expect(screen.getByText('loading')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Ubuntu')).toBeInTheDocument();
      expect(screen.getByText('/test-ubuntu/')).toBeInTheDocument();
      expect(screen.getByText('test-enterprise-uuid')).toBeInTheDocument();
      expect(screen.getByText('Lms Check')).toBeInTheDocument();
      expect(screen.getByText('SSO Check')).toBeInTheDocument();
      expect(screen.getByText('API Check')).toBeInTheDocument();
    });
    expect(screen.getByText('View subsidies')).toBeInTheDocument();
    expect(screen.getByText('Customers')).toBeInTheDocument();
    expect(screen.getByText('Customer details')).toBeInTheDocument();
    expect(screen.getByText('SSO')).toBeInTheDocument();
    expect(screen.getByText('LMS')).toBeInTheDocument();
    expect(screen.getByText('API')).toBeInTheDocument();
  });
});
