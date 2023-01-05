import { mount } from 'enzyme';
import React from 'react';
import { waitFor } from '@testing-library/react';
import * as api from '../data/api';
import TogglePasswordStatus from './TogglePasswordStatus';
import UserSummaryData from '../data/test/userSummary';

describe('Toggle Password Status Component Tests', () => {
  let wrapper;

  beforeEach(() => {
    const data = {
      username: UserSummaryData.userData.username,
      passwordStatus: UserSummaryData.userData.passwordStatus,
      changeHandler: UserSummaryData.changeHandler,
    };
    wrapper = mount(<TogglePasswordStatus {...data} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  describe('Disable User Button', () => {
    it('Disable User button for active user', () => {
      const passwordActionButton = wrapper.find('#toggle-password').hostNodes();
      expect(passwordActionButton.text()).toEqual('Disable User');
      expect(passwordActionButton.disabled).toBeFalsy();
    });

    it('Disable User Modal', async () => {
      const mockApiCall = jest.spyOn(api, 'postTogglePasswordStatus').mockImplementationOnce(() => Promise.resolve());
      const passwordActionButton = wrapper.find('#toggle-password').hostNodes();
      let disableDialogModal = wrapper.find('ModalDialog#user-account-status-toggle');

      expect(disableDialogModal.prop('isOpen')).toEqual(false);
      expect(passwordActionButton.text()).toEqual('Disable User');
      expect(passwordActionButton.disabled).toBeFalsy();

      passwordActionButton.simulate('click');
      disableDialogModal = wrapper.find('ModalDialog#user-account-status-toggle');

      expect(disableDialogModal.prop('isOpen')).toEqual(true);
      expect(disableDialogModal.find('h2.pgn__modal-title').text()).toEqual('Disable user confirmation');
      expect(disableDialogModal.find('.alert-warning').text()).toEqual(
        'Please provide the reason for disabling the user edx.',
      );
      disableDialogModal.find('input[name="comment"]').simulate('change', { target: { value: 'Disable Test User' } });
      disableDialogModal.find('button.btn-danger').hostNodes().simulate('click');

      await waitFor(() => expect(UserSummaryData.changeHandler).toHaveBeenCalledTimes(1));
      disableDialogModal.find('button.btn-link').simulate('click');
      disableDialogModal = wrapper.find('ModalDialog#user-account-status-toggle');
      expect(disableDialogModal.prop('isOpen')).toEqual(false);
      mockApiCall.mockRestore();
    });
  });

  describe('Enable User Button', () => {
    beforeEach(() => {
      const passwordStatusData = { ...UserSummaryData.userData.passwordStatus, status: 'Unusable' };
      const data = {
        username: UserSummaryData.userData.username,
        passwordStatus: passwordStatusData,
        changeHandler: UserSummaryData.changeHandler,
      };
      wrapper = mount(<TogglePasswordStatus {...data} />);
    });

    it('Enable User button for disabled user', () => {
      const passwordActionButton = wrapper.find('#toggle-password').hostNodes();
      expect(passwordActionButton.text()).toEqual('Enable User');
      expect(passwordActionButton.disabled).toBeFalsy();
    });

    it('Enable User Modal', async () => {
      const mockApiCall = jest.spyOn(api, 'postTogglePasswordStatus').mockImplementationOnce(() => Promise.resolve());
      const passwordActionButton = wrapper.find('#toggle-password').hostNodes();
      let enableUserModal = wrapper.find('ModalDialog#user-account-status-toggle');

      expect(enableUserModal.prop('isOpen')).toEqual(false);
      expect(passwordActionButton.text()).toEqual('Enable User');
      expect(passwordActionButton.disabled).toBeFalsy();

      passwordActionButton.simulate('click');
      enableUserModal = wrapper.find('ModalDialog#user-account-status-toggle');

      expect(enableUserModal.prop('isOpen')).toEqual(true);
      expect(enableUserModal.find('h2.pgn__modal-title').text()).toEqual('Enable user confirmation');
      expect(enableUserModal.find('.alert-warning').text()).toEqual(
        'Please provide the reason for enabling the user edx.',
      );
      enableUserModal.find('input[name="comment"]').simulate('change', { target: { value: 'Enable Test User' } });
      enableUserModal.find('button.btn-danger').hostNodes().simulate('click');

      await waitFor(() => expect(UserSummaryData.changeHandler).toHaveBeenCalledTimes(1));
      mockApiCall.mockRestore();
    });
  });
});
