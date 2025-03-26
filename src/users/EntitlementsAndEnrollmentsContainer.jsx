import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';
import Enrollments from './enrollments/Enrollments';
import Entitlements from './entitlements/Entitlements';

export default function EntitlementsAndEnrollmentsContainer({
  user,
}) {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div id="entitlementsAndEnrollmentsContainer">
      <div className="mb-2 p-2 background-light-gray">
        <Form.Control name="courseId" className="mr-1 col-sm-4" placeholder="Course ID or Name" defaultValue={searchValue} onChange={(e) => { setSearchValue(e.target.value.toLowerCase()); }} />
      </div>
      <Entitlements
        user={user}
        searchStr={searchValue}
      />
      <Enrollments
        user={user}
        searchStr={searchValue}
      />
    </div>
  );
}

EntitlementsAndEnrollmentsContainer.propTypes = {
  user: PropTypes.string.isRequired,
};
