import React, {
  useCallback, useState, useEffect, useContext,
} from 'react';
import PropTypes from 'prop-types';

import { camelCaseObject, history } from '@edx/frontend-platform';
import { Link } from 'react-router-dom';
import PageLoading from '../PageLoading';

import UserSummary from './UserSummary';
import Enrollments from './Enrollments';
import Entitlements from './Entitlements';
import UserSearch from './UserSearch';
import { getAllUserData } from './api';
import UserMessagesContext from '../user-messages/UserMessagesContext';
import AlertList from '../user-messages/AlertList';

export default function UserPage({ match }) {
  const { username } = match.params;
  const [data, setData] = useState({ enrollments: null, entitlements: null });
  const [loading, setLoading] = useState(false);
  const [showEnrollments, setShowEnrollments] = useState(true);
  const [showEntitlements, setShowEntitlements] = useState(false);
  const { add, clear } = useContext(UserMessagesContext);

  const handleFetchSearchResults = useCallback((searchUsername) => {
    clear('general');
    if (searchUsername !== undefined) {
      setLoading(true);
      getAllUserData(searchUsername).then((result) => {
        setData(camelCaseObject(result));
        if (result.errors.length > 0) {
          result.errors.forEach(error => add(error));
        }
        setLoading(false);
      });
    }
  });

  const handleSearchInputChange = useCallback((searchUsername) => {
    if (searchUsername !== username) {
      history.push(`/users/${searchUsername}`);
    }
  });

  const handleEntitlementsChange = useCallback(() => {
    setShowEntitlements(true);
    setShowEnrollments(false);
    handleFetchSearchResults(username);
  });

  const handleEnrollmentsChange = useCallback(() => {
    setShowEntitlements(false);
    setShowEnrollments(true);
    handleFetchSearchResults(username);
  });

  useEffect(() => {
    handleFetchSearchResults(username);
  }, [username]);

  return (
    <main className="container-fluid mt-3 mb-5">
      <section className="mb-3">
        <Link to="/">&lt; Back to Tools</Link>
      </section>
      <AlertList topic="general" className="mb-3" />
      <UserSearch username={username} searchHandler={handleSearchInputChange} />
      {loading && (
        <PageLoading
          srMessage="Loading"
        />
      )}
      {!loading && username && data.user && (
        <>
          <UserSummary data={data.user} />
          <Entitlements
            user={username}
            data={data.entitlements}
            changeHandler={handleEntitlementsChange}
            expanded={showEntitlements}
          />
          <Enrollments
            user={username}
            data={data.enrollments}
            changeHandler={handleEnrollmentsChange}
            expanded={showEnrollments}
          />
        </>
      )}
      {!loading && !username && (
      <section>
        <p>Please search for a username.</p>
      </section>
      )}
    </main>
  );
}

UserPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string,
    }).isRequired,
  }).isRequired,
};
