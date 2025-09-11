import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import CreateEntitlementForm from './CreateEntitlementForm';
import entitlementFormData from '../data/test/entitlementForm';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from '../data/api';

const renderWithProviders = (props = {}) => render(
  <IntlProvider locale="en">
    <UserMessagesProvider>
      <CreateEntitlementForm {...entitlementFormData} {...props} />
    </UserMessagesProvider>
  </IntlProvider>,
);

describe('Create Entitlement Form', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Default form render', () => {
    renderWithProviders();

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();

    expect(
      within(modal).getByRole('heading', { name: /create new entitlement/i }),
    ).toBeInTheDocument();

    const courseUuidInput = screen.getByPlaceholderText(/course uuid/i);
    const modeSelectDropdown = screen.getByRole('combobox');
    const commentsTextArea = screen.getByPlaceholderText(/explanation/i);

    expect(courseUuidInput).toHaveValue(entitlementFormData.entitlement.courseUuid);
    expect(within(modeSelectDropdown).getAllByRole('option')).toHaveLength(4);
    expect(commentsTextArea).toHaveValue('');

    const closeBtn = screen.getAllByRole('button', { name: /^close$/i })[0];
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  describe('Form Submission', () => {
    it('Submit button disabled by default', () => {
      renderWithProviders();
      expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
    });

    it('Successful form submission', async () => {
      const apiMock = jest.spyOn(api, 'postEntitlement').mockResolvedValueOnce({});
      renderWithProviders();

      fireEvent.change(screen.getByPlaceholderText(/course uuid/i), {
        target: { value: 'b4f19c72-784d-4110-a3ba-318666a7db1a' },
      });
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'professional' },
      });
      fireEvent.change(screen.getByPlaceholderText(/explanation/i), {
        target: { value: 'creating new entitlement' },
      });

      const submitBtn = screen.getByRole('button', { name: /submit/i });
      expect(submitBtn).not.toBeDisabled();
      fireEvent.click(submitBtn);

      expect(apiMock).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(entitlementFormData.changeHandler).toHaveBeenCalledTimes(1));
    });

    it('Unsuccessful form submission', async () => {
      const apiMock = jest.spyOn(api, 'postEntitlement').mockResolvedValueOnce({
        errors: [
          {
            code: null,
            dismissible: true,
            text: 'Error creating entitlement',
            type: 'danger',
            topic: 'createEntitlement',
          },
        ],
      });

      renderWithProviders();

      fireEvent.change(screen.getByPlaceholderText(/explanation/i), {
        target: { value: 'creating new entitlement' },
      });
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));

      expect(apiMock).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(screen.getByText(/error creating entitlement/i)).toBeInTheDocument());
    });
  });
});
