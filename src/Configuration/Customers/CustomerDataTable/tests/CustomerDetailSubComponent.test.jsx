/* eslint-disable react/prop-types */
import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import useActiveAssociatedPlans from '../../data/hooks/useActiveAssociatedPlans';
import CustomerDetailRowSubComponent from '../CustomerDetailSubComponent';

jest.mock('../../data/hooks/useActiveAssociatedPlans');

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  ...jest.requireActual('@edx/frontend-platform'),
  getConfig: jest.fn(() => ({
    ECOMMERCE_BASE_URL: 'www.ecommerce.com',
  })),
}));

describe('CustomerDetailRowSubComponent', () => {
  const row = {
    original: {
      uuid: '123456789',
    },
  };

  it('renders row with every checkmark', () => {
    useActiveAssociatedPlans.mockReturnValue({
      isLoading: false,
      data: {
        hasActiveSubscriptions: true,
        hasActiveSubsidies: true,
        hasActiveOtherSubsidies: true,
      },
    });
    render(
      <IntlProvider locale="en">
        <CustomerDetailRowSubComponent row={row} />
      </IntlProvider>,
    );
    expect(screen.getByText('Subscription')).toBeInTheDocument();
    expect(screen.getByText('Learner Credit')).toBeInTheDocument();
    expect(screen.getByText('Other Subsidies')).toBeInTheDocument();
    expect(screen.getByText('subscription check')).toBeInTheDocument();
    expect(screen.getByText('policy check')).toBeInTheDocument();
    expect(screen.getByText('other subsidies check')).toBeInTheDocument();
  });

  it('does not render check mark for subscriptions', () => {
    useActiveAssociatedPlans.mockReturnValue({
      isLoading: false,
      data: {
        hasActiveSubscriptions: false,
        hasActiveSubsidies: true,
        hasActiveOtherSubsidies: true,
      },
    });
    render(
      <IntlProvider locale="en">
        <CustomerDetailRowSubComponent row={row} />
      </IntlProvider>,
    );
    expect(screen.getByText('Subscription')).toBeInTheDocument();
    expect(screen.getByText('Learner Credit')).toBeInTheDocument();
    expect(screen.getByText('Other Subsidies')).toBeInTheDocument();
    expect(screen.queryByText('subscription check')).not.toBeInTheDocument();
    expect(screen.getByText('policy check')).toBeInTheDocument();
    expect(screen.getByText('other subsidies check')).toBeInTheDocument();
  });

  it('does not render check mark for policies', () => {
    useActiveAssociatedPlans.mockReturnValue({
      isLoading: false,
      data: {
        hasActiveSubscriptions: true,
        hasActiveSubsidies: false,
        hasActiveOtherSubsidies: true,
      },
    });
    render(
      <IntlProvider locale="en">
        <CustomerDetailRowSubComponent row={row} />
      </IntlProvider>,
    );
    expect(screen.getByText('Subscription')).toBeInTheDocument();
    expect(screen.getByText('Learner Credit')).toBeInTheDocument();
    expect(screen.getByText('Other Subsidies')).toBeInTheDocument();
    expect(screen.queryByText('policy check')).not.toBeInTheDocument();
    expect(screen.getByText('subscription check')).toBeInTheDocument();
    expect(screen.getByText('other subsidies check')).toBeInTheDocument();
  });

  it('does not render check mark for other subsidies', () => {
    useActiveAssociatedPlans.mockReturnValue({
      isLoading: false,
      data: {
        hasActiveSubscriptions: true,
        hasActiveSubsidies: true,
        hasActiveOtherSubsidies: false,
      },
    });
    render(
      <IntlProvider locale="en">
        <CustomerDetailRowSubComponent row={row} />
      </IntlProvider>,
    );
    expect(screen.getByText('Subscription')).toBeInTheDocument();
    expect(screen.getByText('Learner Credit')).toBeInTheDocument();
    expect(screen.getByText('Other Subsidies')).toBeInTheDocument();
    expect(screen.queryByText('other subsidies check')).not.toBeInTheDocument();
    expect(screen.getByText('subscription check')).toBeInTheDocument();
    expect(screen.getByText('policy check')).toBeInTheDocument();
  });
});
