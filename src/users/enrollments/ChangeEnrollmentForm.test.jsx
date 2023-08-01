import { mount } from 'enzyme';
import React from 'react';

import { waitForComponentToPaint } from '../../setupTest';
import ChangeEnrollmentForm from './ChangeEnrollmentForm';
import { changeEnrollmentFormData } from '../data/test/enrollments';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from '../data/api';

const EnrollmentFormWrapper = (props) => (
  <UserMessagesProvider>
    <ChangeEnrollmentForm {...props} />
  </UserMessagesProvider>
);

describe('Enrollment Change form', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<EnrollmentFormWrapper {...changeEnrollmentFormData} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('Default form rendering', () => {
    let changeFormModal = wrapper.find('ModalDialog#change-enrollment');
    expect(changeFormModal.prop('isOpen')).toEqual(true);
    const modeSelectionDropdown = wrapper.find('#mode');
    const modeChangeReasonDropdown = wrapper.find('#reason');
    const commentsTextarea = wrapper.find('#comments');
    expect(modeSelectionDropdown.find('option')).toHaveLength(2);
    expect(modeChangeReasonDropdown.find('option')).toHaveLength(5);
    expect(commentsTextarea.text()).toEqual('');

    wrapper.find('button.btn-link').simulate('click');
    changeFormModal = wrapper.find('ModalDialog#change-enrollment');
    expect(changeFormModal.prop('isOpen')).toEqual(false);
  });

  describe('Form submission', () => {
    it('Successful form submission', async () => {
      const apiMock = jest.spyOn(api, 'patchEnrollment').mockImplementationOnce(() => Promise.resolve({}));
      expect(apiMock).toHaveBeenCalledTimes(0);

      wrapper.find('select.form-control').at(0).simulate('change', { target: { value: 'verified' } });
      wrapper.find('select.form-control').at(1).simulate('change', { target: { value: 'Other' } });

      wrapper.find('textarea.form-control').simulate('change', { target: { value: 'test mode change' } });
      expect(wrapper.find('div.spinner-border').length).toEqual(0);
      wrapper.find('button.btn-primary').simulate('click');
      expect(wrapper.find('div.spinner-border').length).toEqual(1);
      expect(apiMock).toHaveBeenCalledTimes(1);

      await waitForComponentToPaint(wrapper);
      expect(changeEnrollmentFormData.changeHandler).toHaveBeenCalledTimes(1);
      expect(wrapper.find('div.spinner-border').length).toEqual(0);

      apiMock.mockReset();
      const submitButton = wrapper.find('button.btn-primary');
      expect(submitButton).toEqual({});
    });

    it('Unsuccessful form submission', async () => {
      const apiMock = jest.spyOn(api, 'patchEnrollment').mockImplementationOnce(() => Promise.resolve({
        errors: [
          {
            code: null,
            dismissible: true,
            text: 'Error changing enrollment',
            type: 'danger',
            topic: 'changeEnrollments',
          },
        ],
      }));
      expect(apiMock).toHaveBeenCalledTimes(0);
      wrapper.find('select.form-control').at(0).simulate('change', { target: { value: 'Other' } });

      wrapper.find('select.form-control').at(1).simulate('change', { target: { value: 'verified' } });
      wrapper.find('textarea.form-control').simulate('change', { target: { value: 'test mode change' } });
      wrapper.find('button.btn-primary').simulate('click');
      await waitForComponentToPaint(wrapper);

      expect(apiMock).toHaveBeenCalledTimes(1);
      expect(wrapper.find('.alert').text()).toEqual('Error changing enrollment');
    });
  });
});
