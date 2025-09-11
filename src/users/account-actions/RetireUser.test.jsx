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
import RetireUser from './RetireUser';
import UserSummaryData from '../data/test/userSummary';

const RetireUserWrapper = ({ email, username, changeHandler }) => (
  <IntlProvider locale="en">
    <RetireUser email={email} username={username} changeHandler={changeHandler} />
  </IntlProvider>
);

RetireUserWrapper.propTypes = {
  email: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
};

describe('Retire User Component Tests', () => {
  const { email, username } = UserSummaryData.userData;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Retire User button for a User', () => {
    const mockChangeHandler = jest.fn();
    render(
      <RetireUserWrapper
        email={email}
        username={username}
        changeHandler={mockChangeHandler}
      />,
    );
    const retireUserButton = screen.getByRole('button', { name: /Retire User/i });
    expect(retireUserButton).toBeInTheDocument();
  });

  it('Retire User Modal Success', async () => {
    const mockChangeHandler = jest.fn();
    const mockApiCall = jest.spyOn(api, 'postRetireUser').mockResolvedValue({});

    render(
      <RetireUserWrapper
        email={email}
        username={username}
        changeHandler={mockChangeHandler}
      />,
    );

    const retireUserButton = screen.getByRole('button', { name: /Retire User/i });
    fireEvent.click(retireUserButton);

    const modal = await screen.findByRole('dialog');
    const modalWithin = within(modal);

    expect(
      modalWithin.getByRole('heading', { name: /Retire User Confirmation/i }),
    ).toBeInTheDocument();
    expect(modalWithin.getByText(new RegExp(email, 'i'))).toBeInTheDocument();

    const confirmButton = modalWithin.getByRole('button', { name: /Confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => expect(mockChangeHandler).toHaveBeenCalled());

    const closeButtons = modalWithin.getAllByRole('button', { name: /Close/i });
    const footerCloseButton = closeButtons.find(btn => btn.textContent.trim() === 'Close');
    fireEvent.click(footerCloseButton);

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    mockApiCall.mockRestore();
  });

  it('Retire User Modal Failure', async () => {
    const mockChangeHandler = jest.fn();
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
    const mockApiCall = jest.spyOn(api, 'postRetireUser').mockResolvedValue(retireUserErrors);

    render(
      <RetireUserWrapper
        email={email}
        username={username}
        changeHandler={mockChangeHandler}
      />,
    );
    const retireUserButton = screen.getByRole('button', { name: /Retire User/i });
    fireEvent.click(retireUserButton);

    const modal = await screen.findByRole('dialog');
    const modalWithin = within(modal);

    const confirmButton = modalWithin.getByRole('button', { name: /Confirm/i });
    fireEvent.click(confirmButton);

    const errorAlert = await modalWithin.findByText(/Something went wrong/i);
    expect(errorAlert).toBeInTheDocument();

    expect(modal).toBeInTheDocument();

    mockApiCall.mockRestore();
  });

  it('Retire User button disabled for already retired users', () => {
    const mockChangeHandler = jest.fn();
    render(
      <RetireUserWrapper
        email="invalid@retired.invalid"
        username={username}
        changeHandler={mockChangeHandler}
      />,
    );
    const retireUserButton = screen.getByRole('button', { name: /Retire User/i });
    expect(retireUserButton).toBeDisabled();
  });
});
