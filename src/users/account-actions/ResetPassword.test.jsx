import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import * as api from '../data/api';
import ResetPassword from './ResetPassword';
import UserSummaryData from '../data/test/userSummary';

const ResetPasswordWrapper = (props) => (
  <IntlProvider locale="en">
    <ResetPassword {...props} />
  </IntlProvider>
);

describe('Reset Password Component Tests', () => {
  let unmountComponent;

  beforeEach(() => {
    const data = {
      email: UserSummaryData.userData.email,
      changeHandler: UserSummaryData.changeHandler,
    };
    const { unmount } = render(<ResetPasswordWrapper {...data} />);
    unmountComponent = unmount;
  });

  afterEach(() => {
    unmountComponent();
  });

  it('Reset Password button for a User', () => {
    const passwordResetButton = document.querySelector('#reset-password');
    expect(passwordResetButton.textContent).toEqual('Reset Password');
  });

  it('Reset Password Modal', async () => {
    const mockApiCall = jest.spyOn(api, 'postResetPassword').mockImplementationOnce(() => Promise.resolve({}));
    const passwordResetButton = document.querySelector('#reset-password');
    let resetPasswordModal = await screen.queryByTestId('user-account-reset-password-modal-body');

    expect(resetPasswordModal).not.toBeInTheDocument();
    expect(passwordResetButton.textContent).toEqual('Reset Password');

    fireEvent.click(passwordResetButton);
    resetPasswordModal = await screen.queryByTestId('user-account-reset-password-modal-body');

    expect(resetPasswordModal).toBeInTheDocument();
    const modalTitle = await screen.findByTestId('user-account-reset-password-modal-title');
    expect(modalTitle.textContent).toEqual('Reset Password');
    const confirmAlert = document.querySelector('.alert-warning');
    expect(confirmAlert.textContent).toEqual(
      'We will send a message with password recovery instructions to the email address edx@example.com. Do you wish to proceed?',
    );
    const confirmButton = await screen.findByTestId('user-account-reset-password-confirmation-button');
    fireEvent.click(confirmButton);
    waitFor(() => expect(UserSummaryData.changeHandler).toHaveBeenCalled());
    const closeButton = await screen.findByTestId('user-account-reset-password-modal-close-button');
    await waitFor(() => fireEvent.click(closeButton));
    resetPasswordModal = await screen.queryByTestId('user-account-reset-password-modal-body');
    expect(resetPasswordModal).not.toBeInTheDocument();

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
    const passwordResetButton = document.querySelector('#reset-password');
    fireEvent.click(passwordResetButton);
    let resetPasswordModal = await screen.queryByTestId('user-account-reset-password-modal-body');
    expect(resetPasswordModal).toBeInTheDocument();
    const confirmAlert = document.querySelector('.alert-warning');
    expect(confirmAlert.textContent).toEqual(
      'We will send a message with password recovery instructions to the email address edx@example.com. Do you wish to proceed?',
    );

    const confirmButton = await screen.findByTestId('user-account-reset-password-confirmation-button');
    fireEvent.click(confirmButton);
    const errorAlert = document.querySelector('.alert-danger');
    waitFor(() => expect(errorAlert.text()).toEqual(
      'Your previous request is in progress, please try again in a few moments',
    ));
    const closeButton = await screen.findByTestId('user-account-reset-password-modal-close-button');
    await waitFor(() => fireEvent.click(closeButton));
    resetPasswordModal = await screen.queryByTestId('user-account-reset-password-modal-body');
    expect(resetPasswordModal).not.toBeInTheDocument();
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
    const passwordResetButton = document.querySelector('#reset-password');
    fireEvent.click(passwordResetButton);
    const confirmButton = await screen.findByTestId('user-account-reset-password-confirmation-button');
    await waitFor(() => fireEvent.click(confirmButton));
    const errorAlert = await screen.findByTestId('reset-password-alert-danger');
    await waitFor(() => expect(errorAlert.textContent).toEqual(
      'Something went wrong. Please try again later!',
    ));
    mockApiCall.mockRestore();
  });
});
