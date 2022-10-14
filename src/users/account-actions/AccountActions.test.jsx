import { mount } from 'enzyme';
import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import AccountActions from './AccountActions';
import UserSummaryData from '../data/test/userSummary';

describe('Account Actions Component Tests', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<IntlProvider><AccountActions {...UserSummaryData} /> </IntlProvider>);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('Action Buttons rendered', () => {
    const passwordHistoryButton = wrapper.find('button#toggle-password-history');
    const toggleUserStatusButton = wrapper.find('button#toggle-password');
    const passwordResetEmailButton = wrapper.find('button#reset-password');

    expect(passwordHistoryButton.text()).toEqual('Show History');
    expect(passwordHistoryButton.disabled).toBeFalsy();

    expect(toggleUserStatusButton.text()).toEqual('Disable User');
    expect(toggleUserStatusButton.disabled).toBeFalsy();

    expect(passwordResetEmailButton.text()).toEqual('Reset Password');
    expect(passwordResetEmailButton.disabled).toBeFalsy();

    expect(wrapper.find('h3').text()).toEqual('Account Actions');
  });
});
