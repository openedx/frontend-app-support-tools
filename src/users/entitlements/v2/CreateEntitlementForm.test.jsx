import { mount } from 'enzyme';
import React from 'react';

import { waitForComponentToPaint } from '../../../setupTest';
import CreateEntitlementForm from './CreateEntitlementForm';
import entitlementFormData from '../../data/test/entitlementForm';
import UserMessagesProvider from '../../../userMessages/UserMessagesProvider';
import * as api from '../../data/api';

const CreateEntitlementFormWrapper = (props) => (
  <UserMessagesProvider>
    <CreateEntitlementForm {...props} />
  </UserMessagesProvider>
);

describe('Create Entitlement Form', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<CreateEntitlementFormWrapper {...entitlementFormData} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('Default form render', () => {
    let createFormModal = wrapper.find('Modal#create-entitlement');
    expect(createFormModal.prop('open')).toEqual(true);
    const courseUuidInput = wrapper.find('input#courseUuid');
    const modeSelectDropdown = wrapper.find('select#mode');
    const commentsTextArea = wrapper.find('textarea#comments');
    expect(courseUuidInput.prop('value')).toEqual(entitlementFormData.entitlement.courseUuid);
    expect(modeSelectDropdown.find('option')).toHaveLength(4);
    expect(commentsTextArea.text()).toEqual('');

    wrapper.find('button.btn-link').simulate('click');
    createFormModal = wrapper.find('Modal#create-entitlement');
    expect(createFormModal.prop('open')).toEqual(false);
  });

  describe('Form Submission', () => {
    it('Submit button disabled by default', () => {
      expect(wrapper.find('button.btn-primary').prop('disabled')).toBeTruthy();
    });

    it('Successful form submission', async () => {
      const apiMock = jest.spyOn(api, 'postEntitlement').mockImplementationOnce(() => Promise.resolve({}));
      expect(apiMock).toHaveBeenCalledTimes(0);

      wrapper.find('input#courseUuid').simulate('change', { target: { value: 'b4f19c72-784d-4110-a3ba-318666a7db1a' } });
      wrapper.find('select#mode').simulate('change', { target: { value: 'professional' } });
      wrapper.find('textarea#comments').simulate('change', { target: { value: 'creating new entitlement' } });
      const submitButton = wrapper.find('button.btn-primary');
      expect(submitButton.prop('disabled')).toBeFalsy();
      expect(wrapper.find('div.spinner-border').length).toEqual(0);
      submitButton.simulate('click');
      expect(wrapper.find('div.spinner-border').length).toEqual(1);

      expect(apiMock).toHaveBeenCalledTimes(1);
      await waitForComponentToPaint(wrapper);
      expect(entitlementFormData.changeHandler).toHaveBeenCalledTimes(1);
      expect(wrapper.find('div.spinner-border').length).toEqual(0);
      apiMock.mockReset();
    });

    it('Unsuccessful form submission', async () => {
      const apiMock = jest.spyOn(api, 'postEntitlement').mockImplementationOnce(() => Promise.resolve({
        errors: [
          {
            code: null,
            dismissible: true,
            text: 'Error creating entitlement',
            type: 'danger',
            topic: 'createEntitlement',
          },
        ],
      }));
      expect(apiMock).toHaveBeenCalledTimes(0);

      wrapper.find('textarea#comments').simulate('change', { target: { value: 'creating new entitlement' } });
      wrapper.find('button.btn-primary').simulate('click');
      await waitForComponentToPaint(wrapper);

      expect(apiMock).toHaveBeenCalledTimes(1);
      expect(wrapper.find('.alert').text()).toEqual('Error creating entitlement');
    });
  });
});
