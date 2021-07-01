import { mount } from 'enzyme';
import React from 'react';
import { waitForComponentToPaint } from '../../setupTest';
import * as api from '../data/api';
import Licenses from './Licenses';
import licensesData from '../data/test/licenses';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';

const LicensesPageWrapper = (props) => (
  <UserMessagesProvider>
    <Licenses {...props} />
  </UserMessagesProvider>
);

describe('User Licenses Listing', () => {
  let wrapper;
  const props = {
    userEmail: 'test@example.com',
    expanded: true,
  };

  afterEach(() => {
    wrapper.unmount();
  });

  it('License Data Loading', async () => {
    const licenseData = { ...licensesData, results: [], status: 'No record found' };
    jest.spyOn(api, 'getLicense').mockImplementationOnce(() => Promise.resolve(licenseData));

    wrapper = mount(<LicensesPageWrapper {...props} />);
    const collapsible = wrapper.find('CollapsibleAdvanced').find('.collapsible-trigger').hostNodes();
    expect(collapsible.text()).toEqual('Licenses (0)Fetch Status: Loading...');
  });

  it('No License Data', async () => {
    const licenseData = { ...licensesData, results: [], status: 'No record found' };
    jest.spyOn(api, 'getLicense').mockImplementationOnce(() => Promise.resolve(licenseData));

    wrapper = mount(<LicensesPageWrapper {...props} />);
    await waitForComponentToPaint(wrapper);

    const collapsible = wrapper.find('CollapsibleAdvanced').find('.collapsible-trigger').hostNodes();
    expect(collapsible.text()).toEqual('Licenses (0)Fetch Status: No record found');
  });

  beforeEach(async () => {
    jest.spyOn(api, 'getLicense').mockImplementationOnce(() => Promise.resolve(licensesData));
    wrapper = mount(<LicensesPageWrapper {...props} />);
    await waitForComponentToPaint(wrapper);
  });

  it('default collapsible with enrollment data', () => {
    const collapsible = wrapper.find('CollapsibleAdvanced').find('.collapsible-trigger').hostNodes();
    expect(collapsible.text()).toEqual('Licenses (2)');
  });

  it('Sorting Columns Button Enabled by default', () => {
    const dataTable = wrapper.find('table.table');
    const tableHeaders = dataTable.find('thead tr th');

    tableHeaders.forEach(header => {
      const sortButton = header.find('button.btn-header');
      expect(sortButton.disabled).toBeFalsy();
    });
  });

  it('Sorting Columns Button work correctly', () => {
    const dataTable = wrapper.find('table.table');
    const tableHeaders = dataTable.find('thead tr th');

    tableHeaders.forEach(header => {
      const sortButton = header.find('button.btn-header');
      sortButton.simulate('click');
      expect(wrapper.find('svg.fa-sort-down')).toHaveLength(1);
      sortButton.simulate('click');
      expect(wrapper.find('svg.fa-sort-up')).toHaveLength(1);
    });
  });

  it('Table Header Lenght', () => {
    const dataTable = wrapper.find('table.table');
    const tableHeaders = dataTable.find('thead tr th');
    expect(tableHeaders).toHaveLength(Object.keys(licensesData.results[0]).length);
  });
});
