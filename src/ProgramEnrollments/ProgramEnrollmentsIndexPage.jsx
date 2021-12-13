import React from 'react';
import PropTypes from 'prop-types';
import LinkProgramEnrollments from './LinkProgramEnrollments';

export default function ProgramEnrollmentsIndexPage({ location }) {
  return (
    <main className="mt-3 mb-5">
      <div className="col-sm-6 pr-sm-5 link-program-enrollments">
        <LinkProgramEnrollments location={location} />
      </div>
    </main>
  );
}

ProgramEnrollmentsIndexPage.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
};
