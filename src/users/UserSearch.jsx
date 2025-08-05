import React, {
  useRef, useCallback,
} from 'react';
import PropTypes from 'prop-types';

import { Button, Form, Icon } from '@openedx/paragon';
import { Search } from '@openedx/paragon/icons';

export default function UserSearch({ userIdentifier, searchHandler, isOnCourseTeamPage }) {
  const searchRef = useRef();

  const submit = useCallback((event) => {
    searchHandler(searchRef.current.value);
    event.preventDefault();
    return false;
  });

  return (
    <section className={`mb-3${!isOnCourseTeamPage ? ' px-2' : ''}`}>
      <Form className={isOnCourseTeamPage ? 'course-team-management-user-search-form' : ''}>
        <Form.Row className={isOnCourseTeamPage ? 'course-team-management-user-search-form-row' : ''}>
          {!isOnCourseTeamPage && <Form.Label htmlFor="userIdentifier" className="my-auto">Username, Email or LMS User ID</Form.Label>}
          <Form.Control
            ref={searchRef}
            className={`${!isOnCourseTeamPage ? '' : 'flex-grow-1 '}ml-1 mr-1`}
            name="userIdentifier"
            defaultValue={userIdentifier}
            floatingLabel={isOnCourseTeamPage ? 'Username or email' : ''}
            trailingElement={isOnCourseTeamPage ? <Icon src={Search} /> : ''}
          />
          <Button type="submit" onClick={submit} variant="primary">Search</Button>
        </Form.Row>
      </Form>
    </section>
  );
}

UserSearch.propTypes = {
  userIdentifier: PropTypes.string,
  searchHandler: PropTypes.func.isRequired,
  isOnCourseTeamPage: PropTypes.bool,
};

UserSearch.defaultProps = {
  userIdentifier: '',
  isOnCourseTeamPage: false,
};
