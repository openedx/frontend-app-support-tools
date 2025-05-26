import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import * as api from './data/api';
import UserSummary from './UserSummary';
import UserSummaryData from './data/test/userSummary';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import enrollmentsData from './data/test/enrollments';
import OnboardingStatusData from './data/test/onboardingStatus';
import enterpriseCustomerUsersData from './data/test/enterpriseCustomerUsers';
import verifiedNameHistoryData from './data/test/verifiedNameHistory';

const DATA_TEST_ID = 'userSummaryTable';
const UserSummaryWrapper = (props) => (
  <IntlProvider locale="en">
    <UserMessagesProvider>
      <UserSummary {...props} />
    </UserMessagesProvider>
  </IntlProvider>
);

describe('User Summary Component Tests', () => {
  let unmountComponent;

  const mountUserSummaryWrapper = async (data) => {
    jest.spyOn(api, 'getVerifiedNameHistory').mockImplementationOnce(() => Promise.resolve(verifiedNameHistoryData));
    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve(enrollmentsData));
    jest.spyOn(api, 'getOnboardingStatus').mockImplementationOnce(() => Promise.resolve(OnboardingStatusData));
    jest.spyOn(api, 'getEnterpriseCustomerUsers').mockImplementationOnce(() => Promise.resolve(enterpriseCustomerUsersData));
    const { unmount } = render(<UserSummaryWrapper {...data} />);
    unmountComponent = unmount;
  };

  beforeEach(() => {
    mountUserSummaryWrapper(UserSummaryData);
  });

  afterEach(() => {
    unmountComponent();
  });

  describe('Default Correct Data Values', () => {
    it('User Data Values', () => {
      // TODO: need to figure out how to verify userData
      // const ComponentUserData = wrapper.prop('userData');
      // const ExpectedUserData = UserSummaryData.userData;
      // Object.keys(ComponentUserData).forEach(key => {
      //   expect(ComponentUserData[key]).not.toEqual(undefined);
      //   expect(ExpectedUserData[key]).not.toEqual(undefined);
      //   expect(ComponentUserData[key]).toEqual(ExpectedUserData[key]);
      // });
    });

    it('Data Table Render', async () => {
      const dataTable = (await screen.findByTestId(DATA_TEST_ID)).querySelectorAll('tr');
      const expectedData = [
        {
          header: 'Full Name',
          value: 'edx',
        },
        {
          header: 'Verified Name',
          value: '',
        },
        {
          header: 'Username',
          value: 'edx',
        },
        {
          header: 'LMS User ID',
          value: '1',
        },
        {
          header: 'Email',
          value: 'edx@example.com',
        },
        {
          header: 'Confirmed',
          value: 'yes',
        },
        {
          header: 'Country',
          value: 'US',
        },
        {
          header: 'Join Date/Time',
          value: 'N/A',
        },
        {
          header: 'Last Login',
          value: 'N/A',
        },
        {
          header: 'Password Status',
          value: 'Usable',
        },
      ];
      expectedData.forEach((item, index) => {
        expect(dataTable[index].querySelector('th').textContent).toEqual(item.header);
        expect(dataTable[index].querySelector('td').textContent).toEqual(item.value);
      });
    });

    it('Account Actions', async () => {
      const actionsContainer = await screen.findByTestId('account-action');

      expect(actionsContainer.querySelector('h3').textContent).toEqual('Account Actions');
      expect(actionsContainer.querySelector('button#toggle-password').textContent).toEqual('Disable User');
      expect(actionsContainer.querySelector('button#reset-password').textContent).toEqual('Reset Password');
      expect(actionsContainer.querySelector('button#toggle-password-history').textContent).toEqual('Show History');
    });
  });

  describe('Registration Activation Field', () => {
    const getActivationKeyRow = async (data) => {
      unmountComponent();
      mountUserSummaryWrapper(data);
      const dataTable = await screen.findByTestId('userSummaryTable');
      const rowName = dataTable.querySelectorAll('tbody tr')[5].querySelectorAll('th')[0];
      const rowValue = dataTable.querySelectorAll('tbody tr')[5].querySelectorAll('td')[0];

      return {
        rowName,
        rowValue,
      };
    };

    it('Active User Data', async () => {
      const { rowName, rowValue } = await getActivationKeyRow(UserSummaryData);
      expect(rowName.textContent).not.toEqual('Confirmation Link');
      expect(rowValue.textContent).not.toEqual(UserSummaryData.userData.activationKey);
    });

    it('Inactive User Data ', async () => {
      unmountComponent();
      const InActiveUserData = { ...UserSummaryData.userData, isActive: false };
      const InActiveUserSummaryData = { ...UserSummaryData, userData: InActiveUserData };
      const { rowName, rowValue } = await getActivationKeyRow(InActiveUserSummaryData);
      expect(rowName.textContent).toEqual('Confirmation Link');
      expect(rowValue.textContent).toEqual(UserSummaryData.userData.activationKey);
    });

    it('Active User With No Registration Data ', async () => {
      unmountComponent();
      const InActiveUserData = { ...UserSummaryData.userData, activationKey: null };
      const InActiveUserSummaryData = { ...UserSummaryData, userData: InActiveUserData };
      const { rowName, rowValue } = await getActivationKeyRow(InActiveUserSummaryData);
      expect(rowName.textContent).not.toEqual('Confirmation Link');
      expect(rowValue.textContent).not.toEqual(UserSummaryData.userData.activationKey);
    });

    it('Inactive User With No Registration Data ', async () => {
      const InActiveUserData = { ...UserSummaryData.userData, activationKey: null, isActive: false };
      const InActiveUserSummaryData = { ...UserSummaryData, userData: InActiveUserData };
      const { rowName, rowValue } = await getActivationKeyRow(InActiveUserSummaryData);
      expect(rowName.textContent).toEqual('Confirmation Link');
      expect(rowValue.textContent).toEqual('N/A');
    });
  });
});
