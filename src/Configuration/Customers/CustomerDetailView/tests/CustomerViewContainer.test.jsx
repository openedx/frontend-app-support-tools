/* eslint-disable react/prop-types */
import { screen, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import { getEnterpriseCustomer, formatDate } from '../../data/utils';
import CustomerViewContainer from '../CustomerViewContainer';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'test-id' }),
}));

jest.mock('../../data/utils', () => ({
  getEnterpriseCustomer: jest.fn(),
  formatDate: jest.fn(),
  useCopyToClipboard: jest.fn(() => ({
    showToast: true,
    copyToClipboard: jest.fn(),
    setShowToast: jest.fn(),
  })),
}));

describe('CustomerViewContainer', () => {
  it('renders data', async () => {
    getEnterpriseCustomer.mockReturnValue([{
      uuid: 'test-id',
      name: 'Test Customer Name',
      slug: 'customer-6',
      created: '2024-07-23T20:02:57.651943Z',
      modified: '2024-07-23T20:02:57.651943Z',
    }]);
    formatDate.mockReturnValue('July 23, 2024');
    render(
      <IntlProvider locale="en">
        <CustomerViewContainer />
      </IntlProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText('test-id')).toBeInTheDocument();
      expect(screen.getByText('/customer-6/')).toBeInTheDocument();
      expect(screen.getByText('Created July 23, 2024 • Last modified July 23, 2024')).toBeInTheDocument();
      const customerNameText = screen.getAllByText('Test Customer Name');
      customerNameText.forEach(customerName => {
        expect(customerName).toBeInTheDocument();
      });
    });
  });
});
