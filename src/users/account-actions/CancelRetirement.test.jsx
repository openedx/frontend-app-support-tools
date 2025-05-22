import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import * as api from '../data/api';
import CancelRetirement from './CancelRetirement';

const CancelRetirementWrapper = (props) => (
  <IntlProvider locale="en">
    <CancelRetirement {...props} />
  </IntlProvider>
);

describe('Cancel Retirement Component Tests', () => {
  let unmountComponent;
  const changeHandler = jest.fn(() => { });

  beforeEach(() => {
    const data = {
      retirement_id: 1,
      changeHandler,
    };
    const { unmount } = render(<CancelRetirementWrapper {...data} />);
    unmountComponent = unmount;
  });

  afterEach(() => {
    unmountComponent();
  });

  it('Cancel Retirement button for a User', () => {
    const cancelRetirementButton = document.querySelector('#cancel-retirement');
    expect(cancelRetirementButton.textContent).toEqual('Cancel Retirement');
  });

  it('Cancel Retirement Modal', async () => {
    const mockApiCall = jest.spyOn(api, 'postCancelRetirement').mockImplementationOnce(() => Promise.resolve({}));
    const cancelRetirementButton = document.querySelector('#cancel-retirement');
    // modal dialogue can't be queried hence we are querying modal body
    let cancelRetirementModalBody = await screen.queryByTestId('cancel-retirement-modal-body');
    expect(cancelRetirementModalBody).not.toBeInTheDocument();

    fireEvent.click(cancelRetirementButton);
    cancelRetirementModalBody = await screen.findByTestId('cancel-retirement-modal-body');
    expect(cancelRetirementModalBody).toBeInTheDocument();
    const modalTitle = await screen.findByTestId('cancel-retirement-modal-title');
    expect(modalTitle.textContent).toEqual('Cancel Retirement');
    const confirmAlert = document.querySelector('.alert-warning');
    expect(confirmAlert.textContent).toEqual('This will cancel retirement for the requested user. Do you wish to proceed?');

    const cancelConfirmationButton = await screen.findByTestId('cancel-retirement-confirmation-button');
    await waitFor(() => fireEvent.click(cancelConfirmationButton));
    expect(changeHandler).toHaveBeenCalled();
    const closeButton = await screen.findByTestId('cancel-retirement-modal-close-button');
    fireEvent.click(closeButton);
    cancelRetirementModalBody = await screen.queryByTestId('cancel-retirement-modal-body');
    expect(cancelRetirementModalBody).not.toBeInTheDocument(false);

    mockApiCall.mockRestore();
  });

  it('Display Error on Cancel RetirementModal', async () => {
    const cancelRetirementErrors = {
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'Retirement does not exist!',
          type: 'error',
          topic: 'cancelRetirement',
        },
      ],
    };
    const mockApiCall = jest.spyOn(api, 'postCancelRetirement').mockImplementationOnce(() => Promise.resolve(cancelRetirementErrors));
    const cancelRetirementButton = document.querySelector('#cancel-retirement');
    fireEvent.click(cancelRetirementButton);
    let cancelRetirementModalBody = await screen.queryByTestId('cancel-retirement-modal-body');
    expect(cancelRetirementModalBody).toBeInTheDocument();
    const confirmAlert = document.querySelector('.alert-warning');
    expect(confirmAlert.textContent).toEqual(
      'This will cancel retirement for the requested user. Do you wish to proceed?',
    );

    const cancelConfirmationButton = await screen.findByTestId('cancel-retirement-confirmation-button');
    await waitFor(() => fireEvent.click(cancelConfirmationButton));
    const errorAlert = document.querySelector('.alert-danger');
    waitFor(() => expect(errorAlert.textContent).toEqual('Retirement does not exist!'));

    const closeButton = await screen.findByTestId('cancel-retirement-modal-close-button');
    fireEvent.click(closeButton);
    cancelRetirementModalBody = await screen.queryByTestId('cancel-retirement-modal-body');
    expect(cancelRetirementModalBody).not.toBeInTheDocument();
    mockApiCall.mockRestore();
  });

  it('Display Unknown Error on Cancel Retirement Modal', async () => {
    const cancelRetirementErrors = {
      errors: [
        {
          code: null,
          dismissible: true,
          text: null,
          type: 'error',
          topic: 'cancelRetirement',
        },
      ],
    };
    const mockApiCall = jest.spyOn(api, 'postCancelRetirement').mockImplementationOnce(() => Promise.resolve(cancelRetirementErrors));
    const cancelRetirementButton = document.querySelector('#cancel-retirement');
    fireEvent.click(cancelRetirementButton);
    const cancelRetirementModalBody = await screen.queryByTestId('cancel-retirement-modal-body');
    expect(cancelRetirementModalBody).toBeInTheDocument();
    const cancelConfirmationButton = await screen.findByTestId('cancel-retirement-confirmation-button');
    await waitFor(() => fireEvent.click(cancelConfirmationButton));
    const errorAlert = document.querySelector('.alert-danger');
    waitFor(() => expect(errorAlert.textContent).toEqual(
      'Something went wrong. Please try again later!',
    ));
    mockApiCall.mockRestore();
  });
});
