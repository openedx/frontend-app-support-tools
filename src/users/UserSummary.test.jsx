import { mount } from 'enzyme';
import React from 'react';

import * as api from './data/api';
import UserSummary from './UserSummary';
import UserSummaryData from './data/test/userSummary';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import idvStatusData from './data/test/idvStatus';
import enrollmentsData from './data/test/enrollments';
import onboardingStatusData from './data/test/onboardingStatus';
import ssoRecordsData from './data/test/ssoRecords';
import enterpriseCustomerUsersData from './data/test/enterpriseCustomerUsers';

const UserSummaryWrapper = (props) => (
  <UserMessagesProvider>
    <UserSummary {...props} />
  </UserMessagesProvider>
);

describe('User Summary Component Tests', () => {
  let wrapper;

  const mountUserSummaryWrapper = (data) => {
    jest.spyOn(api, 'getUserVerificationStatus').mockImplementationOnce(() => Promise.resolve(idvStatusData));
    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve(enrollmentsData));
    jest.spyOn(api, 'getOnboardingStatus').mockImplementationOnce(() => Promise.resolve(onboardingStatusData));
    jest.spyOn(api, 'getSsoRecords').mockImplementationOnce(() => Promise.resolve(ssoRecordsData));
    jest.spyOn(api, 'getEnterpriseCustomerUsers').mockImplementationOnce(() => Promise.resolve(enterpriseCustomerUsersData));
    wrapper = mount(<UserSummaryWrapper {...data} />);
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

      expect(ComponentUserData.id).toEqual(ExpectedUserData.id);
      expect(ComponentUserData.name).toEqual(ExpectedUserData.name);
      expect(ComponentUserData.email).toEqual(ExpectedUserData.email);
      expect(ComponentUserData.country).toEqual(ExpectedUserData.country);
      expect(ComponentUserData.isActive).toEqual(ExpectedUserData.isActive);
      expect(ComponentUserData.username).toEqual(ExpectedUserData.username);
      expect(ComponentUserData.lastLogin).toEqual(ExpectedUserData.lastLogin);
      expect(ComponentUserData.dateJoined).toEqual(ExpectedUserData.dateJoined);
      expect(ComponentUserData.passwordStatus).toEqual(ExpectedUserData.passwordStatus);
      expect(ComponentUserData.activationKey).toEqual(ExpectedUserData.activationKey);
    });
  });

  describe('Registration Activation Field', () => {
    const getActivationKeyRow = (data) => {
      mountUserSummaryWrapper(data);
      const dataTable = wrapper.find('#account-table table');
      const rowName = dataTable.find('tbody tr').at(5).find('td').at(0);
      const rowValue = dataTable.find('tbody tr').at(5).find('td').at(1);

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
