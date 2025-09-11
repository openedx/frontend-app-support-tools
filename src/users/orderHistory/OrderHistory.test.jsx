import React from 'react';
import {
  render, waitFor, fireEvent,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import OrderHistory from './OrderHistory';
import { getOrderHistory } from '../data/api';
import '@testing-library/jest-dom';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';

jest.mock('../data/api');

const OrderHistoryWrapper = (props) => (
  <IntlProvider locale="en">
    <UserMessagesProvider>
      <OrderHistory {...props} />
    </UserMessagesProvider>
  </IntlProvider>
);

describe('OrderHistory', () => {
  const username = 'testuser';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch order history data and render table', async () => {
    const orderHistoryData = [
      {
        status: 'completed',
        number: '12345',
        datePlaced: 'Jun 12, 2023 12:00 AM',
        productTracking: 'tracking123',
        lines: [
          {
            product: {
              url: 'https://example.com/product1',
              title: 'Product 1',
              expires: '2023-12-31',
              attributeValues: [{ value: 'Type A' }],
            },
            quantity: 1,
            status: 'completed',
          },
        ],
      },
    ];

    getOrderHistory.mockResolvedValueOnce(orderHistoryData);

    const { getByText, getAllByText } = render(<OrderHistoryWrapper username={username} />);

    await waitFor(() => {
      expect(getOrderHistory).toHaveBeenCalledWith(username);
    });

    expect(getByText('Order History (1)')).toBeInTheDocument();
    expect(getByText('Order Status')).toBeInTheDocument();
    expect(getByText('Order Number')).toBeInTheDocument();
    expect(getByText('Date Placed')).toBeInTheDocument();
    expect(getByText('Product Tracking')).toBeInTheDocument();
    expect(getByText('Expand All')).toBeInTheDocument();

    fireEvent.click(getByText('Expand All'));

    expect(getAllByText('completed')[0]).toBeInTheDocument();
    expect(getAllByText('completed')[1]).toBeInTheDocument();
    expect(getByText('12345')).toBeInTheDocument();
    expect(getByText('Jun 12, 2023 12:00 AM')).toBeInTheDocument();
    expect(getByText('tracking123')).toBeInTheDocument();
    expect(getByText('Product 1')).toBeInTheDocument();
    expect(getByText('Type A')).toBeInTheDocument();
  });

  it('should render loading indicator while fetching data', async () => {
    getOrderHistory.mockResolvedValueOnce([]);

    const { getByText } = render(<OrderHistoryWrapper username={username} />);

    // Flexible matcher in case component uses "Loading..." instead of "Loading"
    expect(getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(getOrderHistory).toHaveBeenCalledWith(username);
    });
  });

  it('should handle empty order history data', async () => {
    getOrderHistory.mockResolvedValueOnce([]);

    const { getByText } = render(<OrderHistoryWrapper username={username} />);

    await waitFor(() => {
      expect(getOrderHistory).toHaveBeenCalledWith(username);
    });

    expect(getByText('Order History (0)')).toBeInTheDocument();
  });

  it('displays error messages when there are errors in the API response', async () => {
    const mockErrors = {
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'There was an error retrieving order history for the user',
          type: 'danger',
          topic: 'orderHistory',
        },
      ],
    };

    getOrderHistory.mockResolvedValueOnce(mockErrors);

    const { getByText } = render(<OrderHistoryWrapper username={username} />);

    await waitFor(() => {
      expect(getOrderHistory).toHaveBeenCalledWith(username);
    });

    expect(getByText('Order History (0)')).toBeInTheDocument();
    expect(getByText('There was an error retrieving order history for the user')).toBeInTheDocument();
  });
});
