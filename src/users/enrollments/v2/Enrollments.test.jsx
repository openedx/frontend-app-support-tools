import { mount } from 'enzyme';
import React from 'react';
import EnrollmentsV2 from './Enrollments';
import { enrollmentsData } from '../../data/test/enrollments';
import UserMessagesProvider from '../../../userMessages/UserMessagesProvider';
import { waitForComponentToPaint } from '../../../setupTest';
import * as api from '../../data/api';

const EnrollmentPageWrapper = (props) => (
  <UserMessagesProvider>
    <EnrollmentsV2 {...props} />
  </UserMessagesProvider>
);

describe('Course Enrollments V2 Listing', () => {
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
    const createFormModal = wrapper.find('Modal#create-enrollment');
    expect(createFormModal.html()).toEqual(expect.stringContaining('Create New Enrollment'));
    expect(createFormModal.prop('open')).toEqual(true);

    createFormModal.find('button.btn-link').simulate('click');
    expect(wrapper.find('CreateEnrollmentForm')).toEqual({});
  });

  it('Enrollment change form is rendered for individual enrollment', () => {
    let dataRow = wrapper.find('table tbody tr').at(0);
    const courseId = dataRow.find('td').at(1).text();
    dataRow.find('.dropdown button').simulate('click');
    dataRow = wrapper.find('table tbody tr').at(0);
    dataRow.find('.dropdown-menu.show a').at(0).simulate('click');

    const changeFormModal = wrapper.find('Modal#change-enrollment');
    expect(changeFormModal.html()).toEqual(expect.stringContaining(courseId));
    expect(changeFormModal.prop('open')).toEqual(true);

    changeFormModal.find('button.btn-link').simulate('click');
    expect(wrapper.find('changeEnrollmentForm')).toEqual({});
  });

  it('Enrollment extra data is rendered for individual enrollment', () => {
    let expandable = wrapper.find('table tbody tr').at(0).find('td div span').at(0);
    expect(expandable.html()).toContain('fa-plus');
    expandable.simulate('click');

    expandable = wrapper.find('table tbody tr').at(0).find('td div span').at(0);
    expect(expandable.html()).toContain('fa-minus');

    const extraTable = wrapper.find('table tbody tr').at(1).find('table');
    const extraTableHeaders = extraTable.find('thead tr th');
    expect(extraTable.find('thead tr th').length).toEqual(3);
    expect(extraTableHeaders.at(0).text()).toEqual('Last Modified');
    expect(extraTableHeaders.at(1).text()).toEqual('Last Modified By');
    expect(extraTableHeaders.at(2).text()).toEqual('Reason');

    expandable.simulate('click');

    expandable = wrapper.find('table tbody tr').at(0).find('td div span').at(0);
    expect(expandable.html()).toContain('fa-plus');
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
});
