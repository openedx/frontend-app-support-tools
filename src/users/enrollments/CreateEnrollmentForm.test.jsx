import { mount } from 'enzyme';
import React from 'react';

import { waitForComponentToPaint } from '../../setupTest';
import CreateEnrollmentForm from './CreateEnrollmentForm';
import { createEnrollmentFormData } from '../data/test/enrollments';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from '../data/api';

const EnrollmentFormWrapper = (props) => (
  <UserMessagesProvider>
    <CreateEnrollmentForm {...props} />
  </UserMessagesProvider>
);

describe('Enrollment Create form', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<EnrollmentFormWrapper {...createEnrollmentFormData} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('Default form rendering', () => {
    const modeSelectionDropdown = wrapper.find('select#mode');
    const modeChangeReasonDropdown = wrapper.find('select#reason');
    const commentsTextarea = wrapper.find('textarea#comments');
    expect(modeSelectionDropdown.find('option')).toHaveLength(9);
    expect(modeChangeReasonDropdown.find('option')).toHaveLength(5);
    expect(commentsTextarea.text()).toEqual('');
  });

  describe('Form submission', () => {
    it('Successful form submission', async () => {
      const apiMock = jest.spyOn(api, 'postEnrollment').mockImplementationOnce(() => Promise.resolve({}));
      expect(apiMock).toHaveBeenCalledTimes(0);

      wrapper.find('input#courseID').simulate('change', { target: { value: 'course-v1:testX+test123+2030' } });
      wrapper.find('select#reason').simulate('change', { target: { value: 'Other' } });
      wrapper.find('select#mode').simulate('change', { target: { value: 'verified' } });
      wrapper.find('textarea#comments').simulate('change', { target: { value: 'test create enrollment' } });
      wrapper.find('button.btn-primary').simulate('click');
      expect(apiMock).toHaveBeenCalledTimes(1);

      await waitForComponentToPaint(wrapper);
      expect(wrapper.find('.alert').text()).toEqual('New Enrollment successfully created.');
      apiMock.mockReset();
    });

    it('Unsuccessful form submission', async () => {
      const apiMock = jest.spyOn(api, 'postEnrollment').mockImplementationOnce(() => Promise.resolve({
        errors: [
          {
            code: null,
            dismissible: true,
            text: 'Error creating enrollment',
            type: 'danger',
            topic: 'enrollments',
          },
        ],
      }));
      expect(apiMock).toHaveBeenCalledTimes(0);
      wrapper.find('input#courseID').simulate('change', { target: { value: 'course-v1:testX+test123+2030' } });

      wrapper.find('select#reason').simulate('change', { target: { value: 'Other' } });
      wrapper.find('select#mode').simulate('change', { target: { value: 'verified' } });
      wrapper.find('textarea#comments').simulate('change', { target: { value: 'test create enrollment' } });
      wrapper.find('button.btn-primary').simulate('click');
      await waitForComponentToPaint(wrapper);

      expect(apiMock).toHaveBeenCalledTimes(1);
      expect(wrapper.find('.alert').text()).toEqual('Error creating enrollment');
    });
  });
});
