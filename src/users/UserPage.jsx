import React, {
  useCallback, useState, useEffect, useContext,
} from 'react';
import PropTypes from 'prop-types';

import { camelCaseObject, getConfig, history } from '@edx/frontend-platform';
import { Link } from 'react-router-dom';
import PageLoading from '../PageLoading';

import UserSummary from './UserSummary';
import Enrollments from './Enrollments';
import Entitlements from './Entitlements';
import UserSearch from './UserSearch';
import { getAllUserData } from './api';
import UserMessagesContext from '../user-messages/UserMessagesContext';
import AlertList from '../user-messages/AlertList';

// Supports urls such as /users/?username={username} and /users/?email={email}
export default function UserPage({ location }) {
  const url = getConfig().BASE_URL + location.pathname + location.search;
  const params = (new URL(url)).searchParams;
  const [userIdentifier, setUserIdentifier] = useState(params.get('username') || params.get('email') || undefined);
  const [searching, setSearching] = useState(false);
  const [data, setData] = useState({ enrollments: null, entitlements: null });
  const [loading, setLoading] = useState(false);
  const [showEnrollments, setShowEnrollments] = useState(true);
  const [showEntitlements, setShowEntitlements] = useState(false);
  const { add, clear } = useContext(UserMessagesContext);
  const EMAIL_REGEX = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
  const USERNAME_REGEX = '^[\\w.@_+-]+$';

  function isEmail(searchValue) {
    return !!(searchValue && searchValue.match(EMAIL_REGEX));
  }

  function isValidUsername(searchValue) {
    return !!(searchValue && searchValue.match(USERNAME_REGEX));
  }

  function processSearchResult(searchValue, result) {
    if (isEmail(searchValue)) {
      history.replace(`/users/?email=${searchValue}`);
    } else if (isValidUsername(searchValue)) {
      history.replace(`/users/?username=${searchValue}`);
    }

    if (result.errors.length > 0) {
      result.errors.forEach(error => add(error));
      history.replace('/users/');
    }
    setLoading(false);
    setSearching(false);
  }

  function validateInput(input) {
    if (!isValidUsername(input) && !isEmail(input)) {
      clear('general');
      add({
        code: null,
        dismissible: true,
        text: 'The searched username or email is invalid. Please correct the username or email and try again.',
        type: 'error',
        topic: 'general',
      });
      history.replace('/users/');
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
      history.replace('/users/');
      setLoading(false);
      setSearching(false);
    }
  });

  const handleSearchInputChange = useCallback((searchValue) => {
    setSearching(true);
    setShowEntitlements(false);
    setShowEnrollments(true);
    handleFetchSearchResults(searchValue);
  });

  const handleEntitlementsChange = useCallback(() => {
    setShowEntitlements(true);
    setShowEnrollments(false);
    handleFetchSearchResults(userIdentifier);
  });

  const handleEnrollmentsChange = useCallback(() => {
    setShowEntitlements(false);
    setShowEnrollments(true);
    handleFetchSearchResults(userIdentifier);
  });

  useEffect(() => {
    if (!searching) {
      handleFetchSearchResults(userIdentifier);
    }
  }, [userIdentifier]);

  return (
    <main className="container-fluid mt-3 mb-5">
      <section className="mb-3">
        <Link to="/">&lt; Back to Tools</Link>
      </section>
      <AlertList topic="general" className="mb-3" />
      <UserSearch userIdentifier={userIdentifier} searchHandler={handleSearchInputChange} />
      {loading && (
        <PageLoading
          srMessage="Loading"
        />
      )}
      {!loading && data.user && data.user.username && (
        <>
          <UserSummary userData={data.user} verificationData={data.verificationStatus} />
          <Entitlements
            user={data.user.username}
            data={data.entitlements}
            changeHandler={handleEntitlementsChange}
            expanded={showEntitlements}
          />
          <Enrollments
            user={data.user.username}
            data={data.enrollments}
            changeHandler={handleEnrollmentsChange}
            expanded={showEnrollments}
          />
        </>
      )}
      {!loading && !userIdentifier && (
      <section>
        <p>Please search for a username or email.</p>
      </section>
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
