import { mount } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { waitFor } from '@testing-library/react';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import UserPage from './UserPage';
import * as courseTeamApi from '../CourseTeamManagement/data/api';
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

const UserPageWithProviders = (props) => (
  <MemoryRouter>
    <IntlProvider locale="en">
      <UserMessagesProvider>
        <UserPage {...props} />
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

  describe('Course Team Management mode', () => {
    const sampleCourses = [
      {
        course_id: 'course-v1:edX+Test+1',
        course_name: 'CTM Test Course',
        course_url: 'https://example.com/course',
        role: 'staff',
        status: 'active',
        org: 'edx',
        number: 'Test',
        run: '1',
      },
    ];

    const baseProps = {
      isOnCourseTeamPage: true,
      courseUpdateErrors: {
        email: '',
        username: '',
        success: false,
        errors: {
          newlyCheckedWithRoleErrors: [],
          uncheckedWithRoleErrors: [],
          roleChangedRowsErrors: [],
        },
      },
      setCourseUpdateErrors: jest.fn(),
      showErrorsModal: false,
      apiErrors: false,
      setApiErrors: jest.fn(),
      isAlertDismissed: false,
      setIsAlertDismissed: jest.fn(),
    };

    beforeEach(() => {
      jest.spyOn(courseTeamApi, 'fetchUserRoleBasedCourses').mockResolvedValue(sampleCourses);
      jest
        .spyOn(ssoAndUserApi, 'getAllUserData')
        .mockImplementation(() => Promise.resolve({ user: { id: 123, email: 'test@example.com', username: 'tester' }, errors: [] }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('loads user courses and renders CoursesTable when on course team page', async () => {
      wrapper = mount(<UserPageWithProviders {...baseProps} />);

      // trigger a search to populate user data and then load courses
      wrapper.find("input[name='userIdentifier']").instance().value = 'tester';
      wrapper.find('.btn.btn-primary').simulate('click');

      await waitFor(() => {
        expect(courseTeamApi.fetchUserRoleBasedCourses).toHaveBeenCalledWith('test@example.com', expect.any(Object));
        wrapper.update();
        expect(wrapper.find('.course-team-management-courses-table')).toHaveLength(1);
      });
    });

    it('sets API errors when course loading fails', async () => {
      courseTeamApi.fetchUserRoleBasedCourses.mockResolvedValueOnce({ error: [{ text: 'err', type: 'error' }] });

      const setApiErrors = jest.fn();
      wrapper = mount(<UserPageWithProviders {...baseProps} setApiErrors={setApiErrors} />);

      wrapper.find("input[name='userIdentifier']").instance().value = 'tester';
      wrapper.find('.btn.btn-primary').simulate('click');

      await waitFor(() => {
        expect(setApiErrors).toHaveBeenCalledWith({ error: expect.any(Array) });
      });
    });

    it('reloads courses when courseUpdateErrors.success becomes true', async () => {
      wrapper = mount(<UserPageWithProviders {...baseProps} />);

      wrapper.find("input[name='userIdentifier']").instance().value = 'tester';
      wrapper.find('.btn.btn-primary').simulate('click');

      await waitFor(() => {
        expect(courseTeamApi.fetchUserRoleBasedCourses).toHaveBeenCalledTimes(1);
      });

      // simulate success to trigger reload
      wrapper.setProps({
        courseUpdateErrors: {
          ...baseProps.courseUpdateErrors,
          success: true,
        },
      });

      await waitFor(() => {
        expect(courseTeamApi.fetchUserRoleBasedCourses).toHaveBeenCalledTimes(2);
      });
    });
  });
});
