import { mount } from 'enzyme';
import React from 'react';

import Enrollments from './Enrollments';
import enrollmentsData from '../data/test/enrollments';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';

const EnrollmentPageWrapper = (props) => (
  <UserMessagesProvider>
    <Enrollments {...props} />
  </UserMessagesProvider>
);

describe('Course Enrollments Listing', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<EnrollmentPageWrapper {...enrollmentsData} />);
  });

  it('default collapsible with enrollment data', () => {
    const collapsible = wrapper.find('CollapsibleAdvanced').find('.collapsible-trigger').hostNodes();
    expect(collapsible.text()).toEqual('Enrollments (2)');
  });

  it('No Enrollment Data', () => {
    const enrollmentData = { ...enrollmentsData, data: [] };
    wrapper = mount(<Enrollments {...enrollmentData} />);
    const collapsible = wrapper.find('CollapsibleAdvanced').find('.collapsible-trigger').hostNodes();
    expect(collapsible.text()).toEqual('Enrollments (0)');
  });

  it('Enrollment change form is rendered for individual enrollment', () => {
    const dataTable = wrapper.find('table.table');
    dataTable.find('tbody tr').forEach(row => {
      const courseId = row.find('a').text();
      row.find('button.btn-outline-primary').simulate('click');
      const enrollmentForm = wrapper.find('EnrollmentForm');
      expect(enrollmentForm.html()).toEqual(expect.stringContaining(courseId));
      enrollmentForm.find('button.btn-outline-secondary').simulate('click');
      expect(wrapper.find('EnrollmentForm')).toEqual({});
    });
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
