import { mount } from 'enzyme';
import { waitFor } from '@testing-library/react';
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
    const modeSelectionDropdown = wrapper.find('select#mode');
    const modeChangeReasonDropdown = wrapper.find('select#reason');
    const commentsTextarea = wrapper.find('textarea#comments');
    expect(modeSelectionDropdown.find('option')).toHaveLength(2);
    expect(modeChangeReasonDropdown.find('option')).toHaveLength(5);
    expect(commentsTextarea.text()).toEqual('');
  });

  describe('Form submission', () => {
    it('Successful form submission', async () => {
      const apiMock = jest.spyOn(api, 'patchEnrollment').mockImplementationOnce(() => Promise.resolve({}));
      expect(apiMock).toHaveBeenCalledTimes(0);

      wrapper.find('select#reason').simulate('change', { target: { value: 'Other' } });
      wrapper.find('select#mode').simulate('change', { target: { value: 'verified' } });
      wrapper.find('textarea#comments').simulate('change', { target: { value: 'test mode change' } });
      wrapper.find('button.btn-primary').simulate('click');
      expect(apiMock).toHaveBeenCalledTimes(1);

      // The mock call count does not update on time for expect call, therefore, waitFor is used to give enough time
      // for the call count to update. However, it is possible this might turn out to be flaky.
      await waitFor(() => expect(changeEnrollmentFormData.changeHandler).toHaveBeenCalledTimes(1));
      apiMock.mockReset();
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

      wrapper.find('select#reason').simulate('change', { target: { value: 'Other' } });

      wrapper.find('select#mode').simulate('change', { target: { value: 'verified' } });
      wrapper.find('textarea#comments').simulate('change', { target: { value: 'test mode change' } });
      wrapper.find('button.btn-primary').simulate('click');
      await waitForComponentToPaint(wrapper);

      expect(apiMock).toHaveBeenCalledTimes(1);
      expect(wrapper.find('.alert').text()).toEqual('Error changing enrollment');
    });
  });
});
