import { mount } from 'enzyme';
import React from 'react';
import Enrollments from './Enrollments';
import { enrollmentsData } from '../data/test/enrollments';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import { waitForComponentToPaint } from '../../setupTest';
import * as api from '../data/api';

const EnrollmentPageWrapper = (props) => (
  <UserMessagesProvider>
    <Enrollments {...props} />
  </UserMessagesProvider>
);

describe('Course Enrollments Listing', () => {
  let wrapper;
  const props = {
    user: 'edX',
    changeHandler: jest.fn(() => {}),
  };

  beforeEach(async () => {
    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve(enrollmentsData));
    wrapper = mount(<EnrollmentPageWrapper {...props} />);
    await waitForComponentToPaint(wrapper);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('default enrollment data', () => {
    const componentHeader = wrapper.find('h3');
    expect(componentHeader.text()).toEqual('Enrollments (2)');
  });

  it('No Enrollment Data', async () => {
    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve([]));
    wrapper = mount(<EnrollmentPageWrapper {...props} />);
    await waitForComponentToPaint(wrapper);
    const componentHeader = wrapper.find('h3');
    expect(componentHeader.text()).toEqual('Enrollments (0)');
  });

  it('Error fetching enrollments', async () => {
    const enrollmentErrors = {
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'An unexpected error occurred. Please try refreshing the page.',
          type: 'danger',
          topic: 'enrollments',
        },
      ],
    };
    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve(enrollmentErrors));
    wrapper = mount(<EnrollmentPageWrapper {...props} />);
    await waitForComponentToPaint(wrapper);

    const alert = wrapper.find('div.alert');
    expect(alert.text()).toEqual(enrollmentErrors.errors[0].text);
  });

  it('Enrollment create form is rendered', () => {
    const createEnrollmentButton = wrapper.find('button#create-enrollment-button');
    createEnrollmentButton.simulate('click');
    const createFormModal = wrapper.find('ModalDialog#create-enrollment');
    expect(createFormModal.html()).toEqual(expect.stringContaining('Create New Enrollment'));
    expect(createFormModal.prop('isOpen')).toEqual(true);

    createFormModal.find('button.btn-link').simulate('click');
    expect(wrapper.find('CreateEnrollmentForm')).toEqual({});
  });

  it('Enrollment change form is rendered for individual enrollment', () => {
    let dataRow = wrapper.find('table tbody tr').at(0);
    const courseId = dataRow.find('td').at(1).text();
    dataRow.find('.dropdown button').simulate('click');
    dataRow = wrapper.find('table tbody tr').at(0);
    dataRow.find('.dropdown-menu.show a').at(0).simulate('click');

    const changeFormModal = wrapper.find('ModalDialog#change-enrollment');
    expect(changeFormModal.html()).toEqual(expect.stringContaining(courseId));
    expect(changeFormModal.prop('isOpen')).toEqual(true);

    changeFormModal.find('button.btn-link').simulate('click');
    expect(wrapper.find('changeEnrollmentForm')).toEqual({});
  });

  it('Enrollment extra data and enterprise course enrollments are rendered for individual enrollment', () => {
    let expandable = wrapper.find('table tbody tr').at(0).find('td div span').at(0);
    expect(expandable.html()).toContain('fa-plus');
    expandable.simulate('click');

    expandable = wrapper.find('table tbody tr').at(0).find('td div span').at(0);
    expect(expandable.html()).toContain('fa-minus');

    const extraTables = wrapper.find('table tbody tr').at(1).find('table');
    expect(extraTables.length).toEqual(2);

    const extraDataTable = extraTables.at(0);
    const extraTableHeaders = extraDataTable.find('thead tr th');
    expect(extraTableHeaders.length).toEqual(4);
    ['Last Modified', 'Last Modified By', 'Reason', 'Order Number'].forEach((expectedHeader, index) => expect(
      extraTableHeaders.at(index).text(),
    ).toEqual(expectedHeader));

    const enterpriseCourseEnrollmentsTable = extraTables.at(1);
    const enterpriseCourseEnrollmentsTableHeaders = enterpriseCourseEnrollmentsTable.find('thead tr th');
    expect(enterpriseCourseEnrollmentsTableHeaders.length).toEqual(5);

    ['Enterprise Name', 'Data Sharing Consent Provided', 'Data Sharing Consent Required', 'License', 'License Revoked'].forEach(
      (expectedHeader, index) => expect(
        enterpriseCourseEnrollmentsTableHeaders.at(index).text(),
      ).toEqual(expectedHeader),
    );

    expandable.simulate('click');

    expandable = wrapper.find('table tbody tr').at(0).find('td div span').at(0);
    expect(expandable.html()).toContain('fa-plus');
  });

  it('Enterprise course enrollments table is not rendered if are no enterprise course enrollments', async () => {
    const mockEnrollments = [{
      ...enrollmentsData[0],
      enterpriseCourseEnrollments: [],
    },
    {
      ...enrollmentsData[0],
      enterpriseCourseEnrollments: undefined,
    }];

    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve(mockEnrollments));

    wrapper = mount(<EnrollmentPageWrapper {...props} />);
    await waitForComponentToPaint(wrapper);

    mockEnrollments.forEach((_, index) => {
      const expandable = wrapper.find('table tbody tr').at(index).find('td div span').at(0);
      expandable.simulate('click');

      const extraTables = wrapper.find('table tbody tr').at(1).find('table');
      expect(extraTables.length).toEqual(1);

      const extraDataTable = extraTables.at(0);
      const extraTableHeaders = extraDataTable.find('thead tr th');
      expect(extraTableHeaders.length).toEqual(4);
      ['Last Modified', 'Last Modified By', 'Reason', 'Order Number'].forEach((expectedHeader, idx) => expect(
        extraTableHeaders.at(idx).text(),
      ).toEqual(expectedHeader));
    });
  });

  it('Expand all button shows extra data for all enrollments', () => {
    let expandable = wrapper.find('table tbody tr').at(0).find('td div span');
    expect(expandable.at(0).html()).toContain('fa-plus');
    expect(expandable.at(0).html()).toContain('fa-plus');
    const expandAll = wrapper.find('table thead tr th a').at(0);
    expandAll.simulate('click');

    expandable = wrapper.find('table tbody tr').at(0).find('td div span');
    expect(expandable.at(0).html()).toContain('fa-minus');
    expect(expandable.at(0).html()).toContain('fa-minus');
    expandAll.simulate('click');

    expandable = wrapper.find('table tbody tr').at(0).find('td div span');
    expect(expandable.at(0).html()).toContain('fa-plus');
    expect(expandable.at(0).html()).toContain('fa-plus');
  });

  it('Expand All and Collapse All', () => {
    let expandAll = wrapper.find('table thead tr th a.link-primary');
    expect(expandAll.text()).toEqual('Expand All');
    expandAll.simulate('click');

    expandAll = wrapper.find('table thead tr th a.link-primary');
    expect(expandAll.text()).toEqual('Collapse All');
    expandAll.simulate('click');

    expandAll = wrapper.find('table thead tr th a.link-primary');
    expect(expandAll.text()).toEqual('Expand All');
  });

  it('View Certificate action', async () => {
    /**
     * Testing the certificate fetch on first row only. Async painting in the loop was causing
     * the test to pass data across the loop, causing inconsistent behavior..
     */
    let dataRow = wrapper.find('table tbody tr').at(0);
    const courseName = dataRow.find('td').at(2).text();
    const apiMock = jest.spyOn(api, 'getCertificate').mockImplementationOnce(() => Promise.resolve({ courseKey: courseName }));
    dataRow.find('.dropdown button').simulate('click');
    dataRow = wrapper.find('table tbody tr').at(0);
    dataRow.find('.dropdown-menu.show a').at(1).simulate('click');

    await waitForComponentToPaint(wrapper);
    const certificates = wrapper.find('Certificates');
    expect(certificates.html()).toEqual(expect.stringContaining(courseName));

    expect(apiMock).toHaveBeenCalledTimes(1);
    certificates.find('button.btn-link').simulate('click');
    expect(wrapper.find('Certificates')).toEqual({});
    apiMock.mockReset();
  });

  it('Filter enrollments on the basis of searchStr', async () => {
    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve(enrollmentsData));
    wrapper = mount(<EnrollmentPageWrapper searchStr="test123+2040" {...props} />);
    await waitForComponentToPaint(wrapper);
    const componentHeader = wrapper.find('h3');
    expect(componentHeader.text()).toEqual('Enrollments (1)');
  });
});
