import { mount } from 'enzyme';
import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import * as api from './data/api';
import UserSummaryData from './data/test/userSummary';
import LearnerInformation from './LearnerInformation';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import verifiedNameHistoryData from './data/test/verifiedNameHistory';
import { enrollmentsData } from './data/test/enrollments';
import onboardingStatusData from './data/test/onboardingStatus';
import ssoRecordsData from './data/test/ssoRecords';
import licensesData from './data/test/licenses';
import enterpriseCustomerUsersData from './data/test/enterpriseCustomerUsers';
import { entitlementsData } from './data/test/entitlements';

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
    changeHandler: jest.fn(() => { }),
  };

  beforeEach(async () => {
    jest.spyOn(api, 'getVerifiedNameHistory').mockImplementationOnce(() => Promise.resolve(verifiedNameHistoryData));
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
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    const tabs = wrapper.find('nav.nav-tabs a');

    expect(tabs.at(0).text()).toEqual('Account Information');
    expect(tabs.at(1).text()).toEqual('Enrollments/Entitlements');
    expect(tabs.at(2).text()).toEqual('Learner Purchases');
    expect(tabs.at(3).text()).toEqual('SSO/License Info');
    expect(tabs.at(4).text()).toEqual('Learner Credentials');
    expect(tabs.at(5).text()).toEqual('Learner Records');
    expect(tabs.at(6).text()).toEqual('Course Reset');
  });

  it('Account Information Tab', () => {
    let tabs = wrapper.find('nav.nav-tabs a');

    tabs.at(0).simulate('click');
    tabs = wrapper.find('nav.nav-tabs a');
    expect(tabs.at(0).html()).toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(2).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(3).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(4).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(5).html()).not.toEqual(expect.stringContaining('active'));

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
    expect(tabs.at(3).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(4).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(5).html()).not.toEqual(expect.stringContaining('active'));

    const enrollmentsEntitlements = wrapper.find('.tab-content div#learner-information-tabpane-enrollments-entitlements');
    expect(enrollmentsEntitlements.html()).toEqual(expect.stringContaining('active'));
    expect(enrollmentsEntitlements.html()).toEqual(expect.stringContaining('Entitlements (2)'));
    expect(enrollmentsEntitlements.html()).toEqual(expect.stringContaining('Enrollments (2)'));
  });

  it('Learner Purchases Tab', () => {
    let tabs = wrapper.find('nav.nav-tabs a');

    tabs.at(2).simulate('click');
    tabs = wrapper.find('nav.nav-tabs a');
    expect(tabs.at(0).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(2).html()).toEqual(expect.stringContaining('active'));
    expect(tabs.at(3).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(4).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(5).html()).not.toEqual(expect.stringContaining('active'));

    const learnerPurchases = wrapper.find('.tab-content div#learner-information-tabpane-learner-purchases');
    expect(learnerPurchases.html()).toEqual(expect.stringContaining('active'));
    expect(learnerPurchases.html()).toEqual(
      expect.stringContaining('Order History'),
    );
  });

  it('SSO Tab', () => {
    let tabs = wrapper.find('nav.nav-tabs a');

    tabs.at(3).simulate('click');
    tabs = wrapper.find('nav.nav-tabs a');
    expect(tabs.at(0).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(2).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(3).html()).toEqual(expect.stringContaining('active'));
    expect(tabs.at(4).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(5).html()).not.toEqual(expect.stringContaining('active'));

    const ssoRecords = wrapper.find('.tab-content div#learner-information-tabpane-sso');
    expect(ssoRecords.html()).toEqual(expect.stringContaining('active'));
    expect(ssoRecords.html()).toEqual(
      expect.stringContaining('Single Sign-on Records'),
    );
    expect(ssoRecords.html()).toEqual(
      expect.stringContaining('Licenses Subscription'),
    );
  });

  it('Learner Credentials Tab', () => {
    let tabs = wrapper.find('nav.nav-tabs a');

    tabs.at(4).simulate('click');
    tabs = wrapper.find('nav.nav-tabs a');
    expect(tabs.at(0).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(2).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(3).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(4).html()).toEqual(expect.stringContaining('active'));
    expect(tabs.at(5).html()).not.toEqual(expect.stringContaining('active'));

    const credentials = wrapper.find(
      '.tab-content div#learner-information-tabpane-credentials',
    );
    expect(credentials.html()).toEqual(expect.stringContaining('active'));
    expect(credentials.html()).toEqual(
      expect.stringContaining('Learner Credentials'),
    );
  });

  it('Learner Records Tab', () => {
    let tabs = wrapper.find('nav.nav-tabs a');

    tabs.at(5).simulate('click');
    tabs = wrapper.find('nav.nav-tabs a');
    expect(tabs.at(0).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(2).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(3).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(4).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(5).html()).toEqual(expect.stringContaining('active'));

    const records = wrapper.find(
      '.tab-content div#learner-information-tabpane-records',
    );
    expect(records.html()).toEqual(expect.stringContaining('active'));
    expect(records.html()).toEqual(
      expect.stringContaining('Learner Records'),
    );
  });

  it('Course Reset Tab', () => {
    let tabs = wrapper.find('nav.nav-tabs a');

    tabs.at(6).simulate('click');
    tabs = wrapper.find('nav.nav-tabs a');
    expect(tabs.at(0).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(2).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(3).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(4).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(5).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(6).html()).toEqual(expect.stringContaining('active'));

    const records = wrapper.find(
      '.tab-content div#learner-information-tabpane-course-reset',
    );
    expect(records.html()).toEqual(expect.stringContaining('active'));
    expect(records.html()).toEqual(
      expect.stringContaining('Course Reset'),
    );
  });
});
