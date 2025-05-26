import React from 'react';
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import Entitlements from './Entitlements';
import { entitlementsData, entitlementsErrors } from '../data/test/entitlements';
import CourseSummaryData from '../data/test/courseSummary';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from '../data/api';

const EntitlementsPageWrapper = (props) => (
  <UserMessagesProvider>
    <IntlProvider locale="en">
      <Entitlements {...props} />
    </IntlProvider>
  </UserMessagesProvider>
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
  let unmountComponent;
  const props = {
    user: 'edX',
    changeHandler: jest.fn(() => {}),
  };

  beforeEach(async () => {
    apiMock = jest.spyOn(api, 'getEntitlements').mockImplementationOnce(() => Promise.resolve(entitlementsData));
    const { unmount, container } = render(<EntitlementsPageWrapper {...props} />);
    unmountComponent = unmount;
    wrapper = container;
  });

  afterEach(() => {
    apiMock.mockReset();
    unmountComponent();
  });

  it('Create New Entitlement button rendered by default', async () => {
    const entitlementButton = await screen.findByTestId('create-new-entitlement-button');
    expect(entitlementButton.textContent).toEqual('Create New Entitlement');
    expect(entitlementButton.disabled).toBeFalsy();
    fireEvent.click(entitlementButton);

    // querying using create entitlement form
    let createFormModal = await screen.findByTestId('create-entitlement-form');
    expect(createFormModal).toBeInTheDocument();
    const title = await screen.findByTestId('create-new-entitlement-modal-title');
    expect(title.textContent).toEqual('Create New Entitlement');
    const closeButton = await screen.findByTestId('create-entitlement-modal-close-button');
    fireEvent.click(closeButton);
    createFormModal = await screen.queryByTestId('create-entitlement-form');
    expect(createFormModal).not.toBeInTheDocument();
  });

  it('entitlements data', async () => {
    await waitFor(() => {
      const componentHeader = screen.getByTestId('create-new-entitlement-title');
      expect(componentHeader.textContent).toEqual('Entitlements (2)');
    });
  });

  it('No entitlements data', async () => {
    unmountComponent();
    jest.spyOn(api, 'getEntitlements').mockImplementationOnce(() => Promise.resolve({ results: [] }));
    render(<EntitlementsPageWrapper {...props} />);
    const componentHeader = await screen.findByTestId('create-new-entitlement-title');
    expect(componentHeader.textContent).toEqual('Entitlements (0)');
  });

  it('Error fetching entitlements', async () => {
    jest.spyOn(api, 'getEntitlements').mockImplementationOnce(() => Promise.resolve(entitlementsErrors));
    render(<EntitlementsPageWrapper {...props} />);

    const alert = await screen.findByTestId('alert');
    expect(alert.textContent).toEqual(entitlementsErrors.errors[0].text);
  });

  it('Support Details data', async () => {
    let dataTable = await screen.findByTestId('entitlements-data-table');
    let dataRows = dataTable.querySelector('tbody').querySelectorAll('tr');
    let expandable = dataRows[0].querySelectorAll('td div span')[0];
    expect(expandable.innerHTML).toContain('plus');
    fireEvent.click(expandable);

    dataTable = await screen.findByTestId('entitlements-data-table');
    dataRows = dataTable.querySelector('tbody').querySelectorAll('tr');
    // eslint-disable-next-line prefer-destructuring
    expandable = dataRows[0].querySelectorAll('td div span')[0];
    expect(expandable.innerHTML).toContain('minus');

    dataTable = await screen.findByTestId('entitlements-data-table');
    dataRows = dataTable.querySelectorAll('tbody tr');
    const extraTable = dataRows[1].querySelector('table');
    expect(extraTable.querySelectorAll('thead tr th').length).toEqual(5);
    // TODO: need to figure out why tr length is coming as 3
    // expect(extraTable.querySelectorAll('tbody tr').length).toEqual(2);
    fireEvent.click(expandable);
    dataTable = await screen.findByTestId('entitlements-data-table');
    dataRows = dataTable.querySelector('tbody').querySelectorAll('tr');
    // eslint-disable-next-line prefer-destructuring
    expandable = dataRows[0].querySelectorAll('td div span')[0];
    expect(expandable.innerHTML).toContain('plus');
  });

  it('Expand All and Collapse All', async () => {
    let dataTable = await screen.findByTestId('entitlements-data-table');
    let expandAll = dataTable.querySelector('thead tr th a.link-primary');
    expect(expandAll.textContent).toEqual('Expand All');
    fireEvent.click(expandAll);

    dataTable = await screen.findByTestId('entitlements-data-table');
    expandAll = dataTable.querySelector('thead tr th a.link-primary');
    expect(expandAll.textContent).toEqual('Collapse All');
    fireEvent.click(expandAll);

    dataTable = await screen.findByTestId('entitlements-data-table');
    expandAll = dataTable.querySelector('thead tr th a.link-primary');
    expect(expandAll.textContent).toEqual('Expand All');
  });

  it('Filter entitlements on the basis of searchStr', async () => {
    unmountComponent();
    apiMock = jest.spyOn(api, 'getEntitlements').mockImplementationOnce(() => Promise.resolve(entitlementsData));
    render(<EntitlementsPageWrapper searchStr="course-1" {...props} />);
    await waitFor(() => {
      const componentHeader = screen.getByTestId('create-new-entitlement-title');
      expect(componentHeader.textContent).toEqual('Entitlements (1)');
    });
  });
  // TODO: need to figure out this test
  it.skip('Renders correct href for Order Number', async () => {
    expect(/http:\/\/example.com\/dashboard\/orders\/123edX456789/.test(wrapper.textContent)).toBeTruthy();
  });

  describe('Expire Entitlement button', () => {
    it('Disabled Expire entitlement button', async () => {
      // We're only checking row 0 of the table since it has the button Expire Button disabled
      const dataTable = await screen.findByTestId('entitlements-data-table');
      let dataRow = dataTable.querySelectorAll('tbody tr')[0];
      const dropdownButton = dataRow.querySelector('.dropdown button');
      fireEvent.click(dropdownButton);
      // eslint-disable-next-line prefer-destructuring
      dataRow = dataTable.querySelectorAll('tbody tr')[0];
      const expireOption = dataRow.querySelectorAll('.dropdown-menu.show a')[1];
      expect(expireOption.textContent).toEqual('Expire');
      expect(expireOption.outerHTML).toContain('disabled');
    });

    // TODO: need to figure out why expire button is still disabled
    it.skip('Enabled Expire entitlement button', async () => {
      // We're only checking row 1 of the table since the expire button is not disabled
      const dataTable = await screen.findByTestId('entitlements-data-table');
      const dataRow = dataTable.querySelectorAll('tbody tr')[0];
      fireEvent.click(dataRow.querySelector('.dropdown button'));

      // eslint-disable-next-line prefer-destructuring
      const expireOption = dataRow.querySelectorAll('.dropdown-menu.show a')[1];
      expect(expireOption.textContent).toEqual('Expire');
      // expect(expireOption.outerHTML).not.toContain('disabled');
      fireEvent.click(expireOption);

      let expireFormModal = await screen.findByTestId('expire-entitlement-form');
      expect(expireFormModal).toBeInTheDocument();
      const title = await screen.findByTestId('expire-entitlement-modal-title');
      expect(title.textContent).toEqual('Expire Entitlement');
      const closeButton = await screen.findByTestId('expire-entitlement-modal-close-button');
      fireEvent.click(closeButton);
      expireFormModal = await screen.queryByTestId('expire-entitlement-form');
      expect(expireFormModal).not.toBeInTheDocument();
    });
  });

  describe('Reissue entitlement button', () => {
    it('Enabled Reissue entitlement button', async () => {
      // We're only checking row 0 of the table since the Reissue button is not disabled
      const dataTable = await screen.findByTestId('entitlements-data-table');
      let dataRow = dataTable.querySelectorAll('tbody tr')[0];
      fireEvent.click(dataRow.querySelector('.dropdown button'));
      // eslint-disable-next-line prefer-destructuring
      dataRow = dataTable.querySelectorAll('tbody tr')[0];
      const expireOption = dataRow.querySelectorAll('.dropdown-menu.show a')[0];
      expect(expireOption.textContent).toEqual('Reissue');
      expect(expireOption.outerHTML).not.toContain('disabled');
      fireEvent.click(expireOption);

      let reissueFormModal = await screen.findByTestId('reissue-entitlement-form');
      expect(reissueFormModal).toBeInTheDocument();
      const title = await screen.findByTestId('reissue-entitlement-modal-title');
      expect(title.textContent).toEqual('Reissue Entitlement');
      const closeButton = await screen.findByTestId('reissue-entitlement-modal-close-button');
      fireEvent.click(closeButton);
      reissueFormModal = await screen.queryByTestId('reissue-entitlement-form');
      expect(reissueFormModal).not.toBeInTheDocument();
    });

    it('Disabled Reissue entitlement button', async () => {
      // We're only checking row 1 of the table since it has the button Reissue Button disabled
      const dataTable = await screen.findByTestId('entitlements-data-table');
      let dataRow = dataTable.querySelectorAll('tbody tr')[1];
      fireEvent.click(dataRow.querySelector('.dropdown button'));
      // eslint-disable-next-line prefer-destructuring
      dataRow = dataTable.querySelectorAll('tbody tr')[1];
      const expireOption = dataRow.querySelectorAll('.dropdown-menu.show a')[0];
      expect(expireOption.textContent).toEqual('Reissue');
      expect(expireOption.outerHTML).toContain('disabled');
    });
  });

  describe('Course Summary button', () => {
    it('Successful course summary fetch', async () => {
      apiMock = jest.spyOn(api, 'getCourseData').mockImplementationOnce(() => Promise.resolve(CourseSummaryData.courseData));
      const dataTable = await screen.findByTestId('entitlements-data-table');
      const dataRow = dataTable.querySelectorAll('tbody tr')[0];
      const courseUuidButton = dataRow.querySelectorAll('td')[3].querySelector('a');
      fireEvent.click(courseUuidButton);
      expect(apiMock).toHaveBeenCalledTimes(1);

      let courseSummary = await screen.findByTestId('course-summary-info');
      expect(courseSummary).not.toBeUndefined();
      await waitFor(() => {
        expect(courseSummary.innerHTML).toEqual(expect.stringContaining(CourseSummaryData.courseData.uuid));
      });

      const closeButton = await screen.findByTestId('course-summary-modal-close-button');
      fireEvent.click(closeButton);
      courseSummary = await screen.queryByTestId('course-summary-info');
      expect(courseSummary).not.toBeInTheDocument();
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

      const dataTable = await screen.findByTestId('entitlements-data-table');
      const dataRow = dataTable.querySelectorAll('tbody tr')[0];
      const courseUuidButton = dataRow.querySelectorAll('td')[3].querySelector('a');
      fireEvent.click(courseUuidButton);
      expect(apiMock).toHaveBeenCalledTimes(1);

      const alert = await screen.findByTestId('alert');
      expect(alert.textContent).toEqual("We couldn't find summary data for this Course.");
    });
  });
});
