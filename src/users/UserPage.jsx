import { camelCaseObject } from '@edx/frontend-platform';
import React, {
  useCallback, useContext, useEffect, useState, useLayoutEffect,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLoading from '../components/common/PageLoading';
import AlertList from '../userMessages/AlertList';
import { USER_IDENTIFIER_INVALID_ERROR } from '../userMessages/messages';
import UserMessagesContext from '../userMessages/UserMessagesContext';
import { isEmail, isValidUsername, isValidLMSUserID } from '../utils/index';
import { getAllUserData } from './data/api';
import UserSearch from './UserSearch';
import LearnerInformation from './LearnerInformation';
import { LEARNER_INFO_TAB, TAB_PATH_MAP } from '../SupportToolsTab/constants';
import CancelRetirement from './account-actions/CancelRetirement';

// Supports urls such as /users/?username={username}, /users/?email={email} and /users/?lms_user_id={lms_user_id}
export default function UserPage() {
  const location = useLocation();
  const navigate = useNavigate();
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
  const { add, clear } = useContext(UserMessagesContext);

  function pushHistoryIfChanged(nextUrl) {
    if (nextUrl !== location.pathname + location.search) {
      navigate(nextUrl);
    }
  }

  function getUpdatedURL(result) {
    let lms_id = result?.user?.id;

    if (lms_id) {
      return `${TAB_PATH_MAP['learner-information']}/?lms_user_id=${lms_id}`;
    }
  }

  function processSearchResult(searchValue, result) {
    if (result.errors.length > 0) {
      result.errors.forEach((error) => add(error));
      if (result.retirementStatus?.canCancelRetirement) {
        setData(result.retirementStatus);
      }
      navigate(`${TAB_PATH_MAP['learner-information']}`, { replace: true });
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
      add({
        code: null,
        dismissible: true,
        text: USER_IDENTIFIER_INVALID_ERROR,
        type: 'error',
        topic: 'general',
      });
      navigate(`${TAB_PATH_MAP['learner-information']}`, { replace: true });
      return false;
    }
    return true;
  }

  const handleFetchSearchResults = useCallback((searchValue) => {
    if (searchValue !== undefined && searchValue !== '') {
      clear('general');
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
      navigate(`${TAB_PATH_MAP['learner-information']}`, { replace: true });
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

  useEffect(() => {
    if (params.get('username') && params.get('username') !== userIdentifier) {
      handleFetchSearchResults(params.get('username'));
    } else if (params.get('email') && params.get('email') !== userIdentifier) {
      handleFetchSearchResults(params.get('email'));
    } else if (params.get('lms_user_id') && params.get('lms_user_id') !== userIdentifier) {
      handleFetchSearchResults(params.get('lms_user_id'));
    }
  }, []);

  return (
    <main className="mt-3 mb-5">
      <AlertList topic="general" className="mb-3" />
      {/* NOTE: the "key" here causes the UserSearch component to re-render completely when the
      user identifier changes.  Doing so clears out the search box. */}
      <UserSearch
        key={userIdentifier}
        userIdentifier={userIdentifier}
        searchHandler={handleSearchInputChange}
      />
      {loading && <PageLoading srMessage="Loading" />}
      {!loading && data.user && data.user.username && (
        <LearnerInformation
          user={data.user}
          changeHandler={handleUserSummaryChange}
        />
      )}
      {!loading && data.canCancelRetirement && (
        <CancelRetirement
          retirementId={data.retirementId}
          changeHandler={handleUserSummaryChange}
        />
      )}
    </main>
  );
}
