import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import ExpireEntitlementForm from './ExpireEntitlementForm';
import entitlementFormData from '../data/test/entitlementForm';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from '../data/api';

const ExpireEntitlementFormWrapper = (props) => (
  <IntlProvider locale="en">
    <UserMessagesProvider>
      <ExpireEntitlementForm {...props} />
    </UserMessagesProvider>
  </IntlProvider>
);

describe('Expire Entitlement Form', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });

  it('Default form render', () => {
    render(<ExpireEntitlementFormWrapper {...entitlementFormData} />);

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();

    const commentsTextArea = screen.getByPlaceholderText(/explanation/i);
    expect(commentsTextArea).toHaveValue('');

    const closeButtons = screen.getAllByRole('button', { name: /close/i });
    const closeButton = closeButtons[1];
    fireEvent.click(closeButton);

    expect(modal).not.toBeVisible();
  });

  describe('Form Submission', () => {
    it('Submit button disabled by default', () => {
      render(<ExpireEntitlementFormWrapper {...entitlementFormData} />);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();
    });

    it('Successful form submission', async () => {
      const apiMock = jest.spyOn(api, 'patchEntitlement').mockResolvedValueOnce({});

      render(<ExpireEntitlementFormWrapper {...entitlementFormData} />);

      const commentsTextArea = screen.getByPlaceholderText(/explanation/i);
      fireEvent.change(commentsTextArea, {
        target: { value: 'expiring entitlement' },
      });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeEnabled();

      fireEvent.click(submitButton);
      expect(apiMock).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(entitlementFormData.changeHandler).toHaveBeenCalledTimes(1);
      });

      apiMock.mockReset();
    });

    it('Unsuccessful form submission', async () => {
      const apiMock = jest.spyOn(api, 'patchEntitlement').mockResolvedValueOnce({
        errors: [
          {
            code: null,
            dismissible: true,
            text: 'Error expiring entitlement',
            type: 'danger',
            topic: 'expireEntitlement',
          },
        ],
      });

      render(<ExpireEntitlementFormWrapper {...entitlementFormData} />);

      const commentsTextArea = screen.getByPlaceholderText(/explanation/i);
      fireEvent.change(commentsTextArea, {
        target: { value: 'expiring entitlement' },
      });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(apiMock).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(screen.getByText(/error expiring entitlement/i)).toBeInTheDocument();
      });
    });
  });
});
