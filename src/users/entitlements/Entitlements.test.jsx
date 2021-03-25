import React from 'react';
import { mount } from 'enzyme';

import { waitForComponentToPaint } from '../../setupTest';
import Entitlements from './Entitlements';
import entitlementsData from '../data/test/entitlements';
import CourseSummaryData from '../data/test/courseSummary';
import UserMessageProvider from '../../user-messages/UserMessagesProvider';
import * as api from '../data/api';

const EntitlementsPageWrapper = (props) => (
  <UserMessageProvider>
    <Entitlements {...props} />
  </UserMessageProvider>
);

describe('Entitlements Listing', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<EntitlementsPageWrapper {...entitlementsData} />);
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

  it('No entitlements data', () => {
    wrapper = mount(<EntitlementsPageWrapper {...entitlementsData} data={null} />);
    const collapsible = wrapper.find('CollapsibleAdvanced').find('.collapsible-trigger').hostNodes();
    expect(collapsible.text()).toEqual('Entitlements (0)');
  });

  describe('Expire and Reissue entitlement buttons', () => {
    describe('Expire Entitlement button', () => {
      it('Disabled Expire entitlement button', () => {
        const tableData = wrapper.find('table.table');
        tableData.find('tbody tr').forEach(row => {
          const expireButton = row.find('button.btn-outline-danger');

          expect(expireButton.text()).toEqual('Expire');
          expect(expireButton.prop('disabled')).toBeTruthy();
        });
      });

      it('Enabled Expire entitlement button', () => {
        let data = [...entitlementsData.data.results];
        data = data.map(item => (
          {
            ...item,
            expiredAt: null,
          }
        ));
        wrapper = mount(<EntitlementsPageWrapper {...entitlementsData} data={{ results: data }} />);
        const tableData = wrapper.find('table.table');
        tableData.find('tbody tr').forEach(row => {
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
    });

    describe('Reissue entitlement button', () => {
      it('Disabled Reissue entitlement button', () => {
        let data = [...entitlementsData.data.results];
        data = data.map(item => (
          {
            ...item,
            enrollmentCourseRun: null,
          }
        ));
        wrapper = mount(<EntitlementsPageWrapper {...entitlementsData} data={{ results: data }} />);
        const tableData = wrapper.find('table.table');

        tableData.find('tbody tr').forEach(row => {
          const reissueButton = row.find('button.btn-outline-primary').last();
          expect(reissueButton.text()).toEqual('Reissue');
          expect(reissueButton.prop('disabled')).toBeTruthy();
        });
      });
      it('Enabled Reissue entitlement button', () => {
        const tableData = wrapper.find('table.table');
        tableData.find('tbody tr').forEach((row) => {
          const reissueButton = row.find('button.btn-outline-primary').last();

          expect(reissueButton.text()).toEqual('Reissue');
          expect(reissueButton.prop('disabled')).toBeFalsy();
          reissueButton.simulate('click');

          const reissueEntitlementForm = wrapper.find('ReissueEntitlementForm');
          expect(reissueEntitlementForm.html()).toEqual(expect.stringContaining('Reissue Entitlement'));
          reissueEntitlementForm.find('button.btn-outline-secondary').simulate('click');
          expect(wrapper.find('ReissueEntitlementForm')).toEqual({});
        });
      });
    });
  });

  describe('Course Summary button', () => {
    beforeEach(() => {
      // Having only one element in the table to avoid unexpected behavior on async operations per row
      const data = [entitlementsData.data.results[0]];
      wrapper = mount(<EntitlementsPageWrapper {...entitlementsData} data={{ results: data }} />);
    });

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
