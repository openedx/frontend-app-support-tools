import React from 'react';
import { mount } from 'enzyme';

import { waitForComponentToPaint } from '../../../setupTest';
import EntitlementsV2 from './Entitlements';
import { entitlementsData, entitlementsErrors } from '../../data/test/entitlements';
import CourseSummaryData from '../../data/test/courseSummary';
import UserMessagesProvider from '../../../userMessages/UserMessagesProvider';
import * as api from '../../data/api';

const EntitlementsPageWrapper = (props) => (
  <UserMessagesProvider>
    <EntitlementsV2 {...props} />
  </UserMessagesProvider>
);

describe('Entitlements V2 Listing', () => {
  let wrapper;
  const props = {
    user: 'edX',
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

  it('entitlements data', () => {
    const componentHeader = wrapper.find('h3');
    expect(componentHeader.text()).toEqual('Entitlements (2)');
  });

  it('No entitlements data', async () => {
    jest.spyOn(api, 'getEntitlements').mockImplementationOnce(() => Promise.resolve({ results: [] }));
    wrapper = mount(<EntitlementsPageWrapper {...props} />);
    await waitForComponentToPaint(wrapper);
    const componentHeader = wrapper.find('h3');
    expect(componentHeader.text()).toEqual('Entitlements (0)');
  });

  it('Error fetching entitlements', async () => {
    jest.spyOn(api, 'getEntitlements').mockImplementationOnce(() => Promise.resolve(entitlementsErrors));
    wrapper = mount(<EntitlementsPageWrapper {...props} />);
    await waitForComponentToPaint(wrapper);

    const alert = wrapper.find('div.alert');
    expect(alert.text()).toEqual(entitlementsErrors.errors[0].text);
  });

  it('Support Details data', () => {
    let expandable = wrapper.find('table tbody tr').at(0).find('td div span').at(0);
    expect(expandable.html()).toContain('fa-plus');
    expandable.simulate('click');

    expandable = wrapper.find('table tbody tr').at(0).find('td div span').at(0);
    expect(expandable.html()).toContain('fa-minus');

    const extraTable = wrapper.find('table tbody tr').at(1).find('table');
    expect(extraTable.find('thead tr th').length).toEqual(5);
    expect(extraTable.find('tbody tr').length).toEqual(2);

    expandable.simulate('click');

    expandable = wrapper.find('table tbody tr').at(0).find('td div span').at(0);
    expect(expandable.html()).toContain('fa-plus');
  });

  describe('Reissue entitlement button', () => {
    it('Enabled Reissue entitlement button', () => {
      // We're only checking row 0 of the table since the Reissue button is not disabled
      let dataRow = wrapper.find('table tbody tr').at(0);
      dataRow.find('.dropdown button').simulate('click');
      dataRow = wrapper.find('table tbody tr').at(0);
      const expireOption = dataRow.find('.dropdown-menu.show a').at(0);
      expect(expireOption.text()).toEqual('Reissue');
      expect(expireOption.html()).not.toEqual(expect.stringContaining('disabled'));
      expireOption.simulate('click');

      const expireEntitlementForm = wrapper.find('ReissueEntitlementForm');
      expect(expireEntitlementForm.html()).toEqual(expect.stringContaining('Reissue Entitlement'));
      expireEntitlementForm.find('button.btn-outline-secondary').simulate('click');
      expect(wrapper.find('ExpireEntitlementForm')).toEqual({});
    });

    it('Disabled Reissue entitlement button', () => {
      // We're only checking row 1 of the table since it has the button Reissue Button disabled
      let dataRow = wrapper.find('table tbody tr').at(1);
      dataRow.find('.dropdown button').simulate('click');
      dataRow = wrapper.find('table tbody tr').at(1);
      const expireOption = dataRow.find('.dropdown-menu.show a').at(0);
      expect(expireOption.text()).toEqual('Reissue');
      expect(expireOption.html()).toEqual(expect.stringContaining('disabled'));
    });
  });

  describe('Expire Entitlement button', () => {
    it('Disabled Expire entitlement button', () => {
      // We're only checking row 0 of the table since it has the button Expire Button disabled
      let dataRow = wrapper.find('table tbody tr').at(0);
      dataRow.find('.dropdown button').simulate('click');
      dataRow = wrapper.find('table tbody tr').at(0);
      const expireOption = dataRow.find('.dropdown-menu.show a').at(1);
      expect(expireOption.text()).toEqual('Expire');
      expect(expireOption.html()).toEqual(expect.stringContaining('disabled'));
    });

    it('Enabled Expire entitlement button', () => {
      // We're only checking row 1 of the table since the expire button is not disabled
      let dataRow = wrapper.find('table tbody tr').at(1);
      dataRow.find('.dropdown button').simulate('click');
      dataRow = wrapper.find('table tbody tr').at(1);
      const expireOption = dataRow.find('.dropdown-menu.show a').at(1);
      expect(expireOption.text()).toEqual('Expire');
      expect(expireOption.html()).not.toEqual(expect.stringContaining('disabled'));
      expireOption.simulate('click');

      const expireEntitlementForm = wrapper.find('ExpireEntitlementForm');
      expect(expireEntitlementForm.html()).toEqual(expect.stringContaining('Expire Entitlement'));
      expireEntitlementForm.find('button.btn-outline-secondary').simulate('click');
      expect(wrapper.find('ExpireEntitlementForm')).toEqual({});
    });
  });

  describe('Course Summary button', () => {
    it('Successful course summary fetch', async () => {
      const apiMock = jest.spyOn(api, 'getCourseData').mockImplementationOnce(() => Promise.resolve(CourseSummaryData.courseData));

      const dataRow = wrapper.find('table tbody tr').at(0);
      const courseUuidButton = dataRow.find('td').at(3).find('a');
      courseUuidButton.simulate('click');

      expect(apiMock).toHaveBeenCalledTimes(1);
      await waitForComponentToPaint(wrapper);

      let courseSummary = wrapper.find('CourseSummary');
      expect(courseSummary).not.toBeUndefined();
      expect(courseSummary.html()).toEqual(expect.stringContaining(CourseSummaryData.courseData.uuid));
      courseSummary.find('button.btn-outline-secondary').simulate('click');
      courseSummary = wrapper.find('CourseSummary');
      expect(courseSummary).toEqual({});
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

      const dataRow = wrapper.find('table tbody tr').at(0);
      const courseUuidButton = dataRow.find('td').at(3).find('a');
      courseUuidButton.simulate('click');

      expect(apiMock).toHaveBeenCalledTimes(1);
      await waitForComponentToPaint(wrapper);

      const alert = wrapper.find('CourseSummary').find('.alert');
      expect(alert.text()).toEqual("We couldn't find summary data for this Course.");
      apiMock.mockReset();
    });
  });
});
