import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import AccountActions from './AccountActions';
import UserSummaryData from '../data/test/userSummary';

const renderWithProviders = (props) => render(
  <IntlProvider locale="en">
    <AccountActions {...props} />
  </IntlProvider>,
);

describe('Account Actions Component Tests', () => {
  beforeEach(() => {
    renderWithProviders(UserSummaryData);
  });

  it('Action Buttons rendered', () => {
    const passwordHistoryButton = screen.getByRole('button', { name: /show history/i });
    const toggleUserStatusButton = screen.getByRole('button', { name: /disable user/i });
    const passwordResetEmailButton = screen.getByRole('button', { name: /reset password/i });

    expect(passwordHistoryButton).toBeEnabled();
    expect(toggleUserStatusButton).toBeEnabled();
    expect(passwordResetEmailButton).toBeEnabled();

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Account Actions');
  });
});
