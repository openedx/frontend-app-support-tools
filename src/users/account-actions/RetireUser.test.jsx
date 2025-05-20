import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import * as api from '../data/api';
import RetireUser from './RetireUser';
import UserSummaryData from '../data/test/userSummary';

const RetireUserWrapper = (props) => (
  <IntlProvider locale="en">
    <RetireUser {...props} />
  </IntlProvider>
);

describe('Retire User Component Tests', () => {
  let unmountComponent;
  const data = {
    email: UserSummaryData.userData.email,
    username: UserSummaryData.userData.username,
    changeHandler: UserSummaryData.changeHandler,
  };

  beforeEach(() => {
    const { unmount } = render(<RetireUserWrapper {...data} />);
    unmountComponent = unmount;
  });

  afterEach(() => {
    unmountComponent();
  });

  it('Retire User button for a User', () => {
    const retireUserButton = document.querySelector('#retire-user');
    expect(retireUserButton.textContent).toEqual('Retire User');
  });

  it('Retire User Modal Success', async () => {
    const mockApiCall = jest.spyOn(api, 'postRetireUser').mockImplementationOnce(() => Promise.resolve({}));
    const retireUserButton = document.querySelector('#retire-user');
    let retireUserModalBody = await screen.queryByTestId('user-account-retire-modal-body');

    expect(retireUserModalBody).not.toBeInTheDocument(false);
    expect(retireUserButton.textContent).toEqual('Retire User');

    fireEvent.click(retireUserButton);
    retireUserModalBody = await screen.queryByTestId('user-account-retire-modal-body');

    expect(retireUserModalBody).toBeInTheDocument();
    const title = await screen.findByTestId('user-account-retire-modal-title');
    expect(title.textContent).toEqual('Retire User Confirmation');
    const confirmAlert = document.querySelector('.alert-warning');
    expect(confirmAlert.textContent).toEqual(
      "You are about to retire edx with the email address: edx@example.com. This is a serious action that will revoke this user's access to edX and their earned certificates. Furthermore, the email address associated with the retired account will not be able to be used to create a new account.",
    );
    const retireConfirmButton = await screen.findByTestId('retire-user-account-confirmation-button');
    await waitFor(() => fireEvent.click(retireConfirmButton));
    expect(UserSummaryData.changeHandler).toHaveBeenCalled();
    const closeModalButton = await screen.findByTestId('user-account-retire-modal-close-button');
    fireEvent.click(closeModalButton);
    retireUserModalBody = await screen.queryByTestId('user-account-retire-modal-body');
    expect(retireUserModalBody).not.toBeInTheDocument();
    mockApiCall.mockRestore();
  });

  it('Retire User Modal Failure', async () => {
    const retireUserErrors = {
      errors: [
        {
          code: null,
          dismissible: true,
          text: '',
          type: 'error',
          topic: 'retireUser',
        },
      ],
    };
    const mockApiCall = jest.spyOn(api, 'postRetireUser').mockImplementationOnce(() => Promise.resolve(retireUserErrors));
    const retireUserButton = document.querySelector('#retire-user');
    fireEvent.click(retireUserButton);

    const retireUserConfirmationButton = await screen.findByTestId('retire-user-account-confirmation-button');
    await waitFor(() => fireEvent.click(retireUserConfirmationButton));
    const retireUserModalBody = await screen.queryByTestId('user-account-retire-modal-body');

    const confirmAlert = document.querySelector('.alert-danger');
    expect(confirmAlert.textContent).toEqual(
      'Something went wrong. Please try again later!',
    );
    expect(retireUserModalBody).toBeInTheDocument();

    mockApiCall.mockRestore();
  });

  it('Retire User button disabled for already retired users', () => {
    unmountComponent();
    render(<RetireUserWrapper {...data} email="invalid@retired.invalid" />);
    const retireUserButton = document.querySelector('#retire-user');
    expect(retireUserButton.disabled).toEqual(true);
  });
});
