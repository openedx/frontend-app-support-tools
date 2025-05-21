import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import ReissueEntitlementForm from './ReissueEntitlementForm';
import entitlementFormData from '../data/test/entitlementForm';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from '../data/api';

const ReissueEntitlementFormWrapper = (props) => (
  <UserMessagesProvider>
    <ReissueEntitlementForm {...props} />
  </UserMessagesProvider>
);

describe('Reissue Entitlement Form', () => {
  let unmountComponent;

  beforeEach(() => {
    const { unmount } = render(<ReissueEntitlementFormWrapper {...entitlementFormData} />);
    unmountComponent = unmount;
  });

  afterEach(() => {
    unmountComponent();
  });

  it('Default form render', async () => {
    let reissueFormModal = await screen.findByTestId('reissue-entitlement-modal-body');
    expect(reissueFormModal).toBeInTheDocument();
    const commentsTextArea = document.querySelector('textarea#comments');
    expect(commentsTextArea.textContent).toEqual('');

    const modalCloseButton = await screen.findByTestId('reissue-entitlement-modal-close-button');
    fireEvent.click(modalCloseButton);
    reissueFormModal = await screen.queryByTestId('reissue-entitlement-modal-body');
    expect(reissueFormModal).not.toBeInTheDocument();
  });

  describe('Form Submission', () => {
    it('Submit button disabled by default', () => {
      expect(document.querySelector('button.btn-primary').disabled).toBeTruthy();
    });

    it('Successful form submission', async () => {
      const apiMock = jest.spyOn(api, 'patchEntitlement').mockImplementationOnce(() => Promise.resolve({}));
      expect(apiMock).toHaveBeenCalledTimes(0);

      fireEvent.change(document.querySelector('textarea#comments'), { target: { value: 'reissue the expired entitlement' } });
      let submitButton = await screen.findByTestId('reissue-entitlement-submit-button');
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

      submitButton = await screen.queryByTestId('reissue-entitlement-submit-button');
      expect(submitButton).not.toBeInTheDocument();
    });

    it('Unsuccessful form submission', async () => {
      const apiMock = jest.spyOn(api, 'patchEntitlement').mockImplementationOnce(() => Promise.resolve({
        errors: [
          {
            code: null,
            dismissible: true,
            text: 'Error during reissue of entitlement',
            type: 'danger',
            topic: 'reissueEntitlement',
          },
        ],
      }));
      expect(apiMock).toHaveBeenCalledTimes(0);

      fireEvent.change(document.querySelector('textarea#comments'), { target: { value: 'reissue the expired entitlement' } });
      fireEvent.click(document.querySelector('button.btn-primary'));

      expect(apiMock).toHaveBeenCalledTimes(1);
      waitFor(() => expect(document.querySelector('.alert').textContent).toEqual('Error during reissue of entitlement'));
    });
  });
});
