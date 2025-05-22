import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import React from 'react';
import * as api from '../data/api';
import TogglePasswordStatus from './TogglePasswordStatus';
import UserSummaryData from '../data/test/userSummary';
import '@testing-library/jest-dom';

describe('Toggle Password Status Component Tests', () => {
  let unmountComponent;

  beforeEach(() => {
    const data = {
      username: UserSummaryData.userData.username,
      passwordStatus: UserSummaryData.userData.passwordStatus,
      changeHandler: UserSummaryData.changeHandler,
    };
    const { unmount } = render(<TogglePasswordStatus {...data} />);
    unmountComponent = unmount;
  });

  afterEach(() => {
    unmountComponent();
  });

  describe('Disable User Button', () => {
    it('Disable User button for active user', () => {
      const passwordActionButton = document.querySelector('#toggle-password');
      expect(passwordActionButton.textContent).toEqual('Disable User');
      expect(passwordActionButton.disabled).toBeFalsy();
    });

    it('Disable User Modal', async () => {
      const mockApiCall = jest.spyOn(api, 'postTogglePasswordStatus').mockImplementationOnce(() => Promise.resolve());
      const passwordActionButton = document.querySelector('#toggle-password');
      let disableDialogModal = await screen.queryByTestId('user-account-status-toggle');

      expect(disableDialogModal).not.toBeInTheDocument();
      expect(passwordActionButton.textContent).toEqual('Disable User');
      expect(passwordActionButton.disabled).toBeFalsy();

      fireEvent.click(passwordActionButton);
      disableDialogModal = await screen.findByTestId('user-account-status-toggle');

      expect(disableDialogModal).toBeInTheDocument();

      const title = await screen.findByTestId('user-account-status-toggle-modal-title');
      expect(title.textContent).toEqual('Disable user confirmation');
      expect(document.querySelector('.alert-warning').textContent).toEqual(
        'Please provide the reason for disabling the user edx.',
      );
      fireEvent.change(document.querySelector('input[name="comment"]'), { target: { value: 'Disable Test User' } });
      const confirmButton = await screen.findByTestId('user-account-status-toggle-modal-confirm-button');
      await waitFor(() => fireEvent.click(confirmButton));

      await waitFor(() => expect(UserSummaryData.changeHandler).toHaveBeenCalledTimes(1));
      const closeButton = await screen.findByTestId('user-account-status-toggle-modal-close-button');
      fireEvent.click(closeButton);
      disableDialogModal = await screen.queryByTestId('user-account-status-toggle');
      expect(disableDialogModal).not.toBeInTheDocument();
      mockApiCall.mockRestore();
    });
  });

  describe('Enable User Button', () => {
    beforeEach(() => {
      unmountComponent();
      const passwordStatusData = { ...UserSummaryData.userData.passwordStatus, status: 'Unusable' };
      const data = {
        username: UserSummaryData.userData.username,
        passwordStatus: passwordStatusData,
        changeHandler: UserSummaryData.changeHandler,
      };
      render(<TogglePasswordStatus {...data} />);
    });

    it('Enable User button for disabled user', () => {
      const passwordActionButton = document.querySelector('#toggle-password');
      expect(passwordActionButton.textContent).toEqual('Enable User');
      expect(passwordActionButton.disabled).toBeFalsy();
    });

    it('Enable User Modal', async () => {
      const mockApiCall = jest.spyOn(api, 'postTogglePasswordStatus').mockImplementationOnce(() => Promise.resolve());
      const passwordActionButton = document.querySelector('#toggle-password');
      let enableUserModal = await screen.queryByTestId('user-account-status-toggle');

      expect(enableUserModal).not.toBeInTheDocument();
      expect(passwordActionButton.textContent).toEqual('Enable User');
      expect(passwordActionButton.disabled).toBeFalsy();

      fireEvent.click(passwordActionButton);
      enableUserModal = await screen.queryByTestId('user-account-status-toggle');

      expect(enableUserModal).toBeInTheDocument();
      const title = await screen.findByTestId('user-account-status-toggle-modal-title');
      expect(title.textContent).toEqual('Enable user confirmation');
      expect(document.querySelector('.alert-warning').textContent).toEqual(
        'Please provide the reason for enabling the user edx.',
      );
      fireEvent.change(document.querySelector('input[name="comment"]'), { target: { value: 'Enable Test User' } });
      const confirmButton = await screen.findByTestId('user-account-status-toggle-modal-confirm-button');
      await waitFor(() => fireEvent.click(confirmButton));

      await waitFor(() => expect(UserSummaryData.changeHandler).toHaveBeenCalled());
      mockApiCall.mockRestore();
    });
  });
});
