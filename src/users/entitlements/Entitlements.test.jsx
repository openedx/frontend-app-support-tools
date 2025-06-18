import React from 'react';
import { mount } from 'enzyme';
import { waitFor } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import Entitlements from './Entitlements';
import { entitlementsData, entitlementsErrors } from '../data/test/entitlements';
import CourseSummaryData from '../data/test/courseSummary';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from '../data/api';

const EntitlementsPageWrapper = (props) => (
  <IntlProvider locale="en">
    <UserMessagesProvider>
      <Entitlements {...props} />
    </UserMessagesProvider>
  </IntlProvider>
);

jest.mock('@edx/frontend-platform', () => ({
  ...jest.requireActual('@edx/frontend-platform'),
  getConfig: jest.fn(() => ({
    ECOMMERCE_BASE_URL: 'http://example.com',
  })),
}));

describe('Entitlements Listing', () => {
  let apiMock;
  let wrapper;
  const props = {
    user: 'edX',
    changeHandler: jest.fn(() => {}),
  };

  beforeEach(async () => {
    apiMock = jest.spyOn(api, 'getEntitlements').mockImplementationOnce(() => Promise.resolve(entitlementsData));
    wrapper = mount(<EntitlementsPageWrapper {...props} />);
  });

  afterEach(() => {
    apiMock.mockReset();
    wrapper.unmount();
  });

  it('Create New Entitlement button rendered by default', () => {
    const entitlementButton = wrapper.find('button.btn-outline-primary').first();
    expect(entitlementButton.text()).toEqual('Create New Entitlement');
    expect(entitlementButton.prop('disabled')).toBeFalsy();
    entitlementButton.simulate('click');

    let createFormModal = wrapper.find('ModalDialog#create-entitlement');
    expect(createFormModal.prop('isOpen')).toEqual(true);
    expect(createFormModal.html()).toEqual(expect.stringContaining('Create New Entitlement'));
    wrapper.find('button.btn-link').simulate('click');
    createFormModal = wrapper.find('ModalDialog#create-entitlement');
    expect(createFormModal.prop('isOpen')).toEqual(false);
  });

  it('entitlements data', () => {
    const componentHeader = wrapper.find('h3');
    expect(componentHeader.text()).toEqual('Entitlements (2)');
  });

  it('No entitlements data', async () => {
    jest.spyOn(api, 'getEntitlements').mockImplementationOnce(() => Promise.resolve({ results: [] }));
    wrapper = mount(<EntitlementsPageWrapper {...props} />);
    const componentHeader = wrapper.find('h3');
    expect(componentHeader.text()).toEqual('Entitlements (0)');
  });

  it('Error fetching entitlements', async () => {
    jest.spyOn(api, 'getEntitlements').mockImplementationOnce(() => Promise.resolve(entitlementsErrors));
    wrapper = mount(<EntitlementsPageWrapper {...props} />);

    const alert = wrapper.find('div.alert');
    waitFor(() => expect(alert.text()).toEqual(entitlementsErrors.errors[0].text));
  });

  it('Support Details data', () => {
    let expandable = wrapper.find('table tbody tr').at(0).find('td div span').at(0);
    waitFor(() => {
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
  });

  it('Expand All and Collapse All', () => {
    let expandAll = wrapper.find('table thead tr th a.link-primary');
    waitFor(() => {
      expect(expandAll.text()).toEqual('Expand All');
      expandAll.simulate('click');

      expandAll = wrapper.find('table thead tr th a.link-primary');
      expect(expandAll.text()).toEqual('Collapse All');
      expandAll.simulate('click');

      expandAll = wrapper.find('table thead tr th a.link-primary');
      expect(expandAll.text()).toEqual('Expand All');
    });
  });

  it('Filter entitlements on the basis of searchStr', async () => {
    apiMock = jest.spyOn(api, 'getEntitlements').mockImplementationOnce(() => Promise.resolve(entitlementsData));
    wrapper = mount(<EntitlementsPageWrapper searchStr="course-1" {...props} />);
    const componentHeader = wrapper.find('h3');
    waitFor(() => expect(componentHeader.text()).toEqual('Entitlements (1)'));
  });

  it('Renders correct href for Order Number', async () => {
    expect(/http:\/\/example.com\/dashboard\/orders\/123edX456789/.test(wrapper.html())).toBeTruthy();
  });

  describe('Expire Entitlement button', () => {
    it('Disabled Expire entitlement button', async () => {
      // We're only checking row 0 of the table since it has the button Expire Button disabled
      let dataRow = wrapper.find('table tbody tr').at(0);
      waitFor(() => {
        dataRow.find('.dropdown button').simulate('click');
        dataRow = wrapper.find('table tbody tr').at(0);
        const expireOption = dataRow.find('.dropdown-menu.show a').at(1);
        expect(expireOption.text()).toEqual('Expire');
        expect(expireOption.html()).toEqual(expect.stringContaining('disabled'));
      });
    });

    it('Enabled Expire entitlement button', async () => {
      // We're only checking row 1 of the table since the expire button is not disabled
      let dataRow = wrapper.find('table tbody tr').at(1);
      waitFor(() => {
        dataRow.find('.dropdown button').simulate('click');
        dataRow = wrapper.find('table tbody tr').at(1);
        const expireOption = dataRow.find('.dropdown-menu.show a').at(1);
        expect(expireOption.text()).toEqual('Expire');
        expect(expireOption.html()).not.toEqual(expect.stringContaining('disabled'));
        expireOption.simulate('click');

        let expireFormModal = wrapper.find('ModalDialog#expire-entitlement');
        expect(expireFormModal.prop('isOpen')).toEqual(true);
        expect(expireFormModal.html()).toEqual(expect.stringContaining('Expire Entitlement'));
        wrapper.find('button.btn-link').simulate('click');
        expireFormModal = wrapper.find('ModalDialog#expire-entitlement');
        expect(expireFormModal.prop('isOpen')).toEqual(false);
      });
    });
  });

  describe('Reissue entitlement button', () => {
    it('Enabled Reissue entitlement button', async () => {
      // We're only checking row 0 of the table since the Reissue button is not disabled
      let dataRow = wrapper.find('table tbody tr').at(0);
      waitFor(() => {
        dataRow.find('.dropdown button').simulate('click');
        dataRow = wrapper.find('table tbody tr').at(0);
        const expireOption = dataRow.find('.dropdown-menu.show a').at(0);
        expect(expireOption.text()).toEqual('Reissue');
        expect(expireOption.html()).not.toEqual(expect.stringContaining('disabled'));
        expireOption.simulate('click');

        let reissueFormModal = wrapper.find('ModalDialog#reissue-entitlement');
        expect(reissueFormModal.prop('isOpen')).toEqual(true);
        expect(reissueFormModal.html()).toEqual(expect.stringContaining('Reissue Entitlement'));
        wrapper.find('button.btn-link').simulate('click');
        reissueFormModal = wrapper.find('ModalDialog#reissue-entitlement');
        expect(reissueFormModal.prop('isOpen')).toEqual(false);
      });
    });

    it('Disabled Reissue entitlement button', async () => {
      // We're only checking row 1 of the table since it has the button Reissue Button disabled
      let dataRow = wrapper.find('table tbody tr').at(1);
      waitFor(() => {
        dataRow.find('.dropdown button').simulate('click');
        dataRow = wrapper.find('table tbody tr').at(1);
        const expireOption = dataRow.find('.dropdown-menu.show a').at(0);
        expect(expireOption.text()).toEqual('Reissue');
        expect(expireOption.html()).toEqual(expect.stringContaining('disabled'));
      });
    });
  });

  describe('Course Summary button', () => {
    it('Successful course summary fetch', async () => {
      apiMock = jest.spyOn(api, 'getCourseData').mockImplementationOnce(() => Promise.resolve(CourseSummaryData.courseData));

      const dataRow = wrapper.find('table tbody tr').at(0);
      const courseUuidButton = dataRow.find('td').at(3).find('a');

      waitFor(() => {
        courseUuidButton.simulate('click');

        expect(apiMock).toHaveBeenCalledTimes(1);

        let courseSummary = wrapper.find('CourseSummary');
        expect(courseSummary).not.toBeUndefined();
        expect(courseSummary.html()).toEqual(expect.stringContaining(CourseSummaryData.courseData.uuid));
        courseSummary.find('button.btn-link').simulate('click');
        courseSummary = wrapper.find('CourseSummary');
        expect(courseSummary).toEqual({});
      });
    });

    it('Unsuccessful course summary fetch', async () => {
      apiMock = jest.spyOn(api, 'getCourseData').mockImplementationOnce(() => Promise.resolve({
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

      waitFor(() => {
        courseUuidButton.simulate('click');

        expect(apiMock).toHaveBeenCalledTimes(1);

        const alert = wrapper.find('CourseSummary').find('.alert');
        expect(alert.text()).toEqual("We couldn't find summary data for this Course.");
      });
    });
  });
});
