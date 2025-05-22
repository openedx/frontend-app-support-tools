import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

import CreateEntitlementForm from './CreateEntitlementForm';
import entitlementFormData from '../data/test/entitlementForm';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from '../data/api';

const CreateEntitlementFormWrapper = (props) => (
  <UserMessagesProvider>
    <CreateEntitlementForm {...props} />
  </UserMessagesProvider>
);

describe('Create Entitlement Form', () => {
  let unmountComponent;

  beforeEach(() => {
    const { unmount } = render(<CreateEntitlementFormWrapper {...entitlementFormData} />);
    unmountComponent = unmount;
  });

  afterEach(() => {
    unmountComponent();
  });

  it('Default form render', async () => {
    let createFormModal = await screen.findByTestId('create-entitlement-form');
    expect(createFormModal).toBeInTheDocument();
    const courseUuidInput = document.querySelector('input#courseUuid');
    const modeSelectDropdown = document.querySelector('select#mode');
    const commentsTextArea = document.querySelector('textarea#comments');
    expect(courseUuidInput.value).toEqual(entitlementFormData.entitlement.courseUuid);
    expect(modeSelectDropdown.querySelectorAll('option')).toHaveLength(4);
    expect(commentsTextArea.textContent).toEqual('');

    fireEvent.click(document.querySelector('button.btn-link'));
    createFormModal = await screen.queryByTestId('create-entitlement-form');
    expect(createFormModal).not.toBeInTheDocument();
  });

  describe('Form Submission', () => {
    it('Submit button disabled by default', () => {
      expect(document.querySelector('button.btn-primary').disabled).toBeTruthy();
    });

    it('Successful form submission', async () => {
      const apiMock = jest.spyOn(api, 'postEntitlement').mockImplementationOnce(() => Promise.resolve({}));
      expect(apiMock).toHaveBeenCalledTimes(0);

      fireEvent.change(document.querySelector('input#courseUuid'), { target: { value: 'b4f19c72-784d-4110-a3ba-318666a7db1a' } });
      fireEvent.change(document.querySelector('select#mode'), { target: { value: 'professional' } });
      fireEvent.change(document.querySelector('textarea#comments'), { target: { value: 'creating new entitlement' } });
      const submitButton = document.querySelector('button.btn-primary');
      expect(submitButton.disabled).toBeFalsy();
      expect(document.querySelectorAll('div.spinner-border').length).toEqual(0);
      fireEvent.click(submitButton);
      expect(document.querySelectorAll('div.spinner-border').length).toEqual(1);

      expect(apiMock).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(entitlementFormData.changeHandler).toHaveBeenCalledTimes(1);
        expect(document.querySelectorAll('div.spinner-border').length).toEqual(0);
      });
      apiMock.mockReset();
    });

    it('Unsuccessful form submission', async () => {
      const apiMock = jest.spyOn(api, 'postEntitlement').mockImplementationOnce(() => Promise.resolve({
        errors: [
          {
            code: null,
            dismissible: true,
            text: 'Error creating entitlement',
            type: 'danger',
            topic: 'createEntitlement',
          },
        ],
      }));
      expect(apiMock).toHaveBeenCalledTimes(0);

      fireEvent.change(document.querySelector('textarea#comments'), { target: { value: 'creating new entitlement' } });
      fireEvent.click(document.querySelector('button.btn-primary'));

      expect(apiMock).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(document.querySelector('.alert').textContent).toEqual('Error creating entitlement'));
    });
  });
});
