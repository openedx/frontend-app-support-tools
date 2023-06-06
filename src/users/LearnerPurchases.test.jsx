import React from 'react';
import { render, queryByAttribute } from '@testing-library/react';
import '@testing-library/jest-dom';
import LearnerPurchases from './LearnerPurchases';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';

const LearnerPurchasesWrapper = (props) => (
  <UserMessagesProvider>
    <LearnerPurchases {...props} />
  </UserMessagesProvider>
);

describe('LearnerPurchases', () => {
  it('renders the component with the provided user prop', () => {
    const user = 'John Doe';
    const getById = queryByAttribute.bind(null, 'id');
    const document = render(<LearnerPurchasesWrapper user={user} />);
    const { getByText } = document;

    // Assert that the LearnerPurchasesContainer div is rendered
    const container = getById(document.container, 'learnerPurchasesContainer');
    expect(container).toBeInTheDocument();
    expect(getByText('Order History (0)')).toBeInTheDocument();
  });
});
