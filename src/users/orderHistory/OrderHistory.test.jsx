import React from 'react';
import {
  render, waitFor, fireEvent, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import OrderHistory from './OrderHistory';
import { getOrderHistory } from '../data/api';
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
    render(<IntlProvider locale="en"><OrderHistoryWrapper username={username} /></IntlProvider>);
    await waitFor(() => {
      expect(getOrderHistory).toHaveBeenCalledWith(username);
    });
    expect(await screen.findByText('Order History (1)')).toBeInTheDocument();
    expect(screen.getByText('Order Status')).toBeInTheDocument();
    expect(screen.getByText('Order Number')).toBeInTheDocument();
    expect(screen.getByText('Date Placed')).toBeInTheDocument();
    expect(screen.getByText('Product Tracking')).toBeInTheDocument();
    const expandAllLink = screen.getByText('Expand All');
    expect(screen.getByText('Expand All')).toBeInTheDocument();
    fireEvent.click(expandAllLink);
    expect(screen.getAllByText('completed')[0]).toBeInTheDocument();
    expect(screen.getAllByText('completed')[1]).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText('Jun 12, 2023 12:00 AM')).toBeInTheDocument();
    expect(screen.getByText('tracking123')).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Type A')).toBeInTheDocument();
  });

  it('should render loading indicator while fetching data', async () => {
    getOrderHistory.mockImplementation(() => Promise.resolve([]));
    render(<OrderHistoryWrapper username={username} />);
    await waitFor(() => {
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });
  });

  it('should handle empty order history data', async () => {
    getOrderHistory.mockImplementation(() => Promise.resolve([]));
    render(<OrderHistoryWrapper username={username} />);
    await waitFor(() => {
      expect(getOrderHistory).toHaveBeenCalledWith(username);
      expect(screen.getByText('Order History (0)')).toBeInTheDocument();
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
    render(<OrderHistoryWrapper username={username} />);
    expect(getOrderHistory).toHaveBeenCalledWith(username);
    await waitFor(() => {
      expect(screen.getByText('Order History (0)')).toBeInTheDocument();
      expect(screen.getByText('There was an error retrieving order history for the user')).toBeInTheDocument();
    });
  });
});
