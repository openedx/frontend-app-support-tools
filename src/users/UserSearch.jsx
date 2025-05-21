import React, {
  useRef, useCallback,
} from 'react';
import PropTypes from 'prop-types';

import { Form, Button } from '@openedx/paragon';

export default function UserSearch({ userIdentifier, searchHandler }) {
  const searchRef = useRef();

  const submit = useCallback((event) => {
    searchHandler(searchRef.current.value);
    event.preventDefault();
    return false;
  });

  return (
    <section className="mb-3 px-2">
      <Form>
        <Form.Row>
          <Form.Label htmlFor="userIdentifier" className="my-auto">Username, Email or LMS User ID</Form.Label>
          <Form.Control ref={searchRef} className="flex-grow-1 ml-1 mr-1" name="userIdentifier" defaultValue={userIdentifier} />
          <Button type="submit" onClick={submit} variant="primary">Search</Button>
        </Form.Row>
      </Form>
    </section>
  );
}

UserSearch.propTypes = {
  userIdentifier: PropTypes.string,
  searchHandler: PropTypes.func.isRequired,
};

UserSearch.defaultProps = {
  userIdentifier: '',
};
