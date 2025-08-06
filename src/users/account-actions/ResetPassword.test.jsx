import React from 'react';
import PropTypes from 'prop-types';
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import * as api from '../data/api';
import ResetPassword from './ResetPassword';
import UserSummaryData from '../data/test/userSummary';

const ResetPasswordWrapper = (props) => {
  const { email, changeHandler } = props;
  return (
    <IntlProvider locale="en">
      <ResetPassword email={email} changeHandler={changeHandler} />
    </IntlProvider>
  );
};

ResetPasswordWrapper.propTypes = {
  email: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
};

describe('Reset Password Component Tests', () => {
  const changeHandler = jest.fn();
  const { email } = UserSummaryData.userData;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Reset Password button for a User', () => {
    render(<ResetPasswordWrapper email={email} changeHandler={changeHandler} />);
    const passwordResetButton = screen.getByRole('button', {
      name: /Reset Password/i,
    });
    expect(passwordResetButton).toBeInTheDocument();
  });

  it('Reset Password Modal', async () => {
    const mockApiCall = jest.spyOn(api, 'postResetPassword').mockResolvedValue({});

    render(<ResetPasswordWrapper email={email} changeHandler={changeHandler} />);
    const passwordResetButton = screen.getByRole('button', {
      name: /Reset Password/i,
    });
    fireEvent.click(passwordResetButton);

    const modal = await screen.findByRole('dialog');
    const modalWithin = within(modal);

    expect(
      modalWithin.getByRole('heading', { name: /Reset Password/i }),
    ).toBeInTheDocument();
    expect(modalWithin.getByText(new RegExp(email, 'i'))).toBeInTheDocument();

    const confirmButton = modalWithin.getByRole('button', { name: /Confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => expect(changeHandler).toHaveBeenCalled());

    const closeButtons = modalWithin.getAllByRole('button', { name: /Close/i });
    const footerCloseButton = closeButtons.find(
      (btn) => btn.textContent.trim() === 'Close',
    );
    fireEvent.click(footerCloseButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    mockApiCall.mockRestore();
  });

  it('Display Error on Reset Password Modal', async () => {
    const resetPasswordErrors = {
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'Your previous request is in progress, please try again in a few moments',
          type: 'error',
          topic: 'resetPassword',
        },
      ],
    };
    const mockApiCall = jest
      .spyOn(api, 'postResetPassword')
      .mockResolvedValue(resetPasswordErrors);

    render(<ResetPasswordWrapper email={email} changeHandler={changeHandler} />);
    fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

    const modal = await screen.findByRole('dialog');
    const modalWithin = within(modal);

    const confirmButton = modalWithin.getByRole('button', { name: /Confirm/i });
    fireEvent.click(confirmButton);

    const errorAlert = await modalWithin.findByText(
      /Your previous request is in progress/i,
    );
    expect(errorAlert).toBeInTheDocument();

    const closeButtons = modalWithin.getAllByRole('button', { name: /Close/i });
    const footerCloseButton = closeButtons.find(
      (btn) => btn.textContent.trim() === 'Close',
    );
    fireEvent.click(footerCloseButton);

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    mockApiCall.mockRestore();
  });

  it('Display Unknown Error on Reset Password Modal', async () => {
    const resetPasswordErrors = {
      errors: [
        {
          code: null,
          dismissible: true,
          text: null,
          type: 'error',
          topic: 'resetPassword',
        },
      ],
    };
    const mockApiCall = jest
      .spyOn(api, 'postResetPassword')
      .mockResolvedValue(resetPasswordErrors);

    render(<ResetPasswordWrapper email={email} changeHandler={changeHandler} />);
    fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

    const modal = await screen.findByRole('dialog');
    const modalWithin = within(modal);

    const confirmButton = modalWithin.getByRole('button', { name: /Confirm/i });
    fireEvent.click(confirmButton);

    const errorAlert = await modalWithin.findByText(
      /Something went wrong\. Please try again later!/i,
    );
    expect(errorAlert).toBeInTheDocument();

    mockApiCall.mockRestore();
  });
});
