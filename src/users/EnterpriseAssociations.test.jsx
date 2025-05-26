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

  const renderWrapper = async () => {
    const { container } = render(<EnterpriseAssociations {...props} />);
    return container;
  };

  it('fetches enterprise customer users', async () => {
    const mockGetEnterpriseCustomerUsers = jest.spyOn(api, 'getEnterpriseCustomerUsers').mockImplementationOnce(() => Promise.resolve(enterpriseCustomerUsersData));
    await renderWrapper();

    expect(mockGetEnterpriseCustomerUsers).toHaveBeenCalledTimes(1);
    expect(mockGetEnterpriseCustomerUsers).toHaveBeenCalledWith(props.username);
  });

  it('renders alert if an error occured', async () => {
    const mockGetEnterpriseCustomerUsers = jest.spyOn(api, 'getEnterpriseCustomerUsers').mockImplementationOnce(() => Promise.reject(Error('ba')));
    await renderWrapper();

    expect(mockGetEnterpriseCustomerUsers).toHaveBeenCalledTimes(1);
    expect(mockGetEnterpriseCustomerUsers).toHaveBeenCalledWith(props.username);

    const alert = await screen.findByTestId('enterpriseAssociationAlert');
    waitFor(() => {
      expect(alert).toHaveLength(1);
      expect(alert.textContent).toEqual('Failed to retrieve enterprise associations.');
    });
  });

  it('renders enterprise associations', async () => {
    jest.spyOn(api, 'getEnterpriseCustomerUsers').mockImplementationOnce(() => Promise.resolve(enterpriseCustomerUsersData));
    const container = await renderWrapper();

    const dataRows = container.querySelectorAll('tr');
    // first row is the headers
    waitFor(() => expect(dataRows.length).toEqual(enterpriseCustomerUsersData.length + 1));
  });
});
