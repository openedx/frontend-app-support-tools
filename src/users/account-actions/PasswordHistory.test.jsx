import React from 'react';
import {
  render,
  screen,
  fireEvent,
  within,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import PasswordHistory from './PasswordHistory';
import UserSummaryData from '../data/test/userSummary';

const PasswordHistoryWrapper = (props) => (
  <IntlProvider locale="en">
    <PasswordHistory {...props} />
  </IntlProvider>
);

describe('Password History Component Tests', () => {
  const data = {
    passwordStatus: UserSummaryData.userData.passwordStatus,
  };

  it('Password History Modal', () => {
    render(<PasswordHistoryWrapper {...data} />);

    const passwordHistoryButton = screen.getByRole('button', {
      name: /Show History/i,
    });
    expect(passwordHistoryButton).toBeInTheDocument();
    expect(passwordHistoryButton).not.toBeDisabled();

    let historyModal = screen.queryByRole('dialog');
    expect(historyModal).not.toBeInTheDocument();

    fireEvent.click(passwordHistoryButton);

    historyModal = screen.getByRole('dialog');
    expect(historyModal).toBeInTheDocument();

    expect(
      within(historyModal).getByRole('heading', {
        name: /Enable\/Disable History/i,
      }),
    ).toBeInTheDocument();

    const table = within(historyModal).getByRole('table');
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(3);

    const closeButtons = within(historyModal).getAllByRole('button', {
      name: /Close/i,
    });
    const footerCloseButton = closeButtons.find(
      (btn) => btn.textContent.trim() === 'Close',
    );
    fireEvent.click(footerCloseButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
