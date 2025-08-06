import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import * as api from './data/api';
import enterpriseCustomerUsersData from './data/test/enterpriseCustomerUsers';
import EnterpriseAssociations from './EnterpriseAssociations';

describe('<EnterpriseAssociations />', () => {
  const props = {
    username: 'edX',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches enterprise customer users', async () => {
    const mockGetEnterpriseCustomerUsers = jest
      .spyOn(api, 'getEnterpriseCustomerUsers')
      .mockResolvedValueOnce(enterpriseCustomerUsersData);

    render(<EnterpriseAssociations {...props} />);

    await waitFor(() => {
      expect(mockGetEnterpriseCustomerUsers).toHaveBeenCalledTimes(1);
      expect(mockGetEnterpriseCustomerUsers).toHaveBeenCalledWith(props.username);
    });
  });

  it('renders alert if an error occurred', async () => {
    jest
      .spyOn(api, 'getEnterpriseCustomerUsers')
      .mockRejectedValueOnce(new Error('ba'));

    render(<EnterpriseAssociations {...props} />);

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Failed to retrieve enterprise associations.');
  });

  it('renders enterprise associations', async () => {
    jest
      .spyOn(api, 'getEnterpriseCustomerUsers')
      .mockResolvedValueOnce(enterpriseCustomerUsersData);

    render(<EnterpriseAssociations {...props} />);

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows.length).toEqual(enterpriseCustomerUsersData.length + 1); // +1 for header row
    });
  });
});
