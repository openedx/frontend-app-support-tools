import { mount } from 'enzyme';
import React from 'react';

import * as api from './data/api';
import UserSummary from './UserSummary';
import UserSummaryData from './data/test/userSummary';

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
  });

  describe('Disable User Button', () => {
    it('Disable User button for active user', () => {
      const passwordActionButton = wrapper.find('.toggle-password').hostNodes();
      expect(passwordActionButton.text()).toEqual('Disable User');
      expect(passwordActionButton.disabled).toBeFalsy();
    });

    it('Disable User Modal', () => {
      const mockApiCall = jest.spyOn(api, 'postTogglePasswordStatus').mockImplementation(() => {});
      const passwordActionButton = wrapper.find('.toggle-password').hostNodes();
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
      const passwordActionButton = wrapper.find('.toggle-password').hostNodes();
      expect(passwordActionButton.text()).toEqual('Enable User');
      expect(passwordActionButton.disabled).toBeFalsy();
    });

    it('Enable User Modal', () => {
      const mockApiCall = jest.spyOn(api, 'postTogglePasswordStatus').mockImplementation(() => {});
      const passwordActionButton = wrapper.find('.toggle-password').hostNodes();
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

  describe('Password Toggle History', () => {
    beforeEach(() => {
      const passwordHistory = [
        {
          created: Date().toLocaleString(),
          comment: 'Test Disabled',
          disabled: 'Disabled',
          createdBy: 'staff',
        },
        {
          created: Date().toLocaleString(),
          comment: 'Test Enable',
          disabled: 'Enabled',
          createdBy: 'staff',
        },
      ];
      const passwordStatusData = { ...UserSummaryData.userData.passwordStatus, passwordToggleHistory: passwordHistory };
      const userData = { ...UserSummaryData.userData, passwordStatus: passwordStatusData };
      wrapper = mount(<UserSummary {...UserSummaryData} userData={userData} />);
    });
    it('Password History Modal', () => {
      const passwordHistoryButton = wrapper.find('button.ml-1');
      let historyModal = wrapper.find('Modal#password-history');

      expect(historyModal.prop('open')).toEqual(false);
      expect(passwordHistoryButton.text()).toEqual('Show history');
      expect(passwordHistoryButton.disabled).toBeFalsy();

      passwordHistoryButton.simulate('click');
      historyModal = wrapper.find('Modal#password-history');

      expect(historyModal.prop('open')).toEqual(true);
      expect(historyModal.find('table tbody tr')).toHaveLength(2);
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
    });
  });
});
