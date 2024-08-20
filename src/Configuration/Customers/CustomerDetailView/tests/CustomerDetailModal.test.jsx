/* eslint-disable react/prop-types */
import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import CustomerDetailModal from '../CustomerDetailModal';

jest.mock('../../data/utils', () => ({
  getEnterpriseCustomer: jest.fn(),
}));

const mockData = {
  active: true,
  authOrgId: null,
  country: 'US',
  defaultLanguage: 'English',
  enableDataSharingConsent: true,
  enableGenerationOfApiCredentials: true,
  enableSlugLogin: true,
  enforceDataSharingConsent: 'at_enrollment',
  hideCourseOriginalPrice: true,
  name: 'Test Customer Name',
  replaceSensitiveSsoUsername: true,
  replyTo: null,
  senderAlias: null,
  slug: 'customer-6',
  uuid: 'test-id',
};

describe('CustomerDetailModal', () => {
  it('renders customer detail modal', () => {
    const props = {
      customer: mockData,
      isOpen: true,
      close: jest.fn(() => {}),
    };
    render(
      <IntlProvider locale="en">
        <CustomerDetailModal {...props} />
      </IntlProvider>,
    );

    expect(screen.getAllByText('Test Customer Name')).toHaveLength(2);
    expect(screen.getByText('View only')).toBeInTheDocument();
    // null values will show as dashes
    expect(screen.getAllByText('--')).toHaveLength(4);
    expect(screen.getByText('customer-6')).toBeInTheDocument();
    expect(screen.getByText('At enrollment')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });
});
