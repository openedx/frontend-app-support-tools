/* eslint-disable react/prop-types */
import {
  screen,
  render,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  EnterpriseCustomerUserDetail,
  AdministratorCell,
  LearnerCell,
} from '../EnterpriseCustomerUserDetail';

describe('EnterpriseCustomerUserDetail', () => {
  it('renders enterprise customer detail', () => {
    const enterpriseCustomerUser = {
      original: {
        enterpriseCustomerUser: {
          username: 'ash ketchum',
          email: 'ash@ketchum.org',
        },
      },
    };
    render(<EnterpriseCustomerUserDetail row={enterpriseCustomerUser} />);
    expect(screen.getByText('ash ketchum')).toBeInTheDocument();
    expect(screen.getByText('ash@ketchum.org')).toBeInTheDocument();
    expect(screen.getByTestId('icon-hyperlink')).toHaveAttribute('href', '/learner-information/?email=ash@ketchum.org');
    expect(screen.getByTestId('username-email-hyperlink')).toHaveAttribute('href', '/learner-information/?email=ash@ketchum.org');
  });

  it('renders pending enterprise customer detail', () => {
    const pendingEnterpriseCustomerUser = {
      original: {
        pendingEnterpriseCustomerUser: {
          userEmail: 'pending@customer.org',
        },
      },
    };
    render(<EnterpriseCustomerUserDetail row={pendingEnterpriseCustomerUser} />);
    expect(screen.getByText('pending@customer.org')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-hyperlink')).not.toBeInTheDocument();
    expect(screen.queryByTestId('username-email-hyperlink')).not.toBeInTheDocument();
  });

  it('renders AdministratorCell there is a pending admin', () => {
    const pendingAdmin = {
      original: {
        pendingEnterpriseCustomerUser: {
          isPendingAdmin: true,
        },
        roleAssignments: ['enterprise_learner'],
      },
    };
    render(<AdministratorCell row={pendingAdmin} />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders AdministratorCell there is a registered admin', () => {
    const adminRow = {
      original: {
        pendingEnterpriseCustomerUser: {
          isPendingAdmin: false,
        },
        roleAssignments: ['enterprise_admin'],
      },
    };
    render(<AdministratorCell row={adminRow} />);
    expect(screen.queryByText('Pending')).not.toBeInTheDocument();
  });

  it('renders LearnerCell when there is a registered learner and not pending', () => {
    const learnerRow = {
      original: {
        pendingEnterpriseCustomerUser: null,
        enterpriseCustomerUser: {
          username: 'ash ketchum',
          email: 'ash@ketchum.org',
        },
        roleAssignments: ['enterprise_learner'],
      },
    };
    render(<LearnerCell row={learnerRow} />);
    expect(screen.queryByText('Pending')).not.toBeInTheDocument();
  });

  it('renders LearnerCell for pending user', () => {
    const pendingLearnerRow = {
      original: {
        pendingEnterpriseCustomerUser: {
          isPendingLearner: true,
          userEmail: 'pending@customer.org',
        },
        enterpriseCustomerUser: null,
      },
    };
    render(<LearnerCell row={pendingLearnerRow} />);
    expect(screen.queryByText('Pending')).toBeInTheDocument();
  });
});
