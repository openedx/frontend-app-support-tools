import { mount } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { waitFor } from '@testing-library/react';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import UserPage from './UserPage';
import * as ssoAndUserApi from './data/api';
import UserSummaryData from './data/test/userSummary';
import verifiedNameHistoryData from './data/test/verifiedNameHistory';
import onboardingStatusData from './data/test/onboardingStatus';
import { entitlementsData } from './data/test/entitlements';
import enterpriseCustomerUsersData from './data/test/enterpriseCustomerUsers';
import { enrollmentsData } from './data/test/enrollments';
import ssoRecordsData from './data/test/ssoRecords';
import licensesData from './data/test/licenses';

const mockedNavigator = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigator,
}));

const UserPageWrapper = () => (
  <MemoryRouter>
    <IntlProvider locale="en">
      <UserMessagesProvider>
        <UserPage />
      </UserMessagesProvider>
    </IntlProvider>
  </MemoryRouter>
);

describe('User Page', () => {
  let wrapper;
  let mockedGetUserData;
  beforeEach(() => {
    mockedGetUserData = jest.spyOn(ssoAndUserApi, 'getAllUserData').mockImplementation(() => Promise.resolve({ user: UserSummaryData.userData, errors: [] }));
    jest.spyOn(ssoAndUserApi, 'getVerifiedNameHistory').mockImplementation(() => Promise.resolve(verifiedNameHistoryData));
    jest.spyOn(ssoAndUserApi, 'getEnrollments').mockImplementation(() => Promise.resolve(enrollmentsData));
    jest.spyOn(ssoAndUserApi, 'getOnboardingStatus').mockImplementation(() => Promise.resolve(onboardingStatusData));
    jest.spyOn(ssoAndUserApi, 'getSsoRecords').mockImplementation(() => Promise.resolve(ssoRecordsData));
    jest.spyOn(ssoAndUserApi, 'getLicense').mockImplementation(() => Promise.resolve(licensesData));
    jest.spyOn(ssoAndUserApi, 'getEntitlements').mockImplementation(() => Promise.resolve(entitlementsData));
    jest.spyOn(ssoAndUserApi, 'getEnrollments').mockImplementation(() => Promise.resolve(enrollmentsData));
    jest.spyOn(ssoAndUserApi, 'getEnterpriseCustomerUsers').mockImplementation(() => Promise.resolve(enterpriseCustomerUsersData));

    jest.clearAllMocks();
  });

  it('default render', async () => {
    wrapper = mount(<UserPageWrapper />);
    wrapper.find(
      "input[name='userIdentifier']",
    ).instance().value = 'AnonyMouse';
    wrapper.find('.btn.btn-primary').simulate('click');

    await waitFor(() => {
      expect(mockedNavigator).toHaveBeenCalledWith(
        `/learner_information/?lms_user_id=${UserSummaryData.userData.id}`,
      );
      expect(mockedGetUserData).toHaveBeenCalled();
    });
  });
});
