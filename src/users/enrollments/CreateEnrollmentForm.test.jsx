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
    let createFormModal = wrapper.find('ModalDialog#create-enrollment');
    expect(createFormModal.prop('isOpen')).toEqual(true);
    const modeSelectionDropdown = wrapper.find('#mode');
    const modeChangeReasonDropdown = wrapper.find('#reason');
    const commentsTextarea = wrapper.find('#comments');
    expect(modeSelectionDropdown.find('option')).toHaveLength(9);
    expect(modeChangeReasonDropdown.find('option')).toHaveLength(5);
    expect(commentsTextarea.text()).toEqual('');

    wrapper.find('button.btn-link').simulate('click');
    createFormModal = wrapper.find('ModalDialog#create-enrollment');
    expect(createFormModal.prop('isOpen')).toEqual(false);
  });

  describe('Form submission', () => {
    it('Successful form submission', async () => {
      const apiMock = jest.spyOn(api, 'postEnrollment').mockImplementationOnce(() => Promise.resolve({}));
      expect(apiMock).toHaveBeenCalledTimes(0);
      wrapper.find('input.form-control').simulate('change', { target: { value: 'course-v1:testX+test123+2030' } });
      wrapper.find('select.form-control').at(0).simulate('change', { target: { value: 'Other' } });
      wrapper.find('select.form-control').at(1).simulate('change', { target: { value: 'verified' } });
      wrapper.find('textarea.form-control').simulate('change', { target: { value: 'test create enrollment' } });
      expect(wrapper.find('div.spinner-border').length).toEqual(0);
      wrapper.find('button.btn-primary').simulate('click');
      expect(wrapper.find('div.spinner-border').length).toEqual(1);

      expect(apiMock).toHaveBeenCalledTimes(1);

      await waitForComponentToPaint(wrapper);
      expect(wrapper.find('.alert').text()).toEqual('New Enrollment successfully created.');
      expect(wrapper.find('div.spinner-border').length).toEqual(0);
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
            topic: 'createEnrollments',
          },
        ],
      }));
      expect(apiMock).toHaveBeenCalledTimes(0);
      wrapper.find('input.form-control').simulate('change', { target: { value: 'course-v1:testX+test123+2030' } });

      wrapper.find('select.form-control').at(0).simulate('change', { target: { value: 'Other' } });
      wrapper.find('select.form-control').at(1).simulate('change', { target: { value: 'verified' } });
      wrapper.find('textarea.form-control').simulate('change', { target: { value: 'test create enrollment' } });
      wrapper.find('button.btn-primary').simulate('click');
      await waitForComponentToPaint(wrapper);
      expect(apiMock).toHaveBeenCalledTimes(1);
      expect(wrapper.find('.alert').text()).toEqual('Error creating enrollment');
    });
  });
});
