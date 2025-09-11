import React from 'react';
import {
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import ReissueEntitlementForm from './ReissueEntitlementForm';
import entitlementFormData from '../data/test/entitlementForm';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from '../data/api';

const ReissueEntitlementFormWrapper = (props) => (
  <IntlProvider locale="en">
    <UserMessagesProvider>
      <ReissueEntitlementForm {...props} />
    </UserMessagesProvider>
  </IntlProvider>
);

describe('Reissue Entitlement Form', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Default form render', async () => {
    render(<ReissueEntitlementFormWrapper {...entitlementFormData} />);

    const reissueFormModal = screen.getByRole('dialog');
    expect(reissueFormModal).toBeVisible();

    // textarea has only placeholder, no label
    const commentsTextArea = screen.getByPlaceholderText('Explanation');
    expect(commentsTextArea).toHaveValue('');

    // Disambiguate: pick the footer "Close" button, not the icon button
    const closeButtons = screen.getAllByRole('button', { name: /close/i });
    const footerCloseButton = closeButtons.find(
      (btn) => btn.classList.contains('btn-link'),
    );

    await userEvent.click(footerCloseButton);

    await waitFor(() => {
      expect(reissueFormModal).not.toBeVisible();
    });
  });

  describe('Form Submission', () => {
    it('Submit button disabled by default', () => {
      render(<ReissueEntitlementFormWrapper {...entitlementFormData} />);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();
    });

    it('Successful form submission', async () => {
      const apiMock = jest.spyOn(api, 'patchEntitlement').mockResolvedValueOnce({});
      render(<ReissueEntitlementFormWrapper {...entitlementFormData} />);

      const textarea = screen.getByPlaceholderText('Explanation');
      await userEvent.type(textarea, 'reissue the expired entitlement');

      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeEnabled();

      // Before submitting, no alert should be shown
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      await userEvent.click(submitButton);

      // After submitting, success alert appears
      const successAlert = await screen.findByRole('alert');
      expect(successAlert).toHaveTextContent(/Entitlement successfully reissued/i);

      expect(apiMock).toHaveBeenCalledTimes(1);

      // Verify changeHandler was called
      await waitFor(() => {
        expect(entitlementFormData.changeHandler).toHaveBeenCalledTimes(1);
      });

      // Pick the *footer* Close button specifically
      const closeButtons = screen.getAllByRole('button', { name: /close/i });
      const footerCloseButton = closeButtons.find(
        (btn) => btn.classList.contains('btn-link'),
      );

      await userEvent.click(footerCloseButton);

      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
    });

    it('Unsuccessful form submission', async () => {
      const apiMock = jest.spyOn(api, 'patchEntitlement').mockResolvedValueOnce({
        errors: [
          {
            code: null,
            dismissible: true,
            text: 'Error during reissue of entitlement',
            type: 'danger',
            topic: 'reissueEntitlement',
          },
        ],
      });

      render(<ReissueEntitlementFormWrapper {...entitlementFormData} />);

      const textarea = screen.getByPlaceholderText('Explanation');
      await userEvent.type(textarea, 'reissue the expired entitlement');

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await userEvent.click(submitButton);

      expect(apiMock).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Error during reissue of entitlement',
        );
      });
    });
  });
});
