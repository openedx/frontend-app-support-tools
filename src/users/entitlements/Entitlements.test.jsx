import React from 'react';
import { mount } from 'enzyme';

import { waitForComponentToPaint } from '../../setupTest';
import Entitlements from './Entitlements';
import { entitlementsData, entitlementsErrors } from '../data/test/entitlements';
import CourseSummaryData from '../data/test/courseSummary';
import UserMessageProvider from '../../userMessages/UserMessagesProvider';
import * as api from '../data/api';

const EntitlementsPageWrapper = (props) => (
  <UserMessageProvider>
    <Entitlements {...props} />
  </UserMessageProvider>
);

describe('Entitlements Listing', () => {
  let wrapper;
  const props = {
    user: 'edX',
    expanded: true,
    changeHandler: jest.fn(() => {}),
  };

  beforeEach(async () => {
    jest.spyOn(api, 'getEntitlements').mockImplementationOnce(() => Promise.resolve(entitlementsData));
    wrapper = mount(<EntitlementsPageWrapper {...props} />);
    await waitForComponentToPaint(wrapper);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('Create New Entitlement button rendered by default', () => {
    const entitlementButton = wrapper.find('button.btn-outline-primary').first();
    expect(entitlementButton.text()).toEqual('Create New Entitlement');
    expect(entitlementButton.prop('disabled')).toBeFalsy();
    entitlementButton.simulate('click');

    const createEntitlementForm = wrapper.find('CreateEntitlementForm');
    expect(createEntitlementForm.html()).toEqual(expect.stringContaining('Create Entitlement'));
    createEntitlementForm.find('button.btn-outline-secondary').simulate('click');
    expect(wrapper.find('CreateEntitlementForm')).toEqual({});
  });

  it('default collapsible with entitlements data', () => {
    const collapsible = wrapper.find('CollapsibleAdvanced').find('.collapsible-trigger').hostNodes();
    expect(collapsible.text()).toEqual('Entitlements (2)');
  });

  it('No entitlements data', async () => {
    jest.spyOn(api, 'getEntitlements').mockImplementationOnce(() => Promise.resolve({ results: [] }));
    wrapper = mount(<EntitlementsPageWrapper {...props} />);
    await waitForComponentToPaint(wrapper);
    const collapsible = wrapper.find('CollapsibleAdvanced').find('.collapsible-trigger').hostNodes();
    expect(collapsible.text()).toEqual('Entitlements (0)');
  });

  it('Error fetching entitlements', async () => {
    jest.spyOn(api, 'getEntitlements').mockImplementationOnce(() => Promise.resolve(entitlementsErrors));
    wrapper = mount(<EntitlementsPageWrapper {...props} />);
    await waitForComponentToPaint(wrapper);

    const alert = wrapper.find('div.alert');
    console.log(alert);
    expect(alert.test).toEqual(entitlementsErrors.errors.text);
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
    const dataTable = wrapper.find('table.table').hostNodes();
    const sortButtons = dataTable.find('thead tr th button.btn-header');

    sortButtons.forEach(sortButton => {
      sortButton.simulate('click');
      expect(wrapper.find('svg.fa-sort-down')).toHaveLength(1);
      sortButton.simulate('click');
      expect(wrapper.find('svg.fa-sort-up')).toHaveLength(1);
    });
  });

  it('Support Details data', () => {
    const tableRowsLengths = [2, 0];

    const tableData = wrapper.find('table.table');
    tableData.find('tbody tr').forEach((row, i) => {
      const detailButton = row.find('button#details');
      expect(detailButton.text()).toEqual('Details');
      let supportDetailsModal = wrapper.find('Modal#support-details');
      expect(supportDetailsModal.prop('open')).toEqual(false);
      detailButton.simulate('click');

      supportDetailsModal = wrapper.find('Modal#support-details');
      expect(supportDetailsModal.prop('open')).toEqual(true);
      expect(supportDetailsModal.prop('title')).toEqual('Entitlement Support Details');
      expect(supportDetailsModal.find('table thead tr th')).toHaveLength(5);
      expect(supportDetailsModal.find('table tbody tr')).toHaveLength(tableRowsLengths[i]);
      supportDetailsModal.find('button.btn-link').simulate('click');

      supportDetailsModal = wrapper.find('Modal#support-details');
      expect(supportDetailsModal.prop('open')).toEqual(false);
    });
  });

  describe('Expire Entitlement button', () => {
    it('Disabled Expire entitlement button', () => {
      const tableData = wrapper.find('table.table');
      // We're only checking row 0 of the table since it has the button Expire Button disabled
      const row = tableData.find('tbody tr').at(0);
      const expireButton = row.find('button.btn-outline-danger');

      expect(expireButton.text()).toEqual('Expire');
      expect(expireButton.prop('disabled')).toBeTruthy();
    });

    it('Enabled Expire entitlement button', () => {
      const tableData = wrapper.find('table.table');
      // We're only checking row 1 of the table since the expire button is not disabled
      const row = tableData.find('tbody tr').at(1);
      const expireButton = row.find('button.btn-outline-danger');

      expect(expireButton.text()).toEqual('Expire');
      expect(expireButton.prop('disabled')).toBeFalsy();
      expireButton.simulate('click');

      const expireEntitlementForm = wrapper.find('ExpireEntitlementForm');
      expect(expireEntitlementForm.html()).toEqual(expect.stringContaining('Expire Entitlement'));
      expireEntitlementForm.find('button.btn-outline-secondary').simulate('click');
      expect(wrapper.find('ExpireEntitlementForm')).toEqual({});
    });
  });

  describe('Reissue entitlement button', () => {
    it('Enabled Reissue entitlement button', () => {
      const tableData = wrapper.find('table.table');
      // We're only checking row 0 of the table since the Reissue button is not disabled
      const row = tableData.find('tbody tr').at(0);
      const reissueButton = row.find('button#reissue').last();

      expect(reissueButton.text()).toEqual('Reissue');
      expect(reissueButton.prop('disabled')).toBeFalsy();
      reissueButton.simulate('click');

      const reissueEntitlementForm = wrapper.find('ReissueEntitlementForm');
      expect(reissueEntitlementForm.html()).toEqual(expect.stringContaining('Reissue Entitlement'));
      reissueEntitlementForm.find('button.btn-outline-secondary').simulate('click');
      expect(wrapper.find('ReissueEntitlementForm')).toEqual({});
    });
    it('Disabled Reissue entitlement button', () => {
      const tableData = wrapper.find('table.table');
      // We're only checking row 1 of the table since it has the button Reissue Button disabled
      const row = tableData.find('tbody tr').at(1);
      const reissueButton = row.find('button#reissue').last();
      expect(reissueButton.text()).toEqual('Reissue');
      expect(reissueButton.prop('disabled')).toBeTruthy();
    });
  });

  describe('Course Summary button', () => {
    it('Successful course summary fetch', async () => {
      const apiMock = jest.spyOn(api, 'getCourseData').mockImplementationOnce(() => Promise.resolve(CourseSummaryData.courseData));
      const row = wrapper.find('table.table').find('tbody tr').first();
      const courseUuidButton = row.find('button.btn-outline-primary').first();
      expect(courseUuidButton.prop('disabled')).toBeFalsy();

      courseUuidButton.simulate('click');

      expect(apiMock).toHaveBeenCalledTimes(1);
      await waitForComponentToPaint(wrapper);

      const courseSummary = wrapper.find('CourseSummary');
      expect(courseSummary).not.toBeUndefined();
      expect(courseSummary.html()).toEqual(expect.stringContaining(CourseSummaryData.courseData.uuid));
      apiMock.mockReset();
    });

    it('Unsuccessful course summary fetch', async () => {
      const apiMock = jest.spyOn(api, 'getCourseData').mockImplementationOnce(() => Promise.resolve({
        errors: [
          {
            code: null,
            dismissible: true,
            text: "We couldn't find summary data for this Course.",
            type: 'error',
            topic: 'course-summary',
          },
        ],
      }));
      const row = wrapper.find('table.table').find('tbody tr').first();
      const courseUuidButton = row.find('button.btn-outline-primary').first();
      expect(courseUuidButton.prop('disabled')).toBeFalsy();

      courseUuidButton.simulate('click');

      expect(apiMock).toHaveBeenCalledTimes(1);
      await waitForComponentToPaint(wrapper);
      const alert = wrapper.find('CourseSummary').find('.alert');
      expect(alert.text()).toEqual("We couldn't find summary data for this Course.");
      apiMock.mockReset();
    });
  });
});
