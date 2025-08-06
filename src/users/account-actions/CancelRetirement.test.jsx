import React from 'react';
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import * as api from '../data/api';
import CancelRetirement from './CancelRetirement';

const CancelRetirementWrapper = (props) => (
  <IntlProvider locale="en">
    <CancelRetirement {...props} />
  </IntlProvider>
);

describe('Cancel Retirement Component Tests', () => {
  const changeHandler = jest.fn();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Cancel Retirement button for a User', () => {
    render(<CancelRetirementWrapper retirement_id={1} changeHandler={changeHandler} />);
    const cancelRetirementButton = screen.getByRole('button', { name: /Cancel Retirement/i });
    expect(cancelRetirementButton).toBeInTheDocument();
  });

  it('Cancel Retirement Modal', async () => {
    const mockApiCall = jest.spyOn(api, 'postCancelRetirement').mockResolvedValue({});

    render(<CancelRetirementWrapper retirement_id={1} changeHandler={changeHandler} />);
    fireEvent.click(screen.getByRole('button', { name: /Cancel Retirement/i }));

    const modal = await screen.findByRole('dialog');
    const modalWithin = within(modal);

    expect(modalWithin.getByRole('heading', { name: /Cancel Retirement/i })).toBeInTheDocument();
    expect(modalWithin.getByText(/This will cancel retirement for the requested user/i)).toBeInTheDocument();

    const confirmButton = modalWithin.getByRole('button', { name: /Confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => expect(changeHandler).toHaveBeenCalled());

    // Get footer Close button to avoid multiple matches
    const closeButtons = modalWithin.getAllByRole('button', { name: /Close/i });
    const footerCloseButton = closeButtons.find((btn) => btn.textContent === 'Close');
    fireEvent.click(footerCloseButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

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

    const mockApiCall = jest.spyOn(api, 'postCancelRetirement').mockResolvedValue(cancelRetirementErrors);

    render(<CancelRetirementWrapper retirement_id={1} changeHandler={changeHandler} />);
    fireEvent.click(screen.getByRole('button', { name: /Cancel Retirement/i }));

    const modal = await screen.findByRole('dialog');
    const modalWithin = within(modal);

    const confirmButton = modalWithin.getByRole('button', { name: /Confirm/i });
    fireEvent.click(confirmButton);

    const errorAlert = await modalWithin.findByText(/Retirement does not exist!/i);
    expect(errorAlert).toBeInTheDocument();

    // Click footer Close button
    const closeButtons = modalWithin.getAllByRole('button', { name: /Close/i });
    const footerCloseButton = closeButtons.find((btn) => btn.textContent === 'Close');
    fireEvent.click(footerCloseButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

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

    const mockApiCall = jest.spyOn(api, 'postCancelRetirement').mockResolvedValue(cancelRetirementErrors);

    render(<CancelRetirementWrapper retirement_id={1} changeHandler={changeHandler} />);
    fireEvent.click(screen.getByRole('button', { name: /Cancel Retirement/i }));

    const modal = await screen.findByRole('dialog');
    const modalWithin = within(modal);

    const confirmButton = modalWithin.getByRole('button', { name: /Confirm/i });
    fireEvent.click(confirmButton);

    const errorAlert = await modalWithin.findByText(/Something went wrong. Please try again later!/i);
    expect(errorAlert).toBeInTheDocument();

    // Click footer Close button
    const closeButtons = modalWithin.getAllByRole('button', { name: /Close/i });
    const footerCloseButton = closeButtons.find((btn) => btn.textContent === 'Close');
    fireEvent.click(footerCloseButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    mockApiCall.mockRestore();
  });
});
