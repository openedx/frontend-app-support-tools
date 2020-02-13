import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { camelCaseObject, history } from '@edx/frontend-platform';
import PageLoading from '../PageLoading';

import UserSummary from './UserSummary';
import Enrollments from './Enrollments';
import Entitlements from './Entitlements';
import UserSearch from './UserSearch';
import { getAllUserData } from './api';

export default function UserPage({ match }) {
  const { username } = match.params;
  const [data, setData] = useState({ user: null, enrollments: null, entitlements: null });
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback((searchUsername) => {
    if (searchUsername !== username) {
      history.push(`/users/${searchUsername}`);
    } else if (username !== undefined) {
      setLoading(true);
      getAllUserData(username).then((result) => {
        console.log(result);
        setData(camelCaseObject(result));
        setLoading(false);
      });
    }
  });

  const handleEntitlementsChange = useCallback(() => {
    handleSearch(username);
  });

  useEffect(() => {
    handleSearch(username);
  }, [username]);

  return (
    <main className="container-fluid my-5">
      <UserSearch username={username} searchHandler={handleSearch} />
      {loading && (
        <PageLoading
          srMessage="Loading"
        />
      )}
      {!loading && username && (
        <>
          <UserSummary data={data.user} />
          <Entitlements user={username} data={data.entitlements} changeHandler={handleEntitlementsChange} />
          <Enrollments user={username} data={data.enrollments} />
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
