import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EntitlementForm from './EntitlementForm';
import entitlementFormData from '../data/test/entitlementForm';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import { CREATE, REISSUE, EXPIRE } from './EntitlementActions';

const EntitlementFormWrapper = (props) => (
  <UserMessagesProvider>
    <EntitlementForm {...props} />
  </UserMessagesProvider>
);

describe('Entitlement forms', () => {
  it('Create Entitlement form render', async () => {
    render(<EntitlementFormWrapper {...entitlementFormData} formType={CREATE} />);
    expect(await screen.queryByTestId('create-entitlement-form')).toBeInTheDocument();
    expect(await screen.queryByTestId('reissue-entitlement-form')).not.toBeInTheDocument();
    expect(await screen.queryByTestId('expire-entitlement-form')).not.toBeInTheDocument();
  });

  it('Reissue Entitlement form render', async () => {
    render(<EntitlementFormWrapper {...entitlementFormData} formType={REISSUE} />);
    expect(await screen.queryByTestId('create-entitlement-form')).not.toBeInTheDocument();
    expect(await screen.queryByTestId('reissue-entitlement-form')).toBeInTheDocument();
    expect(await screen.queryByTestId('expire-entitlement-form')).not.toBeInTheDocument();
  });

  it('Expire Entitlement form render', async () => {
    render(<EntitlementFormWrapper {...entitlementFormData} formType={EXPIRE} />);
    expect(await screen.queryByTestId('create-entitlement-form')).not.toBeInTheDocument();
    expect(await screen.queryByTestId('reissue-entitlement-form')).not.toBeInTheDocument();
    expect(await screen.queryByTestId('expire-entitlement-form')).toBeInTheDocument();
  });
});
