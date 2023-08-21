import React from 'react';
import {
  render, waitFor, act, fireEvent,
} from '@testing-library/react';
import OrderHistory from './OrderHistory';
import { getOrderHistory } from '../data/api';
import '@testing-library/jest-dom/extend-expect';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';

jest.mock('../data/api');

const OrderHistoryWrapper = (props) => (
  <UserMessagesProvider>
    <OrderHistory {...props} />
  </UserMessagesProvider>
);

describe('OrderHistory', () => {
  const username = 'testuser';

  afterEach(() => {
    jest.resetAllMocks();
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
              attributeValues: [
                { value: 'Type A' },
              ],
            },
            quantity: 1,
            status: 'completed',
          },
        ],
      },
    ];

    getOrderHistory.mockImplementation(() => Promise.resolve(orderHistoryData));

    await act(async () => {
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

      const expandAllLink = getByText('Expand All');
      fireEvent.click(expandAllLink);

      expect(getAllByText('completed')[0]).toBeInTheDocument();
      expect(getAllByText('completed')[1]).toBeInTheDocument();
      expect(getByText('12345')).toBeInTheDocument();
      expect(getByText('Jun 12, 2023 12:00 AM')).toBeInTheDocument();
      expect(getByText('tracking123')).toBeInTheDocument();
      expect(getByText('Product 1')).toBeInTheDocument();
      expect(getByText('Type A')).toBeInTheDocument();
    });
  });

  it('should render loading indicator while fetching data', async () => {
    getOrderHistory.mockImplementation(() => Promise.resolve([]));

    await act(async () => {
      const { getByText } = render(<OrderHistoryWrapper username={username} />);

      expect(getByText('Loading')).toBeInTheDocument();
    });
  });

  it('should handle empty order history data', async () => {
    getOrderHistory.mockImplementation(() => Promise.resolve([]));

    await act(async () => {
      const { getByText } = render(<OrderHistoryWrapper username={username} />);

      await waitFor(() => {
        expect(getOrderHistory).toHaveBeenCalledWith(username);
      });

      expect(getByText('Order History (0)')).toBeInTheDocument();
    });
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

    getOrderHistory.mockImplementation(() => Promise.resolve(mockErrors));

    await act(async () => {
      const { getByText } = render(<OrderHistoryWrapper username={username} />);

      await waitFor(() => {
        expect(getOrderHistory).toHaveBeenCalledWith(username);
      });

      expect(getByText('Order History (0)')).toBeInTheDocument();
      expect(getByText('There was an error retrieving order history for the user')).toBeInTheDocument();
    });
  });
});
