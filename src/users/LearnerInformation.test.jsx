import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
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
  let unmountWrapper;
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
    const { unmount } = render(<LearnerInformationWrapper {...props} />);
    unmountWrapper = unmount;
  });

  afterEach(() => {
    unmountWrapper();
  });

  it('renders correctly', async () => {
    const tabs = (await screen.findByTestId('learnerInformationTabs')).querySelectorAll('a');

    expect(tabs[0].textContent).toEqual('Account Information');
    expect(tabs[1].textContent).toEqual('Enrollments/Entitlements');
    expect(tabs[2].textContent).toEqual('Learner Purchases');
    expect(tabs[3].textContent).toEqual('SSO/License Info');
    expect(tabs[4].textContent).toEqual('Learner Credentials');
    expect(tabs[5].textContent).toEqual('Learner Records');
    expect(tabs[6].textContent).toEqual('Course Reset');
  });

  it('Account Information Tab', async () => {
    let tabs = (await screen.findByTestId('learnerInformationTabs')).querySelectorAll('a');

    fireEvent.click(tabs[0]);
    tabs = (await screen.findByTestId('learnerInformationTabs')).querySelectorAll('a');
    expect(tabs[0]).toHaveClass('active');
    expect(tabs[1]).not.toHaveClass('active');
    expect(tabs[2]).not.toHaveClass('active');
    expect(tabs[3]).not.toHaveClass('active');
    expect(tabs[4]).not.toHaveClass('active');
    expect(tabs[5]).not.toHaveClass('active');

    const accountInfo = await screen.findByTestId('learnerInformationAccountPane');
    expect(accountInfo).toHaveClass('active');
    expect(accountInfo.querySelector('#account-table h3').textContent).toEqual('Account Details');
  });

  it('Enrollments/Entitlements Tab', async () => {
    let tabs = (await screen.findByTestId('learnerInformationTabs')).querySelectorAll('a');

    fireEvent.click(tabs[1]);
    tabs = (await screen.findByTestId('learnerInformationTabs')).querySelectorAll('a');
    expect(tabs[0]).not.toHaveClass('active');
    expect(tabs[1]).toHaveClass('active');
    expect(tabs[2]).not.toHaveClass('active');
    expect(tabs[3]).not.toHaveClass('active');
    expect(tabs[4]).not.toHaveClass('active');
    expect(tabs[5]).not.toHaveClass('active');

    const enrollmentsEntitlements = await screen.findByTestId('learnerInformationEnrollmentsPane');
    expect(enrollmentsEntitlements).toHaveClass('active');
    expect(enrollmentsEntitlements.textContent).toEqual(expect.stringContaining('Entitlements (2)'));
    expect(enrollmentsEntitlements.textContent).toEqual(expect.stringContaining('Enrollments (2)'));
  });

  it('Learner Purchases Tab', async () => {
    let tabs = (await screen.findByTestId('learnerInformationTabs')).querySelectorAll('a');

    fireEvent.click(tabs[2]);
    tabs = (await screen.findByTestId('learnerInformationTabs')).querySelectorAll('a');
    expect(tabs[0]).not.toHaveClass('active');
    expect(tabs[1]).not.toHaveClass('active');
    expect(tabs[2]).toHaveClass('active');
    expect(tabs[3]).not.toHaveClass('active');
    expect(tabs[4]).not.toHaveClass('active');
    expect(tabs[5]).not.toHaveClass('active');

    const learnerPurchases = await screen.findByTestId('learnerInformationPurchasePane');
    expect(learnerPurchases).toHaveClass('active');
    expect(learnerPurchases.textContent).toContain('Order History');
  });

  it('SSO Tab', async () => {
    let tabs = (await screen.findByTestId('learnerInformationTabs')).querySelectorAll('a');

    fireEvent.click(tabs[3]);
    tabs = (await screen.findByTestId('learnerInformationTabs')).querySelectorAll('a');
    expect(tabs[0]).not.toHaveClass('active');
    expect(tabs[1]).not.toHaveClass('active');
    expect(tabs[2]).not.toHaveClass('active');
    expect(tabs[3]).toHaveClass('active');
    expect(tabs[4]).not.toHaveClass('active');
    expect(tabs[5]).not.toHaveClass('active');

    const ssoRecords = await screen.findByTestId('learnerInformationSSOPane');
    expect(ssoRecords).toHaveClass('active');
    expect(ssoRecords.textContent).toContain('Single Sign-on Records');
    expect(ssoRecords.textContent).toContain('Licenses Subscription');
  });

  it('Learner Credentials Tab', async () => {
    let tabs = (await screen.findByTestId('learnerInformationTabs')).querySelectorAll('a');

    fireEvent.click(tabs[4]);
    tabs = (await screen.findByTestId('learnerInformationTabs')).querySelectorAll('a');
    expect(tabs[0]).not.toHaveClass('active');
    expect(tabs[1]).not.toHaveClass('active');
    expect(tabs[2]).not.toHaveClass('active');
    expect(tabs[3]).not.toHaveClass('active');
    expect(tabs[4]).toHaveClass('active');
    expect(tabs[5]).not.toHaveClass('active');

    const credentials = await screen.findByTestId('learnerInformationCredentialsPane');
    expect(credentials).toHaveClass('active');
    expect(credentials.textContent).toContain('Learner Credentials');
  });

  it('Learner Records Tab', async () => {
    let tabs = (await screen.findByTestId('learnerInformationTabs')).querySelectorAll('a');

    fireEvent.click(tabs[5]);
    tabs = (await screen.findByTestId('learnerInformationTabs')).querySelectorAll('a');
    expect(tabs[0]).not.toHaveClass('active');
    expect(tabs[1]).not.toHaveClass('active');
    expect(tabs[2]).not.toHaveClass('active');
    expect(tabs[3]).not.toHaveClass('active');
    expect(tabs[4]).not.toHaveClass('active');
    expect(tabs[5]).toHaveClass('active');

    const records = await screen.findByTestId('learnerInformationRecordsPane');
    expect(records).toHaveClass('active');
    expect(records.textContent).toContain('Learner Records');
  });

  it('Course Reset Tab', async () => {
    let tabs = (await screen.findByTestId('learnerInformationTabs')).querySelectorAll('a');

    fireEvent.click(tabs[6]);
    tabs = (await screen.findByTestId('learnerInformationTabs')).querySelectorAll('a');
    expect(tabs[0]).not.toHaveClass('active');
    expect(tabs[1]).not.toHaveClass('active');
    expect(tabs[2]).not.toHaveClass('active');
    expect(tabs[3]).not.toHaveClass('active');
    expect(tabs[4]).not.toHaveClass('active');
    expect(tabs[5]).not.toHaveClass('active');
    expect(tabs[6]).toHaveClass('active');

    const records = await screen.findByTestId('learnerInformationResetPane');
    expect(records).toHaveClass('active');
    expect(records.textContent).toContain('Course Reset');
  });
});
