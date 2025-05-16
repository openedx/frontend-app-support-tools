import React from 'react';
import { mount } from 'enzyme';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import EntitlementsAndEnrollmentsContainer from './EntitlementsAndEnrollmentsContainer';
import * as api from './data/api';
import { enrollmentsData } from './data/test/enrollments';
import { entitlementsData } from './data/test/entitlements';

const EntitlementsAndEnrollmentsContainerWrapper = (props) => (
  <IntlProvider locale="en">
    <UserMessagesProvider>
      <EntitlementsAndEnrollmentsContainer {...props} />
    </UserMessagesProvider>
  </IntlProvider>
);

describe('Entitlements and Enrollments component', () => {
  let wrapper;
  const props = {
    user: 'edx',
  };

  beforeEach(async () => {
    jest.spyOn(api, 'getEntitlements').mockImplementationOnce(() => Promise.resolve(entitlementsData));
    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve(enrollmentsData));
    wrapper = mount(<EntitlementsAndEnrollmentsContainerWrapper {...props} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    const enrollmentsEntitlements = wrapper.find('#entitlementsAndEnrollmentsContainer');
    expect(enrollmentsEntitlements.html()).toEqual(expect.stringContaining('Entitlements (2)'));
    expect(enrollmentsEntitlements.html()).toEqual(expect.stringContaining('Enrollments (2)'));
  });

  it('filter entitlements and enrollments on the basis of search key', () => {
    wrapper.find('input[name="courseId"]').simulate('change', { target: { value: 'course-v1' } });
    const enrollmentsEntitlements = wrapper.find('#entitlementsAndEnrollmentsContainer');
    expect(enrollmentsEntitlements.html()).toEqual(expect.stringContaining('Entitlements (1)'));
    expect(enrollmentsEntitlements.html()).toEqual(expect.stringContaining('Enrollments (2)'));
  });
});
