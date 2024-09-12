/* eslint-disable react/prop-types */
import { screen, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { getConfig } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import { formatDate } from '../../data/utils';
import CustomerPlanContainer from '../CustomerPlanContainer';

jest.mock('../../data/hooks/useAllAssociatedPlans');

jest.mock('../../data/utils', () => ({
  formatDate: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

const CUSTOMER_SLUG = 'test-slug';

describe('CustomerPlanContainer', () => {
  it('renders CustomerPlanContainer data', async () => {
    formatDate
      .mockReturnValueOnce('Aug 23, 2024')
      .mockReturnValueOnce('Aug 24, 2024')
      .mockReturnValueOnce('Aug 22, 2024')
      .mockReturnValueOnce('Sep 1, 2024')
      .mockReturnValueOnce('Sep 2, 2024')
      .mockReturnValueOnce('Aug 31, 2024')
      .mockReturnValueOnce('Oct 23, 2022')
      .mockReturnValueOnce('Oct 24, 2022')
      .mockReturnValueOnce('Aug 22, 2022');

    getConfig.mockImplementation(() => ({
      ADMIN_PORTAL_BASE_URL: 'http://www.testportal.com',
      ENTERPRISE_ACCESS_BASE_URL: 'http:www.enterprise-access.com',
      LICENSE_MANAGER_URL: 'http:www.license-manager.com',
    }));
    const mockProps = {
      isLoading: false,
      activePolicies: [{
        subsidyActiveDatetime: '2024-08-23T20:02:57.651943Z',
        created: '2024-08-22T20:02:57.651943Z',
        subsidyExpirationDatetime: '2024-08-24T20:02:57.651943Z',
        uuid: 'test-uuid',
        policyType: 'learnerCredit',
        isSubsidyActive: true,
      }],
      activeSubscriptions: [{
        startDate: '2024-09-01T20:02:57.651943Z',
        created: '2024-08-31T20:02:57.651943Z',
        expirationDate: '2024-09-02T20:02:57.651943Z',
        uuid: 'test-uuid',
      }],
      countOfActivePlans: 2,
      countOfAllPlans: 3,
      inactiveSubscriptions: [],
      inactivePolicies: [{
        subsidyActiveDatetime: '2024-08-23T20:02:57.651943Z',
        created: '2024-08-23T20:02:57.651943Z',
        subsidyExpirationDatetime: '2024-08-23T20:02:57.651943Z',
        uuid: 'test-uuid',
        policyType: 'learnerCredit',
        isSubsidyActive: false,
      }],
    };
    render(
      <IntlProvider locale="en">
        <CustomerPlanContainer slug={CUSTOMER_SLUG} {...mockProps} />
      </IntlProvider>,
    );
    const djangoLinks = screen.getAllByRole('link', { name: 'Open in Django' });
    expect(screen.getByText('Associated subsidy plans (2)')).toBeInTheDocument();
    // Learner Credit Plan Card
    expect(screen.queryByText('Inactive')).not.toBeInTheDocument();
    expect(screen.getByText('LEARNER CREDIT PLAN')).toBeInTheDocument();
    expect(screen.getByText('Aug 23, 2024 - Aug 24, 2024')).toBeInTheDocument();
    expect(screen.getByText('Created Aug 22, 2024')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View budgets' })).toHaveAttribute('href', 'http://www.testportal.com/test-slug/admin/learner-credit/test-uuid');
    expect(djangoLinks[0]).toHaveAttribute('href', 'http:www.enterprise-access.com/admin/subsidy_access_policy/learnercredit/test-uuid');
    // Subscription Plan
    expect(screen.getByText('SUBSCRIPTION PLAN')).toBeInTheDocument();
    expect(screen.getByText('Sep 1, 2024 - Sep 2, 2024')).toBeInTheDocument();
    expect(screen.getByText('Created Aug 31, 2024')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View plan' })).toHaveAttribute('href', 'http://www.testportal.com/test-slug/admin/subscriptions/manage-learners/test-uuid');
    expect(djangoLinks[1]).toHaveAttribute('href', 'http:www.license-manager.com/admin/subscriptions/subscriptionplan/test-uuid/change');

    // click on show inactive plans toggle
    const toggle = screen.getByTestId('show-removed-toggle');
    userEvent.click(toggle);
    await waitFor(() => expect(screen.getByText('Associated subsidy plans (3)')).toBeInTheDocument());
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });
});
