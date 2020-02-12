import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import PropTypes from 'prop-types';

import { camelCaseObject } from '@edx/frontend-platform';
import { Input, Button } from '@edx/paragon';

import { getAllUserData } from './api';

export default function UserSearch({ username, searchHandler }) {
  const searchRef = useRef();

  const submit = useCallback((event) => {
    searchHandler(searchRef.current.value);
    event.preventDefault();
    return false;
  });

  return (
    <section className="mb-3">
      <form className="form-inline">
        <label htmlFor="username">Username</label>
        <Input ref={searchRef} className="flex-grow-1 mr-1" name="username" type="text" defaultValue={username} />
        <Button type="submit" onClick={submit} className="btn-primary">Search</Button>
      </form>
    </section>
  );
}

UserSearch.propTypes = {
  username: PropTypes.string,
  searchHandler: PropTypes.func.isRequired,
};

UserSearch.defaultProps = {
  username: '',
};
