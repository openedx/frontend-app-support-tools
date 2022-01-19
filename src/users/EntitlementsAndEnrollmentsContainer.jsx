import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from '@edx/paragon';
import EnrollmentsV2 from './enrollments/v2/Enrollments';
import EntitlementsV2 from './entitlements/v2/Entitlements';

export default function EntitlementsAndEnrollmentsContainer({
  user,
}) {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div id="entitlementsAndEnrollmentsContainer">
      <div className="mb-2 p-2 background-light-gray">
        <Input name="courseId" className="mr-1 col-sm-4" type="text" placeholder="Course ID or Name" defaultValue={searchValue} onChange={(e) => { setSearchValue(e.target.value.toLowerCase()); }} />
      </div>
      <EntitlementsV2
        user={user}
        searchStr={searchValue}
      />
      <EnrollmentsV2
        user={user}
        searchStr={searchValue}
      />
    </div>
  );
}

EntitlementsAndEnrollmentsContainer.propTypes = {
  user: PropTypes.string.isRequired,
};
