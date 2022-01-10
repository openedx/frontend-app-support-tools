import { mount } from 'enzyme';
import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import * as api from '../data/api';
import { waitForComponentToPaint } from '../../setupTest';
import UserSummaryData from '../data/test/userSummary';
import LearnerInformation from './LearnerInformation';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import idvStatusData from '../data/test/idvStatus';
import { enrollmentsData } from '../data/test/enrollments';
import onboardingStatusData from '../data/test/onboardingStatus';
import ssoRecordsData from '../data/test/ssoRecords';
import licensesData from '../data/test/licenses';
import enterpriseCustomerUsersData from '../data/test/enterpriseCustomerUsers';
import { entitlementsData } from '../data/test/entitlements';

const LearnerInformationWrapper = (props) => (
  <IntlProvider locale="en">
    <UserMessagesProvider>
      <LearnerInformation {...props} />
    </UserMessagesProvider>
  </IntlProvider>
);

describe('Learners and Enrollments component', () => {
  let wrapper;
  const props = {
    user: UserSummaryData.userData,
    changeHandler: jest.fn(() => {}),
  };

  beforeEach(async () => {
    jest.spyOn(api, 'getUserVerificationStatus').mockImplementationOnce(() => Promise.resolve(idvStatusData));
    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve(enrollmentsData));
    jest.spyOn(api, 'getOnboardingStatus').mockImplementationOnce(() => Promise.resolve(onboardingStatusData));
    jest.spyOn(api, 'getSsoRecords').mockImplementationOnce(() => Promise.resolve(ssoRecordsData));
    jest.spyOn(api, 'getLicense').mockImplementationOnce(() => Promise.resolve(licensesData));
    jest.spyOn(api, 'getEntitlements').mockImplementationOnce(() => Promise.resolve(entitlementsData));
    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve(enrollmentsData));
    jest.spyOn(api, 'getEnterpriseCustomerUsers').mockImplementationOnce(() => Promise.resolve(enterpriseCustomerUsersData));
    const ssoRecords = ssoRecordsData.map((entry) => ({
      ...entry,
      extraData: JSON.parse(entry.extraData),
    }));
    jest.spyOn(api, 'getSsoRecords').mockImplementationOnce(() => Promise.resolve(ssoRecords));
    wrapper = mount(<LearnerInformationWrapper {...props} />);
    await waitForComponentToPaint(wrapper);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    const tabs = wrapper.find('nav.nav-tabs a');
    expect(tabs.length).toEqual(3);

    expect(tabs.at(0).text()).toEqual('Account Information');
    expect(tabs.at(1).text()).toEqual('Enrollments/Entitlements');
    expect(tabs.at(2).text()).toEqual('SSO/License Info');
  });

  it('Account Information Tab', () => {
    let tabs = wrapper.find('nav.nav-tabs a');

    tabs.at(0).simulate('click');
    tabs = wrapper.find('nav.nav-tabs a');
    expect(tabs.at(0).html()).toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(2).html()).not.toEqual(expect.stringContaining('active'));

    const accountInfo = wrapper.find('.tab-content div#learner-information-tabpane-account');
    expect(accountInfo.html()).toEqual(expect.stringContaining('active'));
    expect(accountInfo.find('#account-table h3').text()).toEqual('Account Details');
  });

  it('Enrollments/Entitlements Tab', () => {
    let tabs = wrapper.find('nav.nav-tabs a');

    tabs.at(1).simulate('click');
    tabs = wrapper.find('nav.nav-tabs a');
    expect(tabs.at(0).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).toEqual(expect.stringContaining('active'));
    expect(tabs.at(2).html()).not.toEqual(expect.stringContaining('active'));

    const enrollmentsEntitlements = wrapper.find('.tab-content div#learner-information-tabpane-enrollments-entitlements');
    expect(enrollmentsEntitlements.html()).toEqual(expect.stringContaining('active'));
    expect(enrollmentsEntitlements.html()).toEqual(expect.stringContaining('Entitlements (2)'));
    expect(enrollmentsEntitlements.html()).toEqual(expect.stringContaining('Enrollments (2)'));
  });

  it('Enrollments/Entitlements Tab', () => {
    let tabs = wrapper.find('nav.nav-tabs a');

    tabs.at(2).simulate('click');
    tabs = wrapper.find('nav.nav-tabs a');
    expect(tabs.at(0).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(2).html()).toEqual(expect.stringContaining('active'));

    const enrollmentsEntitlements = wrapper.find('.tab-content div#learner-information-tabpane-sso');
    expect(enrollmentsEntitlements.html()).toEqual(expect.stringContaining('active'));
    expect(enrollmentsEntitlements.html()).toEqual(expect.stringContaining('Single Sign-on Records'));
    expect(enrollmentsEntitlements.html()).toEqual(expect.stringContaining('Licenses Subscription'));
  });
});
