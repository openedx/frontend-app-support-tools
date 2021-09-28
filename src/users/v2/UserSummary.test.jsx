import { mount } from 'enzyme';
import React from 'react';

import * as api from '../data/api';
import UserSummary from './UserSummary';
import UserSummaryData from '../data/test/userSummary';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import idvStatusData from '../data/test/idvStatus';
import enrollmentsData from '../data/test/enrollments';
import onboardingStatusData from '../data/test/onboardingStatus';
import { waitForComponentToPaint } from '../../setupTest';

const UserSummaryWrapper = (props) => (
  <UserMessagesProvider>
    <UserSummary {...props} />
  </UserMessagesProvider>
);

describe('User Summary Component Tests', () => {
  let wrapper;

  const mountUserSummaryWrapper = async (data) => {
    jest.spyOn(api, 'getUserVerificationStatus').mockImplementationOnce(() => Promise.resolve(idvStatusData));
    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve(enrollmentsData));
    jest.spyOn(api, 'getOnboardingStatus').mockImplementationOnce(() => Promise.resolve(onboardingStatusData));
    wrapper = mount(<UserSummaryWrapper {...data} />);
    await waitForComponentToPaint(wrapper);
  };

  beforeEach(() => {
    mountUserSummaryWrapper(UserSummaryData);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  describe('Default Correct Data Values', () => {
    it('User Data Values', () => {
      const ComponentUserData = wrapper.prop('userData');
      const ExpectedUserData = UserSummaryData.userData;
      Object.keys(ComponentUserData).forEach(key => {
        expect(ComponentUserData[key]).not.toEqual(undefined);
        expect(ExpectedUserData[key]).not.toEqual(undefined);
        expect(ComponentUserData[key]).toEqual(ExpectedUserData[key]);
      });
    });

    it('Data Table Render', () => {
      const dataTable = wrapper.find('#account-table table tr');
      const expectedData = [
        {
          header: 'Full Name',
          value: 'edx',
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
          header: 'Active',
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
        expect(dataTable.at(index).find('th').text()).toEqual(item.header);
        expect(dataTable.at(index).find('td').text()).toEqual(item.value);
      });
    });

    it('Account Actions', () => {
      const actionsContainer = wrapper.find('div#account-actions');

      expect(actionsContainer.find('h3').text()).toEqual('Account Actions');
      expect(actionsContainer.find('button#toggle-password').text()).toEqual('Disable User');
      expect(actionsContainer.find('button#reset-password').text()).toEqual('Reset Password');
      expect(actionsContainer.find('button#toggle-password-history').text()).toEqual('Show History');
    });
  });

  describe('Registration Activation Field', () => {
    const getActivationKeyRow = (data) => {
      mountUserSummaryWrapper(data);
      const dataTable = wrapper.find('#account-table table');
      const rowName = dataTable.find('tbody tr').at(4).find('th').at(0);
      const rowValue = dataTable.find('tbody tr').at(4).find('td').at(0);

      return {
        rowName,
        rowValue,
      };
    };

    it('Active User Data', () => {
      const { rowName, rowValue } = getActivationKeyRow(UserSummaryData);
      expect(rowName.text()).not.toEqual('Activation Key/Link');
      expect(rowValue.text()).not.toEqual(UserSummaryData.userData.activationKey);
    });

    it('Inactive User Data ', () => {
      const InActiveUserData = { ...UserSummaryData.userData, isActive: false };
      const InActiveUserSummaryData = { ...UserSummaryData, userData: InActiveUserData };
      const { rowName, rowValue } = getActivationKeyRow(InActiveUserSummaryData);
      expect(rowName.text()).toEqual('Activation Key/Link');
      expect(rowValue.text()).toEqual(UserSummaryData.userData.activationKey);
    });

    it('Active User With No Registration Data ', () => {
      const InActiveUserData = { ...UserSummaryData.userData, activationKey: null };
      const InActiveUserSummaryData = { ...UserSummaryData, userData: InActiveUserData };
      const { rowName, rowValue } = getActivationKeyRow(InActiveUserSummaryData);
      expect(rowName.text()).not.toEqual('Activation Key/Link');
      expect(rowValue.text()).not.toEqual(UserSummaryData.userData.activationKey);
    });

    it('Inactive User With No Registration Data ', () => {
      const InActiveUserData = { ...UserSummaryData.userData, activationKey: null, isActive: false };
      const InActiveUserSummaryData = { ...UserSummaryData, userData: InActiveUserData };
      const { rowName, rowValue } = getActivationKeyRow(InActiveUserSummaryData);
      expect(rowName.text()).toEqual('Activation Key/Link');
      expect(rowValue.text()).toEqual('N/A');
    });
  });
});
