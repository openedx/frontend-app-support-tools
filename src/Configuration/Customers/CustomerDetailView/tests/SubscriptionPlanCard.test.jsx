/* eslint-disable react/prop-types */
import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getConfig } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import { formatDate } from '../../data/utils';
import SubscriptionPlanCard from '../SubscriptionPlanCard';

jest.mock('../../data/utils', () => ({
  formatDate: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

const mockData = {
  isActive: true,
  subscription: {
    startDate: '2024-08-23T20:02:57.651943Z',
    created: '2024-08-23T20:02:57.651943Z',
    expirationDate: '2024-08-23T20:02:57.651943Z',
    uuid: 'test-uuid',
  },
  slug: 'test-customer-slug',
};

describe('SubscriptionPlanCard', () => {
  it('renders active SubscriptionPlanCard data', () => {
    formatDate.mockReturnValue('Aug 23, 2024');
    getConfig.mockImplementation(() => ({
      ADMIN_PORTAL_BASE_URL: 'http://www.testportal.com',
      LICENSE_MANAGER_DJANGO_URL: 'http:www.license-manager.com',
    }));
    render(
      <IntlProvider locale="en">
        <SubscriptionPlanCard {...mockData} />
      </IntlProvider>,
    );
    expect(screen.getByText('SUBSCRIPTION PLAN')).toBeInTheDocument();
    expect(screen.getByText('Aug 23, 2024 - Aug 23, 2024')).toBeInTheDocument();
    expect(screen.getByText('Created Aug 23, 2024')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View plan' })).toHaveAttribute('href', 'http://www.testportal.com/test-customer-slug/admin/subscriptions/manage-learners/test-uuid');
    expect(screen.getByRole('link', { name: 'Open in Django' })).toHaveAttribute('href', 'http:www.license-manager.com/admin/subscriptions/subscriptionplan/test-uuid/change');
  });

  it('renders inactive SubscriptionPlanCard data', () => {
    formatDate.mockReturnValue('Aug 23, 2024');
    const inactiveSubscription = {
      ...mockData,
      isActive: false,
    };
    getConfig.mockImplementation(() => ({
      ADMIN_PORTAL_BASE_URL: 'http://www.testportal.com',
      LICENSE_MANAGER_DJANGO_URL: 'http:www.license-manager.com',
    }));
    render(
      <IntlProvider locale="en">
        <SubscriptionPlanCard {...inactiveSubscription} />
      </IntlProvider>,
    );
    expect(screen.getByText('SUBSCRIPTION PLAN')).toBeInTheDocument();
    expect(screen.getByText('Aug 23, 2024 - Aug 23, 2024')).toBeInTheDocument();
    expect(screen.getByText('Created Aug 23, 2024')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View plan' })).toHaveAttribute('href', 'http://www.testportal.com/test-customer-slug/admin/subscriptions/manage-learners/test-uuid');
    expect(screen.getByRole('link', { name: 'Open in Django' })).toHaveAttribute('href', 'http:www.license-manager.com/admin/subscriptions/subscriptionplan/test-uuid/change');
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });
});
