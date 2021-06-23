import { mount } from 'enzyme';
import React from 'react';

import * as api from './data/api';
import UserSummary from './UserSummary';
import UserSummaryData from './data/test/userSummary';
import { formatDate, titleCase } from '../utils';

const getActivationKeyRow = (data) => {
  const wrapper = mount(<UserSummary {...data} />);
  const dataTable = wrapper.find('#account-table table');
  const rowName = dataTable.find('tbody tr').at(5).find('td').at(0);
  const rowValue = dataTable.find('tbody tr').at(5).find('td').at(1);

  return {
    rowName,
    rowValue,
  };
};

describe('User Summary Component Tests', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<UserSummary {...UserSummaryData} />);
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

    it('Verification Data Values', () => {
      const ComponentVerificationData = wrapper.prop('verificationData');
      const ExpectedVerificationData = UserSummaryData.verificationData;

      expect(ComponentVerificationData.status).toEqual(ExpectedVerificationData.status);
      expect(ComponentVerificationData.extraData).toEqual(ExpectedVerificationData.extraData);
      expect(ComponentVerificationData.isVerified).toEqual(ExpectedVerificationData.isVerified);
      expect(ComponentVerificationData.expirationDatetime).toEqual(ExpectedVerificationData.expirationDatetime);
    });

    it('SSO Data Values', () => {
      const ComponentSsoData = wrapper.prop('ssoRecords');
      const ExpectedSsoData = UserSummaryData.ssoRecords;

      expect(ComponentSsoData.uid).toEqual(ExpectedSsoData.uid);
      expect(ComponentSsoData.provider).toEqual(ExpectedSsoData.provider);
      expect(ComponentSsoData.modified).toEqual(ExpectedSsoData.modified);
      expect(ComponentSsoData.extraData).toEqual(ExpectedSsoData.extraData);
    });
    it('Onboarding Status Data Values', () => {
      const ComponentOnboardingData = wrapper.prop('onboardingData');
      const ExpectedOnboardingData = UserSummaryData.onboardingData;

      expect(ComponentOnboardingData.onboardingStatus).toEqual(ExpectedOnboardingData.onboardingStatus);
      expect(ComponentOnboardingData.expirationDate).toEqual(ExpectedOnboardingData.expirationDate);
      expect(ComponentOnboardingData.onboardingReleaseDate).toEqual(ExpectedOnboardingData.onboardingReleaseDate);
      expect(ComponentOnboardingData.onboardingLink).toEqual(ExpectedOnboardingData.onboardingLink);
    });
  });

  describe('Onboarding Status Data', () => {
    it('Onboarding Status', () => {
      const dataTable = wrapper.find('Table#proctoring-data');
      const dataBody = dataTable.find('tbody tr td');
      expect(dataBody).toHaveLength(3);
      expect(dataBody.at(0).text()).toEqual(titleCase(UserSummaryData.onboardingData.onboardingStatus));
      expect(dataBody.at(1).text()).toEqual(formatDate(UserSummaryData.onboardingData.expirationDate));
      expect(dataBody.at(2).text()).toEqual('Link');
    });

    it('No Onboarding Status Data', () => {
      const onboardingData = { ...UserSummaryData.onboardingData, onboardingStatus: null, onboardingLink: null };
      const userData = { ...UserSummaryData, onboardingData };
      wrapper = mount(<UserSummary {...userData} />);
      const dataTable = wrapper.find('Table#proctoring-data');
      const dataBody = dataTable.find('tbody tr td');
      expect(dataBody).toHaveLength(3);
      expect(dataBody.at(0).text()).toEqual('Not Started');
      expect(dataBody.at(1).text()).toEqual(formatDate(UserSummaryData.onboardingData.expirationDate));
      expect(dataBody.at(2).text()).toEqual('N/A');
    });
  });

  describe('Registration Activation Field', () => {
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
      wrapper = mount(<UserSummary {...UserSummaryData} userData={userData} />);
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
      wrapper = mount(<UserSummary {...UserSummaryData} userData={userData} />);
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

  describe('ID Verification', () => {
    it('No extra idv data', () => {
      const idvData = wrapper.find('Table#idv-data');
      const extraDataButton = idvData.find('button.btn-link');
      expect(extraDataButton).toHaveLength(0);
    });

    it('Extra idv data', () => {
      const idvData = [
        {
          type: 'Manual',
          status: 'Denied',
          updatedAt: Date().toLocaleString(),
          expirationDatetime: Date().toLocaleString(),
          message: 'Missing Photo',
        },
        {
          type: 'Manual',
          status: 'Approved',
          updatedAt: Date().toLocaleString(),
          expirationDatetime: Date().toLocaleString(),
          message: null,
        },
      ];
      const verificationData = { ...UserSummaryData.verificationData, extraData: idvData };
      wrapper = mount(<UserSummary {...UserSummaryData} verificationData={verificationData} />);

      const idvDataTable = wrapper.find('Table#idv-data');
      const extraDataButton = idvDataTable.find('button.btn-link');
      let extraDataModal = wrapper.find('Modal#idv-extra-data');

      expect(extraDataButton.text()).toEqual('Show');
      expect(extraDataModal.prop('open')).toEqual(false);

      extraDataButton.simulate('click');
      extraDataModal = wrapper.find('Modal#idv-extra-data');

      expect(extraDataModal.prop('open')).toEqual(true);
      expect(extraDataModal.find('table tbody tr')).toHaveLength(2);
      expect(extraDataModal.prop('title')).toEqual('ID Verification Details');

      extraDataModal.find('button.btn-link').simulate('click');
      extraDataModal = wrapper.find('Modal#idv-extra-data');
      expect(extraDataModal.prop('open')).toEqual(false);
    });
  });

  describe('SSO', () => {
    it('No extra sso data', () => {
      const idvData = wrapper.find('Table#sso-data');
      const extraDataButton = idvData.find('button.btn-link');
      expect(extraDataButton).toHaveLength(0);
    });

    it('Extra sso data', () => {
      const ssoExtraData = {
        type: 'Manual',
        status: 'active',
        updatedAt: Date().toLocaleString(),
      };
      const ssoRecords = [...UserSummaryData.ssoRecords];
      ssoRecords[0].extraData = ssoExtraData;
      wrapper = mount(<UserSummary {...UserSummaryData} ssoRecords={ssoRecords} />);

      const ssoDataTable = wrapper.find('Table#sso-data');
      const extraDataButton = ssoDataTable.find('button.btn-link');
      let extraDataModal = wrapper.find('Modal#sso-extra-data');

      expect(extraDataButton.text()).toEqual('Show');
      expect(extraDataModal.prop('open')).toEqual(false);

      extraDataButton.simulate('click');
      extraDataModal = wrapper.find('Modal#sso-extra-data');

      expect(extraDataModal.prop('open')).toEqual(true);
      // The length here corresponds to dict keys in ssoExtraData
      expect(extraDataModal.find('table tbody tr')).toHaveLength(3);

      extraDataModal.find('button.btn-link').simulate('click');
      extraDataModal = wrapper.find('Modal#sso-extra-data');
      expect(extraDataModal.prop('open')).toEqual(false);
    });
  });
});
