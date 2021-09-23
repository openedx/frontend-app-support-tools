import { mount } from 'enzyme';
import React from 'react';

import EntitlementForm from './EntitlementForm';
import entitlementFormData from '../../data/test/entitlementForm';
import UserMessagesProvider from '../../../userMessages/UserMessagesProvider';
import { CREATE, REISSUE, EXPIRE } from '../EntitlementActions';

const EntitlementFormWrapper = (props) => (
  <UserMessagesProvider>
    <EntitlementForm {...props} />
  </UserMessagesProvider>
);

describe('Entitlement forms', () => {
  let wrapper;

  it('Create Entitlement form render', () => {
    wrapper = mount(<EntitlementFormWrapper {...entitlementFormData} formType={CREATE} />);
    expect(wrapper.find('CreateEntitlementForm').length).toEqual(1);
    expect(wrapper.find('ReissueEntitlementForm').length).toEqual(0);
    expect(wrapper.find('ExpireEntitlementForm').length).toEqual(0);
  });

  it('Reissue Entitlement form render', () => {
    wrapper = mount(<EntitlementFormWrapper {...entitlementFormData} formType={REISSUE} />);
    expect(wrapper.find('ReissueEntitlementForm').length).toEqual(1);
    expect(wrapper.find('CreateEntitlementForm').length).toEqual(0);
    expect(wrapper.find('ExpireEntitlementForm').length).toEqual(0);
  });

  it('Expire Entitlement form render', () => {
    wrapper = mount(<EntitlementFormWrapper {...entitlementFormData} formType={EXPIRE} />);
    expect(wrapper.find('ExpireEntitlementForm').length).toEqual(1);
    expect(wrapper.find('CreateEntitlementForm').length).toEqual(0);
    expect(wrapper.find('ReissueEntitlementForm').length).toEqual(0);
  });
});
