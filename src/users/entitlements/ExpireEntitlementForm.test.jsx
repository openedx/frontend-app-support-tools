import { mount } from 'enzyme';
import { waitFor } from '@testing-library/react';
import React from 'react';

import { waitForComponentToPaint } from '../../setupTest';
import ExpireEntitlementForm from './ExpireEntitlementForm';
import entitlementFormData from '../data/test/entitlementForm';
import UserMessagesProvider from '../../user-messages/UserMessagesProvider';
import * as api from '../data/api';

const ExpireEntitlementFormWrapper = (props) => (
  <UserMessagesProvider>
    <ExpireEntitlementForm {...props} />
  </UserMessagesProvider>
);

describe('Expire Entitlement Form', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<ExpireEntitlementFormWrapper {...entitlementFormData} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('Default form render', () => {
    const courseUuidInput = wrapper.find('input#courseUuid');
    const modeInput = wrapper.find('input#mode');
    const commentsTextArea = wrapper.find('textarea#comments');
    expect(courseUuidInput.prop('value')).toEqual(entitlementFormData.entitlement.courseUuid);
    expect(modeInput.prop('defaultValue')).toEqual(entitlementFormData.entitlement.mode);
    expect(commentsTextArea.text()).toEqual('');
  });

  describe('Form Submission', () => {
    it('Submit button disabled by default', () => {
      expect(wrapper.find('button.btn-primary').prop('disabled')).toBeTruthy();
    });

    it('Successful form submission', async () => {
      const apiMock = jest.spyOn(api, 'patchEntitlement').mockImplementationOnce(() => Promise.resolve({}));
      expect(apiMock).toHaveBeenCalledTimes(0);

      wrapper.find('input#mode').simulate('change', { target: { value: 'professional' } });
      wrapper.find('input#courseUuid').simulate('change', { target: { value: 'new-course-uuid' } });
      wrapper.find('textarea#comments').simulate('change', { target: { value: 'expiring entitlement' } });
      const submitButton = wrapper.find('button.btn-primary');
      expect(submitButton.prop('disabled')).toBeFalsy();
      submitButton.simulate('click');

      expect(apiMock).toHaveBeenCalledTimes(1);
      // The mock call count does not update on time for expect call, therefore, waitFor is used to give enough time
      // for the call count to update. However, it is possible this might turn out to be flaky.
      await waitFor(() => expect(entitlementFormData.changeHandler).toHaveBeenCalledTimes(1));
      apiMock.mockReset();
    });

    it('Unsuccessful form submission', async () => {
      const apiMock = jest.spyOn(api, 'patchEntitlement').mockImplementationOnce(() => Promise.resolve({
        errors: [
          {
            code: null,
            dismissible: true,
            text: 'Error expiring entitlement',
            type: 'danger',
            topic: 'entitlements',
          },
        ],
      }));
      expect(apiMock).toHaveBeenCalledTimes(0);

      wrapper.find('input#mode').simulate('change', { target: { value: 'professional' } });
      wrapper.find('input#courseUuid').simulate('change', { target: { value: 'new-course-uuid' } });
      wrapper.find('textarea#comments').simulate('change', { target: { value: 'expiring entitlement' } });
      wrapper.find('button.btn-primary').simulate('click');
      await waitForComponentToPaint(wrapper);

      expect(apiMock).toHaveBeenCalledTimes(1);
      expect(wrapper.find('.alert').text()).toEqual('Error expiring entitlement');
    });
  });
});
