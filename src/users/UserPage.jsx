import { camelCaseObject } from '@edx/frontend-platform';
import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import PageLoading from '../components/common/PageLoading';
import AlertList from '../userMessages/AlertList';
import messages from '../CourseTeamManagement/messages';
import { USER_IDENTIFIER_INVALID_ERROR } from '../userMessages/messages';
import UserMessagesContext from '../userMessages/UserMessagesContext';
import { isEmail, isValidUsername, isValidLMSUserID } from '../utils/index';
import { getAllUserData } from './data/api';
import UserSearch from './UserSearch';
import LearnerInformation from './LearnerInformation';
import { TAB_PATH_MAP } from '../SupportToolsTab/constants';
import CancelRetirement from './account-actions/CancelRetirement';
import ROUTES from '../data/constants/routes';
import CoursesListTable from '../CourseTeamManagement/CoursesTable';
import { fetchUserRoleBasedCourses } from '../CourseTeamManagement/data/api';

export default function UserPage({
  isOnCourseTeamPage,
  courseUpdateErrors,
  setCourseUpdateErrors,
  showErrorsModal,
  apiErrors,
  setApiErrors,
  isAlertDismissed,
  setIsAlertDismissed,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();
  const { SUPPORT_TOOLS_TABS } = ROUTES;
  const baseURL = isOnCourseTeamPage
    ? SUPPORT_TOOLS_TABS.SUB_DIRECTORY.COURSE_TEAM_MANAGEMENT
    : TAB_PATH_MAP['learner-information'];
  // converts query params from url into map e.g. ?param1=value1&param2=value2 -> {param1: value1, param2=value2}
  const params = new Map(
    location.search
      .slice(1) // removes '?' mark from start
      .split('&')
      .map(queryParams => queryParams.split('=')),
  );

  if (params.has('email')) {
    const email = params.get('email');
    params.set('email', decodeURIComponent(email));
  }

  const [userIdentifier, setUserIdentifier] = useState(
    params.get('username') || params.get('email') || params.get('lms_user_id') || undefined,
  );
  const [searching, setSearching] = useState(false);
  const [data, setData] = useState({ enrollments: null, entitlements: null });
  const [loading, setLoading] = useState(false);
  const [userCourses, setUserCourses] = useState([]);
  const { add, clear } = useContext(UserMessagesContext);

  function pushHistoryIfChanged(nextUrl) {
    if (nextUrl !== location.pathname + location.search) {
      navigate(nextUrl);
    }
  }

  function getUpdatedURL(result) {
    const lmsId = result?.user?.id;

    if (lmsId) {
      return `${baseURL}/?lms_user_id=${lmsId}`;
    }
    return `${baseURL}`;
  }

  function processSearchResult(searchValue, result) {
    if (result.errors.length > 0) {
      result.errors.forEach((error) => add(error));
      if (result.retirementStatus?.canCancelRetirement) {
        setData(result.retirementStatus);
      }
      navigate(`${baseURL}`, { replace: true });
      document.title = 'Support Tools | edX';
    } else {
      pushHistoryIfChanged(getUpdatedURL(result));
      document.title = `Support Tools | edX | ${searchValue}`;
    }

    setLoading(false);
    setSearching(false);
  }

  function validateInput(input) {
    if (!isValidUsername(input) && !isEmail(input) && !isValidLMSUserID(input)) {
      clear('general');
      clear('courseTeamManagementApiErrors');
      if (isOnCourseTeamPage) { setApiErrors(''); }
      add({
        code: null,
        dismissible: true,
        text: USER_IDENTIFIER_INVALID_ERROR,
        type: 'error',
        topic: 'general',
      });
      navigate(`${baseURL}`, { replace: true });
      return false;
    }
    return true;
  }

  const handleFetchSearchResults = useCallback((searchValue) => {
    if (searchValue !== undefined && searchValue !== '') {
      clear('general');
      clear('courseTeamManagementApiErrors');
      if (isOnCourseTeamPage) { setApiErrors(''); }
      if (!validateInput(searchValue)) {
        return;
      }
      setUserIdentifier(searchValue);
      setLoading(true);
      getAllUserData(searchValue).then((result) => {
        setData(camelCaseObject(result));
        processSearchResult(searchValue, result);
      });
      // This is the case of an empty search (maybe a user wanted to clear out what they were seeing)
    } else if (searchValue === '') {
      clear('general');
      clear('courseTeamManagementApiErrors');
      if (isOnCourseTeamPage) { setApiErrors(''); }
      navigate(`${baseURL}`, { replace: true });
      setLoading(false);
      setSearching(false);
    }
  });
  const handleUserSummaryChange = useCallback(() => {
    setSearching(true);
    handleFetchSearchResults(userIdentifier);
  });

  const handleSearchInputChange = useCallback((searchValue) => {
    setSearching(true);
    handleFetchSearchResults(searchValue);
  });

  useEffect(() => {
    if (!searching) {
      handleFetchSearchResults(userIdentifier);
    }
  }, [userIdentifier]);

  const loadUserCourses = () => {
    if (!data?.user?.email) { return; }
    setUserCourses([]);
    fetchUserRoleBasedCourses(data.user.email, intl).then((response) => {
      if (response?.error) {
        setApiErrors(response);
      } else {
        setUserCourses(response);
      }
    });
  };

  useEffect(() => {
    if (isOnCourseTeamPage) {
      loadUserCourses();
    }
  }, [isOnCourseTeamPage, data.user]);

  useEffect(() => {
    if (isOnCourseTeamPage && courseUpdateErrors?.success) {
      loadUserCourses();
    }
  }, [isOnCourseTeamPage, courseUpdateErrors]);

  useEffect(() => {
    if (params.get('username') && params.get('username') !== userIdentifier) {
      handleFetchSearchResults(params.get('username'));
    } else if (params.get('email') && params.get('email') !== userIdentifier) {
      handleFetchSearchResults(params.get('email'));
    } else if (params.get('lms_user_id') && params.get('lms_user_id') !== userIdentifier) {
      handleFetchSearchResults(params.get('lms_user_id'));
    }
  }, []);
  const showNoUserSelectedDescription = (isOnCourseTeamPage
        && !loading
        && !data?.user)
        || (!searching && apiErrors?.isGetAppError);

  return (
    <main className={`${!isOnCourseTeamPage ? 'mt-3 mb-5' : 'course-team-management-user-search'}`}>
      {!isOnCourseTeamPage && <AlertList topic="general" className="mb-3" />}
      {/* NOTE: the "key" here causes the UserSearch component to re-render completely when the
      user identifier changes.  Doing so clears out the search box. */}
      <UserSearch
        key={userIdentifier}
        userIdentifier={userIdentifier}
        searchHandler={handleSearchInputChange}
        isOnCourseTeamPage={isOnCourseTeamPage}
        username={data?.user?.username}
      />
      {loading && <PageLoading srMessage="Loading" />}
      {showNoUserSelectedDescription && (
        <div className="course-team-management-no-user-selected">
          <h3 style={{ fontWeight: 600, marginBottom: 8 }}>{intl.formatMessage(messages.noUserSelected)}</h3>
          <p style={{ color: '#495057', fontSize: 18, textAlign: 'center' }}>
            {intl.formatMessage(messages.noUserSelectedDescription)}
          </p>
        </div>
      )}
      {isOnCourseTeamPage && !loading && data?.user && userCourses.length > 0
        && (
          <CoursesListTable
            userIdentifier={userIdentifier}
            username={data.user.username}
            email={data.user.email}
            userCourses={userCourses}
            courseUpdateErrors={courseUpdateErrors}
            setCourseUpdateErrors={setCourseUpdateErrors}
            showErrorsModal={showErrorsModal}
            setApiErrors={setApiErrors}
            isAlertDismissed={isAlertDismissed}
            setIsAlertDismissed={setIsAlertDismissed}
          />
        )}
      {!isOnCourseTeamPage && !loading && data.user && data.user.username && (
        <LearnerInformation
          user={data.user}
          changeHandler={handleUserSummaryChange}
        />
      )}
      {!isOnCourseTeamPage && !loading && data.canCancelRetirement && (
        <CancelRetirement
          retirementId={data.retirementId}
          changeHandler={handleUserSummaryChange}
        />
      )}
    </main>
  );
}

UserPage.propTypes = {
  isOnCourseTeamPage: PropTypes.bool,
  showErrorsModal: PropTypes.bool,
  courseUpdateErrors: PropTypes.shape({
    email: PropTypes.string,
    username: PropTypes.string,
    success: PropTypes.bool,
    errors: PropTypes.shape({
      newlyCheckedWithRoleErrors: PropTypes.shape({
        runId: PropTypes.string,
        role: PropTypes.string,
        courseName: PropTypes.string,
        number: PropTypes.string,
        courseId: PropTypes.string,
        error: PropTypes.string,
      }),
      uncheckedWithRoleErrors: PropTypes.shape({
        runId: PropTypes.string,
        role: PropTypes.string,
        courseName: PropTypes.string,
        number: PropTypes.string,
        courseId: PropTypes.string,
        error: PropTypes.string,
      }),
      roleChangedRowsErrors: PropTypes.shape({
        runId: PropTypes.string,
        from: PropTypes.string,
        to: PropTypes.string,
        courseName: PropTypes.string,
        number: PropTypes.string,
        courseId: PropTypes.string,
        error: PropTypes.string,
      }),
    }),
  }),
  setCourseUpdateErrors: PropTypes.func,
  apiErrors: PropTypes.bool,
  setApiErrors: PropTypes.func,
  isAlertDismissed: PropTypes.bool,
  setIsAlertDismissed: PropTypes.func,
};

UserSearch.defaultProps = {
  isOnCourseTeamPage: false,
};
