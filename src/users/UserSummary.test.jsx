import React from 'react';
import {
  render,
  screen,
  within,
  cleanup,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import * as api from './data/api';
import UserSummary from './UserSummary';
import UserSummaryData from './data/test/userSummary';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import enrollmentsData from './data/test/enrollments';
import OnboardingStatusData from './data/test/onboardingStatus';
import enterpriseCustomerUsersData from './data/test/enterpriseCustomerUsers';
import verifiedNameHistoryData from './data/test/verifiedNameHistory';

const UserSummaryWrapper = (props) => (
  <IntlProvider locale="en">
    <UserMessagesProvider>
      <UserSummary {...props} />
    </UserMessagesProvider>
  </IntlProvider>
);

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getRowByHeader = (label) => {
  const th = screen.getByRole('columnheader', {
    name: new RegExp(`^${esc(label)}$`, 'i'),
  });
  return th.closest('tr');
};

const getValueCell = (row) => {
  const cells = within(row).getAllByRole('cell');
  expect(cells.length).toBeGreaterThan(0);
  return cells[0];
};

describe('User Summary Component Tests', () => {
  beforeEach(() => {
    jest.spyOn(api, 'getVerifiedNameHistory').mockResolvedValue(verifiedNameHistoryData);
    jest.spyOn(api, 'getEnrollments').mockResolvedValue(enrollmentsData);
    jest.spyOn(api, 'getOnboardingStatus').mockResolvedValue(OnboardingStatusData);
    jest.spyOn(api, 'getEnterpriseCustomerUsers').mockResolvedValue(enterpriseCustomerUsersData);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });

  describe('Default Correct Data Values', () => {
    it('User Data Values', () => {
      const ComponentUserData = UserSummaryData.userData;
      const ExpectedUserData = UserSummaryData.userData;

      Object.keys(ComponentUserData).forEach((key) => {
        expect(ComponentUserData[key]).not.toBeUndefined();
        expect(ExpectedUserData[key]).not.toBeUndefined();
        expect(ComponentUserData[key]).toEqual(ExpectedUserData[key]);
      });
    });

    it('Data Table Render', () => {
      render(<UserSummaryWrapper {...UserSummaryData} />);

      const expectedData = [
        { header: 'Full Name', value: 'edx' },
        { header: 'Verified Name', value: '' },
        { header: 'Username', value: 'edx' },
        { header: 'LMS User ID', value: '1' },
        { header: 'Email', value: 'edx@example.com' },
        { header: 'Confirmed', value: 'yes' },
        { header: 'Country', value: 'US' },
        { header: 'Join Date/Time', value: 'N/A' },
        { header: 'Last Login', value: 'N/A' },
        { header: 'Password Status', value: 'Usable' },
      ];

      expectedData.forEach(({ header, value }) => {
        const row = getRowByHeader(header);
        const valueCell = getValueCell(row);

        if (value === '') {
          expect(valueCell).toHaveTextContent(/^$/);
        } else {
          expect(valueCell).toHaveTextContent(new RegExp(`^${esc(value)}$`, 'i'));
        }
      });
    });

    it('Account Actions', () => {
      render(<UserSummaryWrapper {...UserSummaryData} />);
      expect(screen.getByRole('heading', { name: /account actions/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /disable user/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /show history/i })).toBeInTheDocument();
    });
  });

  describe('Registration Activation Field', () => {
    const getActivationRow = () => {
      const thConfirmLink = screen.queryByRole('columnheader', {
        name: /confirmation link/i,
      });
      if (thConfirmLink) {
        return thConfirmLink.closest('tr');
      }
      const thConfirmed = screen.getByRole('columnheader', { name: /confirmed/i });
      return thConfirmed.closest('tr');
    };

    it('Active User Data', () => {
      render(<UserSummaryWrapper {...UserSummaryData} />);
      const row = getActivationRow();

      expect(within(row).queryByRole('columnheader', { name: /confirmation link/i })).not.toBeInTheDocument();
      expect(within(row).getByRole('columnheader', { name: /confirmed/i })).toBeInTheDocument();
      expect(within(row).queryByText(UserSummaryData.userData.activationKey)).not.toBeInTheDocument();
    });

    it('Inactive User Data', () => {
      const InActiveUserData = { ...UserSummaryData.userData, isActive: false };
      render(
        <UserSummaryWrapper {...{ ...UserSummaryData, userData: InActiveUserData }} />,
      );

      const row = getActivationRow();
      expect(within(row).getByRole('columnheader', { name: /confirmation link/i })).toBeInTheDocument();
      expect(within(row).getByText(UserSummaryData.userData.activationKey)).toBeInTheDocument();
    });

    it('Active User With No Registration Data', () => {
      const NoRegData = { ...UserSummaryData.userData, activationKey: null };
      render(
        <UserSummaryWrapper {...{ ...UserSummaryData, userData: NoRegData }} />,
      );

      const row = getActivationRow();
      expect(within(row).queryByRole('columnheader', { name: /confirmation link/i })).not.toBeInTheDocument();
      expect(within(row).queryByText(UserSummaryData.userData.activationKey)).not.toBeInTheDocument();
    });

    it('Inactive User With No Registration Data', () => {
      const InActiveNoReg = {
        ...UserSummaryData.userData,
        activationKey: null,
        isActive: false,
      };
      render(
        <UserSummaryWrapper {...{ ...UserSummaryData, userData: InActiveNoReg }} />,
      );

      const row = getActivationRow();
      expect(within(row).getByRole('columnheader', { name: /confirmation link/i })).toBeInTheDocument();
      const valueCell = getValueCell(row);
      expect(valueCell).toHaveTextContent(/^N\/A$/i);
    });
  });
});
