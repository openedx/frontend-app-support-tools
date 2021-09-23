import { mount } from 'enzyme';
import { waitFor } from '@testing-library/react';
import React from 'react';

import { waitForComponentToPaint } from '../../../setupTest';
import ReissueEntitlementForm from './ReissueEntitlementForm';
import entitlementFormData from '../../data/test/entitlementForm';
import UserMessagesProvider from '../../../userMessages/UserMessagesProvider';
import * as api from '../../data/api';

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
      submitButton.simulate('click');

      expect(apiMock).toHaveBeenCalledTimes(1);
      // The mock call count does not update on time for expect call, therefore, waitFor is used to give enough time
      // for the call count to update. However, it is possible this might turn out to be flaky.
      await waitFor(() => expect(entitlementFormData.changeHandler).toHaveBeenCalledTimes(1));
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
