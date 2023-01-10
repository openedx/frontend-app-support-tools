import { mount } from 'enzyme';
import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import * as api from '../data/api';
import ResetPassword from './ResetPassword';
import UserSummaryData from '../data/test/userSummary';
import { waitForComponentToPaint } from '../../setupTest';

const ResetPasswordWrapper = (props) => (
  <IntlProvider locale="en">
    <ResetPassword {...props} />
  </IntlProvider>
);

describe('Reset Password Component Tests', () => {
  let wrapper;

  beforeEach(() => {
    const data = {
      email: UserSummaryData.userData.email,
      changeHandler: UserSummaryData.changeHandler,
    };
    wrapper = mount(<ResetPasswordWrapper {...data} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('Reset Password button for a User', () => {
    const passwordResetButton = wrapper.find('#reset-password').hostNodes();
    expect(passwordResetButton.text()).toEqual('Reset Password');
  });

  it('Reset Password Modal', async () => {
    const mockApiCall = jest.spyOn(api, 'postResetPassword').mockImplementationOnce(() => Promise.resolve({}));
    const passwordResetButton = wrapper.find('#reset-password').hostNodes();
    let resetPasswordModal = wrapper.find('ModalDialog#user-account-reset-password');

    expect(resetPasswordModal.prop('isOpen')).toEqual(false);
    expect(passwordResetButton.text()).toEqual('Reset Password');

    passwordResetButton.simulate('click');
    resetPasswordModal = wrapper.find('ModalDialog#user-account-reset-password');

    expect(resetPasswordModal.prop('isOpen')).toEqual(true);
    expect(resetPasswordModal.find('h2.pgn__modal-title').text()).toEqual('Reset Password');
    const confirmAlert = resetPasswordModal.find('.alert-warning');
    expect(confirmAlert.text()).toEqual(
      'We will send a message with password recovery instructions to the email address edx@example.com. Do you wish to proceed?',
    );
    resetPasswordModal.find('button.btn-danger').hostNodes().simulate('click');
    await waitForComponentToPaint(wrapper);
    expect(UserSummaryData.changeHandler).toHaveBeenCalled();
    resetPasswordModal.find('button.btn-link').simulate('click');
    resetPasswordModal = wrapper.find('ModalDialog#user-account-reset-password');
    expect(resetPasswordModal.prop('isOpen')).toEqual(false);

    mockApiCall.mockRestore();
  });

  it('Display Error on Reset Password Modal', async () => {
    const resetPasswordErrors = {
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'Your previous request is in progress, please try again in a few moments',
          type: 'error',
          topic: 'resetPassword',
        },
      ],
    };
    const mockApiCall = jest.spyOn(api, 'postResetPassword').mockImplementationOnce(() => Promise.resolve(resetPasswordErrors));
    const passwordResetButton = wrapper.find('#reset-password').hostNodes();
    passwordResetButton.simulate('click');
    let resetPasswordModal = wrapper.find('ModalDialog#user-account-reset-password');
    expect(resetPasswordModal.prop('isOpen')).toEqual(true);
    const confirmAlert = resetPasswordModal.find('.alert-warning');
    expect(confirmAlert.text()).toEqual(
      'We will send a message with password recovery instructions to the email address edx@example.com. Do you wish to proceed?',
    );

    resetPasswordModal.find('button.btn-danger').hostNodes().simulate('click');
    await waitForComponentToPaint(wrapper);
    resetPasswordModal = wrapper.find('ModalDialog#user-account-reset-password');
    const errorAlert = resetPasswordModal.find('.alert-danger');
    expect(errorAlert.text()).toEqual(
      'Your previous request is in progress, please try again in a few moments',
    );
    resetPasswordModal.find('button.btn-link').simulate('click');
    resetPasswordModal = wrapper.find('ModalDialog#user-account-reset-password');
    expect(resetPasswordModal.prop('isOpen')).toEqual(false);
    mockApiCall.mockRestore();
  });

  it('Display Unknown Error on Reset Password Modal', async () => {
    const resetPasswordErrors = {
      errors: [
        {
          code: null,
          dismissible: true,
          text: null,
          type: 'error',
          topic: 'resetPassword',
        },
      ],
    };
    const mockApiCall = jest.spyOn(api, 'postResetPassword').mockImplementationOnce(() => Promise.resolve(resetPasswordErrors));
    const passwordResetButton = wrapper.find('#reset-password').hostNodes();
    passwordResetButton.simulate('click');
    let resetPasswordModal = wrapper.find('ModalDialog#user-account-reset-password');
    resetPasswordModal.find('button.btn-danger').hostNodes().simulate('click');
    await waitForComponentToPaint(wrapper);
    resetPasswordModal = wrapper.find('ModalDialog#user-account-reset-password');
    const errorAlert = resetPasswordModal.find('.alert-danger');
    expect(errorAlert.text()).toEqual(
      'Something went wrong. Please try again later!',
    );
    mockApiCall.mockRestore();
  });
});
