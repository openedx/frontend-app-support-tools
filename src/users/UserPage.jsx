import { camelCaseObject, history } from '@edx/frontend-platform';
import PropTypes from 'prop-types';
import React, {
  useCallback, useContext, useEffect, useState, useLayoutEffect,
} from 'react';
import PageLoading from '../components/common/PageLoading';
import AlertList from '../userMessages/AlertList';
import { USER_IDENTIFIER_INVALID_ERROR } from '../userMessages/messages';
import UserMessagesContext from '../userMessages/UserMessagesContext';
import { isEmail, isValidUsername, isValidLMSUserID } from '../utils/index';
import { getAllUserData } from './data/api';
import UserSearch from './UserSearch';
import LearnerInformation from './v2/LearnerInformation';
import { LEARNER_INFO_TAB, TAB_PATH_MAP } from '../SupportToolsTab/constants';

// Supports urls such as /users/?username={username}, /users/?email={email} and /users/?lms_user_id={lms_user_id}
export default function UserPage({ location }) {
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
      history.push(nextUrl);
    }
  }

  function getUpdatedURL(value) {
    const updatedHistory = `${TAB_PATH_MAP['learner-information']}/?PARAM_NAME=${value}`;
    let identifierType = '';

    if (isEmail(value)) {
      identifierType = 'email';
    } else if (isValidLMSUserID(value)) {
      identifierType = 'lms_user_id';
    } else if (isValidUsername(value)) {
      identifierType = 'username';
    }

    return updatedHistory.replace('PARAM_NAME', identifierType);
  }

  function processSearchResult(searchValue, result) {
    if (result.errors.length > 0) {
      result.errors.forEach((error) => add(error));
      history.replace(`${TAB_PATH_MAP['learner-information']}`);
      document.title = 'Support Tools | edX';
    } else {
      pushHistoryIfChanged(getUpdatedURL(searchValue));
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
      history.replace(`${TAB_PATH_MAP['learner-information']}`);
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
      history.replace(`${TAB_PATH_MAP['learner-information']}`);
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
  }, [params.get('username'), params.get('email'), params.get('lms_user_id')]);

  // To change the url with appropriate query param if query param info is not present in URL
  useLayoutEffect(() => {
    if (userIdentifier
      && location.pathname.indexOf(TAB_PATH_MAP[LEARNER_INFO_TAB]) !== -1
      && !(params.get('email') || params.get('username') || params.get('lms_user_id'))) {
      pushHistoryIfChanged(getUpdatedURL(userIdentifier));
    }
  });

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
    </main>
  );
}

UserPage.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
};
