import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n'; // or `react-intl`

import EntitlementForm from './EntitlementForm';
import entitlementFormData from '../data/test/entitlementForm';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import { CREATE, REISSUE, EXPIRE } from './EntitlementActions';

const renderWithProviders = (ui, props = {}) => render(
  <IntlProvider locale="en">
    <UserMessagesProvider>
      {React.cloneElement(ui, props)}
    </UserMessagesProvider>
  </IntlProvider>,
);

describe('Entitlement forms', () => {
  it('renders Create Entitlement form', () => {
    renderWithProviders(<EntitlementForm {...entitlementFormData} formType={CREATE} />);

    expect(screen.getByRole('heading', { name: /create new entitlement/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /reissue entitlement/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /expire entitlement/i })).not.toBeInTheDocument();
  });

  it('renders Reissue Entitlement form', () => {
    renderWithProviders(<EntitlementForm {...entitlementFormData} formType={REISSUE} />);

    expect(screen.getByRole('heading', { name: /reissue entitlement/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /create new entitlement/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /expire entitlement/i })).not.toBeInTheDocument();
  });

  it('renders Expire Entitlement form', () => {
    renderWithProviders(<EntitlementForm {...entitlementFormData} formType={EXPIRE} />);

    expect(screen.getByRole('heading', { name: /expire entitlement/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /create new entitlement/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /reissue entitlement/i })).not.toBeInTheDocument();
  });
});
