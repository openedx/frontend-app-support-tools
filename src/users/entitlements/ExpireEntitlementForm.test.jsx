import { mount } from 'enzyme';
import React from 'react';

import { waitForComponentToPaint } from '../../setupTest';
import ExpireEntitlementForm from './ExpireEntitlementForm';
import entitlementFormData from '../data/test/entitlementForm';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
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
    let expireFormModal = wrapper.find('Modal#expire-entitlement');
    expect(expireFormModal.prop('open')).toEqual(true);
    const commentsTextArea = wrapper.find('textarea#comments');
    expect(commentsTextArea.text()).toEqual('');

    wrapper.find('button.btn-link').simulate('click');
    expireFormModal = wrapper.find('Modal#expire-entitlement');
    expect(expireFormModal.prop('open')).toEqual(false);
  });

  describe('Form Submission', () => {
    it('Submit button disabled by default', () => {
      expect(wrapper.find('button.btn-primary').prop('disabled')).toBeTruthy();
    });

    it('Successful form submission', async () => {
      const apiMock = jest.spyOn(api, 'patchEntitlement').mockImplementationOnce(() => Promise.resolve({}));
      expect(apiMock).toHaveBeenCalledTimes(0);

      wrapper.find('textarea#comments').simulate('change', { target: { value: 'expiring entitlement' } });
      let submitButton = wrapper.find('button.btn-primary');
      expect(submitButton.prop('disabled')).toBeFalsy();
      expect(wrapper.find('div.spinner-border').length).toEqual(0);
      submitButton.simulate('click');
      expect(wrapper.find('div.spinner-border').length).toEqual(1);

      expect(apiMock).toHaveBeenCalledTimes(1);
      await waitForComponentToPaint(wrapper);
      expect(entitlementFormData.changeHandler).toHaveBeenCalledTimes(1);
      expect(wrapper.find('div.spinner-border').length).toEqual(0);
      apiMock.mockReset();

      submitButton = wrapper.find('button.btn-primary');
      expect(submitButton).toEqual({});
    });

    it('Unsuccessful form submission', async () => {
      const apiMock = jest.spyOn(api, 'patchEntitlement').mockImplementationOnce(() => Promise.resolve({
        errors: [
          {
            code: null,
            dismissible: true,
            text: 'Error expiring entitlement',
            type: 'danger',
            topic: 'expireEntitlement',
          },
        ],
      }));
      expect(apiMock).toHaveBeenCalledTimes(0);

      wrapper.find('textarea#comments').simulate('change', { target: { value: 'expiring entitlement' } });
      wrapper.find('button.btn-primary').simulate('click');
      await waitForComponentToPaint(wrapper);

      expect(apiMock).toHaveBeenCalledTimes(1);
      expect(wrapper.find('.alert').text()).toEqual('Error expiring entitlement');
    });
  });
});
