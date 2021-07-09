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
    expanded: true,
  };

  beforeEach(async () => {
    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve(enrollmentsData));
    wrapper = mount(<EnrollmentPageWrapper {...props} />);
    await waitForComponentToPaint(wrapper);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('default collapsible with enrollment data', () => {
    const collapsible = wrapper.find('CollapsibleAdvanced').find('.collapsible-trigger').hostNodes();
    expect(collapsible.text()).toEqual('Enrollments (2)');
  });

  it('No Enrollment Data', async () => {
    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve([]));
    wrapper = mount(<EnrollmentPageWrapper {...props} />);
    await waitForComponentToPaint(wrapper);
    const collapsible = wrapper.find('CollapsibleAdvanced').find('.collapsible-trigger').hostNodes();
    expect(collapsible.text()).toEqual('Enrollments (0)');
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
    const createEnrollmentForm = wrapper.find('CreateEnrollmentForm');
    createEnrollmentForm.find('button.btn-outline-secondary').simulate('click');
    expect(wrapper.find('CreateEnrollmentForm')).toEqual({});
  });

  it('Enrollment change form is rendered for individual enrollment', () => {
    const dataTable = wrapper.find('table.table');
    dataTable.find('tbody tr').forEach(row => {
      const courseId = row.find('a').text();
      row.find('button#enrollment-change').simulate('click');
      const changeEnrollmentForm = wrapper.find('ChangeEnrollmentForm');
      expect(changeEnrollmentForm.html()).toEqual(expect.stringContaining(courseId));
      changeEnrollmentForm.find('button.btn-outline-secondary').simulate('click');
      expect(wrapper.find('changeEnrollmentForm')).toEqual({});
    });
  });

  it('Enrollment extra data is rendered for individual enrollment', () => {
    const dataTable = wrapper.find('table.table');
    dataTable.find('tbody tr').forEach(row => {
      const courseName = row.find('td').at(1).text();
      row.find('button#extra-data').simulate('click');
      const enrollmentExtra = wrapper.find('EnrollmentExtra');
      expect(enrollmentExtra.html()).toEqual(expect.stringContaining(courseName));
      enrollmentExtra.find('button.btn-outline-secondary').simulate('click');
      expect(wrapper.find('EnrollmentExtra')).toEqual({});
    });
  });

  it('View Certificate action', async () => {
    /**
     * Testing the certificate fetch on first row only. Async painting in the loop was causing
     * the test to pass data across the loop, causing inconsistent behavior..
     */
    const dataRow = wrapper.find('table.table tbody tr').at(0);
    const courseName = dataRow.find('td').at(1).text();
    const apiMock = jest.spyOn(api, 'getCertificate').mockImplementationOnce(() => Promise.resolve({ courseKey: courseName }));
    dataRow.find('button#certificate').simulate('click');

    await waitForComponentToPaint(wrapper);
    const certificates = wrapper.find('Certificates');
    expect(certificates.html()).toEqual(expect.stringContaining(courseName));

    expect(apiMock).toHaveBeenCalledTimes(1);
    certificates.find('button.btn-outline-secondary').simulate('click');
    expect(wrapper.find('Certificates')).toEqual({});
    apiMock.mockReset();
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
});
