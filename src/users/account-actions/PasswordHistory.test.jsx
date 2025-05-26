import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import PasswordHistory from './PasswordHistory';
import UserSummaryData from '../data/test/userSummary';
import '@testing-library/jest-dom';

describe('Password History Component Tests', () => {
  let unmountComponent;

  beforeEach(() => {
    const data = {
      passwordStatus: UserSummaryData.userData.passwordStatus,
    };
    const { unmount } = render(
      <IntlProvider locale="en">
        <PasswordHistory {...data} />
      </IntlProvider>,
    );
    unmountComponent = unmount;
  });

  afterEach(() => {
    unmountComponent();
  });

  it('Password History Modal', async () => {
    const passwordHistoryButton = document.querySelector('button#toggle-password-history');
    let historyModal = await screen.queryByTestId('password-history-modal-body');

    expect(historyModal).not.toBeInTheDocument();
    expect(passwordHistoryButton.textContent).toEqual('Show History');
    expect(passwordHistoryButton.disabled).toBeFalsy();

    fireEvent.click(passwordHistoryButton);
    historyModal = await screen.queryByTestId('password-history-modal-body');

    expect(historyModal).toBeInTheDocument();
    expect(document.querySelectorAll('table tbody tr')).toHaveLength(2);

    const closeButton = await screen.findByTestId('password-history-modal-close-button');
    fireEvent.click(closeButton);
    historyModal = await screen.queryByTestId('password-history-modal-body');
    expect(historyModal).not.toBeInTheDocument();
  });
});
