/* eslint-disable react/prop-types */
import { screen, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import { formatDate } from '../../data/utils';
import CustomerIntegrations from '../CustomerIntegrations';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'test-id' }),
}));

jest.mock('../../data/utils', () => ({
  formatDate: jest.fn(),
}));

const mockSSOData = [{
  enterpriseCustomer: '18005882300',
  created: '2024-09-15T11:01:04.501365Z',
  modified: '2024-09-15T11:01:04.501365Z',
  displayName: 'Orange cats rule',
}];

const mockIntegratedChannelData = [
  {
    channelCode: 'MOODLE',
    enterpriseCustomer: '18005882300',
    lastModifiedAt: '2024-09-15T11:01:04.501365Z',
  },
  {
    channelCode: 'CANVAS',
    enterpriseCustomer: '18005882300',
    lastModifiedAt: '2024-09-15T11:01:04.501365Z',
  },
];

describe('CustomerViewIntegrations', () => {
  it('renders cards', async () => {
    formatDate.mockReturnValue('September 15, 2024');
    render(
      <IntlProvider locale="en">
        <CustomerIntegrations
          slug="marcel-the-shell"
          activeIntegrations={mockIntegratedChannelData}
          activeSSO={mockSSOData}
          apiCredentialsEnabled
        />
      </IntlProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText('Associated Integrations')).toBeInTheDocument();

      expect(screen.getByText('SSO')).toBeInTheDocument();
      expect(screen.getByText('Orange cats rule')).toBeInTheDocument();
      expect(screen.getByText('Created September 15, 2024 • Last modified September 15, 2024')).toBeInTheDocument();
      expect(screen.getAllByText('Open in Admin Portal')).toHaveLength(3);

      expect(screen.getAllByText('LEARNER PLATFORM')).toHaveLength(2);
      expect(screen.getByText('Moodle')).toBeInTheDocument();
      expect(screen.getByText('Canvas')).toBeInTheDocument();
      expect(screen.getAllByText('Last modified September 15, 2024')).toHaveLength(2);

      expect(screen.getByText('INTEGRATION')).toBeInTheDocument();
      expect(screen.getByText('API')).toBeInTheDocument();
    });
  });
});
