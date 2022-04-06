import React from 'react';
import { mount } from 'enzyme';
import * as api from './data/api';
import enterpriseCustomerUsersData from './data/test/enterpriseCustomerUsers';
import EnterpriseAssociations from './EnterpriseAssociations';
import { waitForComponentToPaint } from '../setupTest';

describe('<EnterpriseAssociations />', () => {
  const props = {
    username: 'edX',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWrapper = async () => {
    const wrapper = mount(<EnterpriseAssociations {...props} />);
    await waitForComponentToPaint(wrapper);

    return wrapper;
  };

  it('fetches enterprise customer users', async () => {
    const mockGetEnterpriseCustomerUsers = jest.spyOn(api, 'getEnterpriseCustomerUsers').mockImplementationOnce(() => Promise.resolve(enterpriseCustomerUsersData));
    await renderWrapper();

    expect(mockGetEnterpriseCustomerUsers).toHaveBeenCalledTimes(1);
    expect(mockGetEnterpriseCustomerUsers).toHaveBeenCalledWith(props.username);
  });

  it('renders alert if an error occured', async () => {
    const mockGetEnterpriseCustomerUsers = jest.spyOn(api, 'getEnterpriseCustomerUsers').mockImplementationOnce(() => Promise.reject(Error('ba')));
    const wrapper = await renderWrapper();

    expect(mockGetEnterpriseCustomerUsers).toHaveBeenCalledTimes(1);
    expect(mockGetEnterpriseCustomerUsers).toHaveBeenCalledWith(props.username);

    const alert = wrapper.find('.alert');
    expect(alert).toHaveLength(1);
    expect(alert.text()).toEqual('Failed to retrieve enterprise associations.');
  });

  it('renders enterprise associations', async () => {
    jest.spyOn(api, 'getEnterpriseCustomerUsers').mockImplementationOnce(() => Promise.resolve(enterpriseCustomerUsersData));
    const wrapper = await renderWrapper();

    const dataRows = wrapper.find('tr');
    // first row is the headers
    expect(dataRows.length).toEqual(enterpriseCustomerUsersData.length + 1);
  });
});
