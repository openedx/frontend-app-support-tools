import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import UserPage from './UserPage';
import * as ssoAndUserApi from './data/api';
import UserSummaryData from './data/test/userSummary';
import verifiedNameHistoryData from './data/test/verifiedNameHistory';
import onboardingStatusData from './data/test/onboardingStatus';
import {
  entitlementsData,
} from './data/test/entitlements';
import enterpriseCustomerUsersData from './data/test/enterpriseCustomerUsers';
import {
  enrollmentsData,
} from './data/test/enrollments';
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
  let mockedGetUserData;

  beforeEach(() => {
    mockedGetUserData = jest
      .spyOn(ssoAndUserApi, 'getAllUserData')
      .mockResolvedValue({ user: UserSummaryData.userData, errors: [] });
    jest.spyOn(ssoAndUserApi, 'getVerifiedNameHistory').mockResolvedValue(verifiedNameHistoryData);
    jest.spyOn(ssoAndUserApi, 'getEnrollments').mockResolvedValue(enrollmentsData);
    jest.spyOn(ssoAndUserApi, 'getOnboardingStatus').mockResolvedValue(onboardingStatusData);
    jest.spyOn(ssoAndUserApi, 'getSsoRecords').mockResolvedValue(ssoRecordsData);
    jest.spyOn(ssoAndUserApi, 'getLicense').mockResolvedValue(licensesData);
    jest.spyOn(ssoAndUserApi, 'getEntitlements').mockResolvedValue(entitlementsData);
    jest.spyOn(ssoAndUserApi, 'getEnterpriseCustomerUsers').mockResolvedValue(enterpriseCustomerUsersData);

    jest.clearAllMocks();
  });

  it('default render and search navigation works', async () => {
    render(<UserPageWrapper />);

    // fallback: find input by role (accessible name is empty)
    const input = screen.getByRole('textbox', { name: '' });
    fireEvent.change(input, { target: { value: 'AnonyMouse' } });

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockedNavigator).toHaveBeenCalledWith(
        `/learner_information/?lms_user_id=${UserSummaryData.userData.id}`,
      );
      expect(mockedGetUserData).toHaveBeenCalled();
    });
  });
});
