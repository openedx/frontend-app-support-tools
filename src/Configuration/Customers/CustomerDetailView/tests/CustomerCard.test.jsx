/* eslint-disable react/prop-types */
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import { formatDate, useCopyToClipboard } from '../../data/utils';
import CustomerCard from '../CustomerCard';

jest.mock('../../data/utils', () => ({
  getEnterpriseCustomer: jest.fn(),
  formatDate: jest.fn(),
  useCopyToClipboard: jest.fn(() => ({
    showToast: true,
    copyToClipboard: jest.fn(),
    setShowToast: jest.fn(),
  })),
}));

const mockData = {
  uuid: 'test-id',
  name: 'Test Customer Name',
  slug: 'customer-6',
  created: '2024-07-23T20:02:57.651943Z',
  modified: '2024-07-23T20:02:57.651943Z',
};

describe('CustomerCard', () => {
  it('renders customer card data', async () => {
    formatDate.mockReturnValue('July 23, 2024');
    render(
      <IntlProvider locale="en">
        <CustomerCard enterpriseCustomer={mockData} />
      </IntlProvider>,
    );
    expect(screen.getByText('test-id')).toBeInTheDocument();
    expect(screen.getByText('/customer-6/')).toBeInTheDocument();
    expect(screen.getByText('Created July 23, 2024 • Last modified July 23, 2024')).toBeInTheDocument();
    expect(screen.getByText('Test Customer Name'));
    const copy = screen.getByTestId('copy');
    userEvent.click(copy);
    await waitFor(() => expect(useCopyToClipboard).toHaveBeenCalledWith('test-id'));
    await waitFor(() => expect(screen.getByText('Copied to clipboard')).toBeInTheDocument());
  });
});
