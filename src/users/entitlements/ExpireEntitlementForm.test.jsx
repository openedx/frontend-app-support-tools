import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import ExpireEntitlementForm from './ExpireEntitlementForm';
import entitlementFormData from '../data/test/entitlementForm';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from '../data/api';

const ExpireEntitlementFormWrapper = (props) => (
  <UserMessagesProvider>
    <ExpireEntitlementForm {...props} />
  </UserMessagesProvider>
);

describe('Expire Entitlement Form', () => {
  let unmountComponent;

  beforeEach(() => {
    const { unmount } = render(<ExpireEntitlementFormWrapper {...entitlementFormData} />);
    unmountComponent = unmount;
  });

  afterEach(() => {
    unmountComponent();
  });

  it('Default form render', async () => {
    let expireFormModal = await screen.findByTestId('expire-entitlement-modal-body');
    expect(expireFormModal).toBeInTheDocument();
    const commentsTextArea = document.querySelector('textarea#comments');
    expect(commentsTextArea.textContent).toEqual('');

    const closeModalButton = await screen.findByTestId('expire-entitlement-modal-close-button');
    fireEvent.click(closeModalButton);
    expireFormModal = await screen.queryByTestId('expire-entitlement-modal-body');
    expect(expireFormModal).not.toBeInTheDocument();
  });

  describe('Form Submission', () => {
    it('Submit button disabled by default', () => {
      expect(document.querySelector('button.btn-primary').disabled).toBeTruthy();
    });

    it('Successful form submission', async () => {
      const apiMock = jest.spyOn(api, 'patchEntitlement').mockImplementationOnce(() => Promise.resolve({}));
      expect(apiMock).toHaveBeenCalledTimes(0);

      fireEvent.change(document.querySelector('textarea#comments'), { target: { value: 'expiring entitlement' } });
      let submitButton = document.querySelector('button.btn-primary');
      expect(submitButton.disabled).toBeFalsy();
      expect(document.querySelector('div.spinner-border')).not.toBeInTheDocument();
      fireEvent.click(submitButton);
      expect(document.querySelector('div.spinner-border')).toBeInTheDocument();

      expect(apiMock).toHaveBeenCalledTimes(1);
      waitFor(() => {
        expect(entitlementFormData.changeHandler).toHaveBeenCalledTimes(1);
        expect(document.querySelector('div.spinner-border')).not.toBeInTheDocument();
      });
      apiMock.mockReset();

      submitButton = document.querySelector('button.btn-primary');
      expect(submitButton).not.toBeInTheDocument();
    });

    it('Unsuccessful form submission', async () => {
      const apiMock = jest.spyOn(api, 'patchEntitlement').mockImplementationOnce(() => Promise.resolve({
        errors: [
          {
            code: null,
            dismissible: true,
            text: 'Error expiring entitlement',
            type: 'danger',
            topic: 'expireEntitlement',
          },
        ],
      }));
      expect(apiMock).toHaveBeenCalledTimes(0);

      fireEvent.change(document.querySelector('textarea#comments'), { target: { value: 'expiring entitlement' } });
      fireEvent.click(document.querySelector('button.btn-primary'));

      expect(apiMock).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(document.querySelector('.alert').textContent).toEqual('Error expiring entitlement'));
    });
  });
});
