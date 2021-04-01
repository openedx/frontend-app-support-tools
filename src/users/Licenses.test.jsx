import { mount } from 'enzyme';
import React from 'react';

import Licenses from './Licenses';
import licensesData from './data/test/licenses';
import UserMessagesProvider from '../user-messages/UserMessagesProvider';

const LicensesPageWrapper = (props) => (
  <UserMessagesProvider>
    <Licenses {...props} />
  </UserMessagesProvider>
);

describe('User Licenses Listing', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<LicensesPageWrapper {...licensesData} />);
  });

  it('default collapsible with enrollment data', () => {
    const collapsible = wrapper.find('CollapsibleAdvanced').find('.collapsible-trigger').hostNodes();
    expect(collapsible.text()).toEqual('Licenses (2)');
  });

  it('No License Data', () => {
    const licenseData = { ...licensesData, data: [], status: 'No record found' };
    wrapper = mount(<Licenses {...licenseData} />);
    const collapsible = wrapper.find('CollapsibleAdvanced').find('.collapsible-trigger').hostNodes();
    expect(collapsible.text()).toEqual('Licenses (0)Fetch Status: No record found');
  });

  it('Sorting Columns Button Enabled by default', () => {
    const dataTable = wrapper.find('table.table');
    const tableHeaders = dataTable.find('thead tr th');

    tableHeaders.forEach(header => {
      const sortButton = header.find('button.btn-header');
      expect(sortButton.disabled).toBeFalsy();
    });
  });

  it('Table Header Lenght', () => {
    const dataTable = wrapper.find('table.table');
    const tableHeaders = dataTable.find('thead tr th');
    expect(tableHeaders).toHaveLength(Object.keys(licensesData.data[0]).length);
  });
});
