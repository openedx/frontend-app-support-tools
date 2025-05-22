import { render } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import AccountActions from './AccountActions';
import UserSummaryData from '../data/test/userSummary';

describe('Account Actions Component Tests', () => {
  let unmountComponent;

  beforeEach(() => {
    const { unmount } = render(<IntlProvider locale="en"><AccountActions {...UserSummaryData} /> </IntlProvider>);
    unmountComponent = unmount;
  });

  afterEach(() => {
    unmountComponent();
  });

  it('Action Buttons rendered', () => {
    const passwordHistoryButton = document.querySelector('button#toggle-password-history');
    const toggleUserStatusButton = document.querySelector('button#toggle-password');
    const passwordResetEmailButton = document.querySelector('button#reset-password');

    expect(passwordHistoryButton.textContent).toEqual('Show History');
    expect(passwordHistoryButton.disabled).toBeFalsy();

    expect(toggleUserStatusButton.textContent).toEqual('Disable User');
    expect(toggleUserStatusButton.disabled).toBeFalsy();

    expect(passwordResetEmailButton.textContent).toEqual('Reset Password');
    expect(passwordResetEmailButton.disabled).toBeFalsy();

    expect(document.querySelector('h3').textContent).toEqual('Account Actions');
  });
});
