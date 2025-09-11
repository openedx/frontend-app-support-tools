import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import * as api from '../data/api';
import TogglePasswordStatus from './TogglePasswordStatus';
import UserSummaryData from '../data/test/userSummary';

const TogglePasswordStatusWrapper = ({ username, passwordStatus, changeHandler }) => (
  <IntlProvider locale="en">
    <TogglePasswordStatus
      username={username}
      passwordStatus={passwordStatus}
      changeHandler={changeHandler}
    />
  </IntlProvider>
);

TogglePasswordStatusWrapper.propTypes = {
  username: PropTypes.string.isRequired,
  passwordStatus: PropTypes.shape({
    status: PropTypes.string.isRequired,
  }).isRequired,
  changeHandler: PropTypes.func.isRequired,
};

describe('Toggle Password Status Component Tests', () => {
  const { username, passwordStatus } = UserSummaryData.userData;

  describe('Disable User Button', () => {
    it('Disable User button for active user', () => {
      const changeHandler = jest.fn();
      render(
        <TogglePasswordStatusWrapper
          username={username}
          passwordStatus={passwordStatus}
          changeHandler={changeHandler}
        />,
      );
      const button = screen.getByRole('button', { name: /Disable User/i });
      expect(button).toBeEnabled();
    });

    it('Disable User Modal', async () => {
      const changeHandler = jest.fn();
      const mockApiCall = jest.spyOn(api, 'postTogglePasswordStatus').mockResolvedValue({});

      render(
        <TogglePasswordStatusWrapper
          username={username}
          passwordStatus={passwordStatus}
          changeHandler={changeHandler}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: /Disable User/i }));

      const modal = await screen.findByRole('dialog');
      const modalWithin = within(modal);

      expect(modalWithin.getByRole('heading')).toHaveTextContent(/Disable user confirmation/i);

      const input = modal.querySelector('input[name="comment"]');
      expect(input).toBeInTheDocument();

      fireEvent.change(input, { target: { value: 'Disable Test User' } });
      fireEvent.click(modalWithin.getByRole('button', { name: /Confirm/i }));

      await waitFor(() => expect(changeHandler).toHaveBeenCalledTimes(1));

      const footer = modal.querySelector('.pgn__modal-footer');
      const footerWithin = within(footer);
      const closeButton = footerWithin.getByRole('button', { name: /Close/i });
      fireEvent.click(closeButton);

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

      mockApiCall.mockRestore();
    });
  });

  describe('Enable User Button', () => {
    const disabledPasswordStatus = { ...passwordStatus, status: 'Unusable' };

    it('Enable User button for disabled user', () => {
      const changeHandler = jest.fn();
      render(
        <TogglePasswordStatusWrapper
          username={username}
          passwordStatus={disabledPasswordStatus}
          changeHandler={changeHandler}
        />,
      );
      const button = screen.getByRole('button', { name: /Enable User/i });
      expect(button).toBeEnabled();
    });

    it('Enable User Modal', async () => {
      const changeHandler = jest.fn();
      const mockApiCall = jest.spyOn(api, 'postTogglePasswordStatus').mockResolvedValue({});

      render(
        <TogglePasswordStatusWrapper
          username={username}
          passwordStatus={disabledPasswordStatus}
          changeHandler={changeHandler}
        />,
      );

      const button = screen.getByRole('button', { name: /Enable User/i });
      fireEvent.click(button);

      const modal = await screen.findByRole('dialog');
      const modalWithin = within(modal);

      expect(modalWithin.getByRole('heading')).toHaveTextContent(/Enable user confirmation/i);

      expect(
        modalWithin.getByText((content, element) => (
          content.includes('Please provide the reason for enabling')
          && element.querySelector('b')?.textContent === username
        )),
      ).toBeInTheDocument();

      const input = modalWithin.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Enable Test User' } });

      const confirmButton = modalWithin.getByRole('button', { name: /Confirm/i });
      fireEvent.click(confirmButton);

      await waitFor(() => expect(changeHandler).toHaveBeenCalledTimes(1));
      mockApiCall.mockRestore();
    });
  });
});
