/* eslint-disable react/prop-types */
import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import { formatDate } from '../../data/utils';
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
  it('renders customer card data', () => {
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
  });
});
