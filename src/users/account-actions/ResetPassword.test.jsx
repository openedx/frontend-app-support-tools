import { mount } from 'enzyme';
import React from 'react';

import * as api from '../data/api';
import ResetPassword from './ResetPassword';
import UserSummaryData from '../data/test/userSummary';

describe('Reset Password Component Tests', () => {
  let wrapper;

  beforeEach(() => {
    const data = {
      email: UserSummaryData.userData.email,
      changeHandler: UserSummaryData.changeHandler,
    };
    wrapper = mount(<ResetPassword {...data} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

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
