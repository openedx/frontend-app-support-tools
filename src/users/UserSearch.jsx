import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import PropTypes from 'prop-types';

import { camelCaseObject } from '@edx/frontend-platform';
import { Input, Button } from '@edx/paragon';

import { getAllUserData } from './api';

export default function UserSearch({ dataLoadedHandler }) {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (username !== null) {
      getAllUserData(username).then((data) => {
        dataLoadedHandler(camelCaseObject(data));
      });
    }
  }, [username]);

  const searchRef = useRef();

  const submit = useCallback((event) => {
    setUsername(searchRef.current.value);
    event.preventDefault();
    return false;
  });

  return (
    <form className="form-inline mb-3">

      <label htmlFor="username">Username</label>
      <Input ref={searchRef} className="flex-grow-1 mr-1" name="username" type="text" defaultValue="verified" />
      <Button type="submit" onClick={submit} className="btn-primary">Search</Button>
    </form>
  );
}

UserSearch.propTypes = {
  dataLoadedHandler: PropTypes.func.isRequired,
};
