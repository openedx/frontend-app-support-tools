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

  describe('Disable User Button', () => {
    it('Disable User button for active user', () => {
      const passwordActionButton = wrapper.find('#toggle-password').hostNodes();
      expect(passwordActionButton.text()).toEqual('Disable User');
      expect(passwordActionButton.disabled).toBeFalsy();
    });

    it('Disable User Modal', () => {
      const mockApiCall = jest.spyOn(api, 'postTogglePasswordStatus').mockImplementation(() => {});
      const passwordActionButton = wrapper.find('#toggle-password').hostNodes();
      let disableDialogModal = wrapper.find('Modal#user-account-status-toggle');

      expect(disableDialogModal.prop('open')).toEqual(false);
      expect(passwordActionButton.text()).toEqual('Disable User');
      expect(passwordActionButton.disabled).toBeFalsy();

      passwordActionButton.simulate('click');
      disableDialogModal = wrapper.find('Modal#user-account-status-toggle');

      expect(disableDialogModal.prop('open')).toEqual(true);
      expect(disableDialogModal.prop('title')).toEqual('Disable user confirmation');
      disableDialogModal.find('input[name="comment"]').simulate('change', { target: { value: 'Disable Test User' } });
      disableDialogModal.find('button.btn-danger').hostNodes().simulate('click');

      expect(UserSummaryData.changeHandler).toHaveBeenCalled();
      disableDialogModal.find('button.btn-link').simulate('click');
      disableDialogModal = wrapper.find('Modal#user-account-status-toggle');
      expect(disableDialogModal.prop('open')).toEqual(false);
      mockApiCall.mockRestore();
    });
  });

  describe('Enable User Button', () => {
    beforeEach(() => {
      const passwordStatusData = { ...UserSummaryData.userData.passwordStatus, status: 'Unusable' };
      const userData = { ...UserSummaryData.userData, passwordStatus: passwordStatusData };
      mountUserSummaryWrapper({ ...UserSummaryData, userData });
    });

    it('Enable User button for disabled user', () => {
      const passwordActionButton = wrapper.find('#toggle-password').hostNodes();
      expect(passwordActionButton.text()).toEqual('Enable User');
      expect(passwordActionButton.disabled).toBeFalsy();
    });

    it('Enable User Modal', () => {
      const mockApiCall = jest.spyOn(api, 'postTogglePasswordStatus').mockImplementation(() => {});
      const passwordActionButton = wrapper.find('#toggle-password').hostNodes();
      let enableUserModal = wrapper.find('Modal#user-account-status-toggle');

      expect(enableUserModal.prop('open')).toEqual(false);
      expect(passwordActionButton.text()).toEqual('Enable User');
      expect(passwordActionButton.disabled).toBeFalsy();

      passwordActionButton.simulate('click');
      enableUserModal = wrapper.find('Modal#user-account-status-toggle');

      expect(enableUserModal.prop('open')).toEqual(true);
      expect(enableUserModal.prop('title')).toEqual('Enable user confirmation');
      enableUserModal.find('input[name="comment"]').simulate('change', { target: { value: 'Enable Test User' } });
      enableUserModal.find('button.btn-danger').hostNodes().simulate('click');

      expect(UserSummaryData.changeHandler).toHaveBeenCalled();
      mockApiCall.mockRestore();
    });
  });

  describe('Reset Password Button', () => {
    it('Reset Password button for a User', () => {
      const passwordResetButton = wrapper.find('#reset-password').hostNodes();
      expect(passwordResetButton.text()).toEqual('Reset Password');
    });

    it('Reset Password Modal', () => {
      const mockApiCall = jest.spyOn(api, 'postResetPassword').mockImplementation(() => {});
      const passwordResetButton = wrapper.find('#reset-password').hostNodes();
      let resetPasswordModal = wrapper.find('Modal#user-account-reset-password');

      expect(resetPasswordModal.prop('open')).toEqual(false);
      expect(passwordResetButton.text()).toEqual('Reset Password');

      passwordResetButton.simulate('click');
      resetPasswordModal = wrapper.find('Modal#user-account-reset-password');

      expect(resetPasswordModal.prop('open')).toEqual(true);
      expect(resetPasswordModal.prop('title')).toEqual('Reset Password');
      const confirmLabel = resetPasswordModal.find('label');
      expect(confirmLabel.text()).toContain('Do you wish to proceed?');
      resetPasswordModal.find('button.btn-danger').hostNodes().simulate('click');

      expect(UserSummaryData.changeHandler).toHaveBeenCalled();
      resetPasswordModal.find('button.btn-link').simulate('click');
      resetPasswordModal = wrapper.find('Modal#user-account-reset-password');
      expect(resetPasswordModal.prop('open')).toEqual(false);
      mockApiCall.mockRestore();
    });
  });

  describe('Password Toggle History', () => {
    beforeEach(() => {
      const passwordHistory = [
        {
          created: Date().toLocaleString(),
          comment: 'Test Disabled',
          disabled: false,
          createdBy: 'staff',
        },
        {
          created: Date().toLocaleString(),
          comment: 'Test Enable',
          disabled: true,
          createdBy: 'staff',
        },
      ];
      const passwordStatusData = { ...UserSummaryData.userData.passwordStatus, passwordToggleHistory: passwordHistory };
      const userData = { ...UserSummaryData.userData, passwordStatus: passwordStatusData };
      mountUserSummaryWrapper({ ...UserSummaryData, userData });
    });
    it('Password History Modal', () => {
      const passwordHistoryButton = wrapper.find('button#toggle-password-history');
      let historyModal = wrapper.find('Modal#password-history');

      expect(historyModal.prop('open')).toEqual(false);
      expect(passwordHistoryButton.text()).toEqual('Show History');
      expect(passwordHistoryButton.disabled).toBeFalsy();

      passwordHistoryButton.simulate('click');
      historyModal = wrapper.find('Modal#password-history');

      expect(historyModal.prop('open')).toEqual(true);
      expect(historyModal.find('table tbody tr')).toHaveLength(2);

      historyModal.find('button.btn-link').simulate('click');
      historyModal = wrapper.find('Modal#password-history');
      expect(historyModal.prop('open')).toEqual(false);
    });
  });
});
