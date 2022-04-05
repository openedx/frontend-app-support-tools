import { mount } from 'enzyme';
import React from 'react';

import { waitForComponentToPaint } from '../../setupTest';
import ReissueEntitlementForm from './ReissueEntitlementForm';
import entitlementFormData from '../data/test/entitlementForm';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from '../data/api';

const ReissueEntitlementFormWrapper = (props) => (
  <UserMessagesProvider>
    <ReissueEntitlementForm {...props} />
  </UserMessagesProvider>
);

describe('Reissue Entitlement Form', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<ReissueEntitlementFormWrapper {...entitlementFormData} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('Default form render', () => {
    let reissueFormModal = wrapper.find('Modal#reissue-entitlement');
    expect(reissueFormModal.prop('open')).toEqual(true);
    const commentsTextArea = wrapper.find('textarea#comments');
    expect(commentsTextArea.text()).toEqual('');

    wrapper.find('button.btn-link').simulate('click');
    reissueFormModal = wrapper.find('Modal#reissue-entitlement');
    expect(reissueFormModal.prop('open')).toEqual(false);
  });

  describe('Form Submission', () => {
    it('Submit button disabled by default', () => {
      expect(wrapper.find('button.btn-primary').prop('disabled')).toBeTruthy();
    });

    it('Successful form submission', async () => {
      const apiMock = jest.spyOn(api, 'patchEntitlement').mockImplementationOnce(() => Promise.resolve({}));
      expect(apiMock).toHaveBeenCalledTimes(0);

      wrapper.find('textarea#comments').simulate('change', { target: { value: 'reissue the expired entitlement' } });
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
            text: 'Error during reissue of entitlement',
            type: 'danger',
            topic: 'reissueEntitlement',
          },
        ],
      }));
      expect(apiMock).toHaveBeenCalledTimes(0);

      wrapper.find('textarea#comments').simulate('change', { target: { value: 'reissue the expired entitlement' } });
      wrapper.find('button.btn-primary').simulate('click');
      await waitForComponentToPaint(wrapper);

      expect(apiMock).toHaveBeenCalledTimes(1);
      expect(wrapper.find('.alert').text()).toEqual('Error during reissue of entitlement');
    });
  });
});
