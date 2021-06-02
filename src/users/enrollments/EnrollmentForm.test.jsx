import { mount } from 'enzyme';
import React from 'react';

import EnrollmentForm from './EnrollmentForm';
import { createEnrollmentFormData, changeEnrollmentFormData } from '../data/test/enrollments';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import { CREATE, CHANGE } from './constants';

const EnrollmentFormWrapper = (props) => (
  <UserMessagesProvider>
    <EnrollmentForm {...props} />
  </UserMessagesProvider>
);

describe('Enrollment forms', () => {
  let wrapper;

  it('Create Enrollment form render', () => {
    wrapper = mount(<EnrollmentFormWrapper {...createEnrollmentFormData} formType={CREATE} />);
    expect(wrapper.find('CreateEnrollmentForm').length).toEqual(1);
    expect(wrapper.find('ChangeEnrollmentForm').length).toEqual(0);
  });

  it('Change Enrollment form render', () => {
    wrapper = mount(<EnrollmentFormWrapper {...changeEnrollmentFormData} formType={CHANGE} />);
    expect(wrapper.find('ChangeEnrollmentForm').length).toEqual(1);
    expect(wrapper.find('CreateEnrollmentForm').length).toEqual(0);
  });
});
