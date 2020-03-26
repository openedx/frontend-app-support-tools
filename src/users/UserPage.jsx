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
import { getAllUserData, getAllUserDataByEmail } from './api';
import UserMessagesContext from '../user-messages/UserMessagesContext';
import AlertList from '../user-messages/AlertList';

export default function UserPage({ match }) {
  const { username } = match.params;
  const [data, setData] = useState({ enrollments: null, entitlements: null });
  const [loading, setLoading] = useState(false);
  const [showEnrollments, setShowEnrollments] = useState(true);
  const [showEntitlements, setShowEntitlements] = useState(false);
  const { add, clear } = useContext(UserMessagesContext);
  const EMAIL_REGEX = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

  const handleSearch = useCallback((searchUsername) => {
    clear('general');
    debugger;
    if (searchUsername !== username) {
      history.push(`/users/${searchUsername}`);
    } else if(searchUsername && searchUsername.match(EMAIL_REGEX)){
      setLoading(true);
      getAllUserDataByEmail(searchUsername).then((result) => {
        setData(camelCaseObject(result));
        if (result.errors.length > 0) {
          result.errors.forEach(error => add(error));
        }
        setLoading(false);
      });
    } else if (username !== undefined) {
      setLoading(true);
      getAllUserData(username).then((result) => {
        setData(camelCaseObject(result));
        if (result.errors.length > 0) {
          result.errors.forEach(error => add(error));
        }
        setLoading(false);
      });
    }
  });

  const handleEntitlementsChange = useCallback(() => {
    setShowEntitlements(true);
    setShowEnrollments(false);
    handleSearch(username);
  });

  const handleEnrollmentsChange = useCallback(() => {
    setShowEntitlements(false);
    setShowEnrollments(true);
    handleSearch(username);
  });

  useEffect(() => {
    handleSearch(username);
  }, [username]);

  return (
    <main className="container-fluid mt-3 mb-5">
      <section className="mb-3">
        <Link to="/">&lt; Back to Tools</Link>
      </section>
      <AlertList topic="general" className="mb-3" />
      <UserSearch username={username} searchHandler={handleSearch} />
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
