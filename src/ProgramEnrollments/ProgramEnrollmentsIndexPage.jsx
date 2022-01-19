import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@edx/paragon';
import LinkProgramEnrollments from './LinkProgramEnrollments';
import ProgramInspector from './ProgramInspector/ProgramInspector';

export default function ProgramEnrollmentsIndexPage({ location }) {
  const [eventKey, setEventKey] = useState('program_inspector');

  useEffect(() => {
    if (location.search) {
      setEventKey('program_inspector');
    } else {
      setEventKey('program_enrollment');
    }
  }, [location.search]);

  return (
    <>
      <Tabs id="programs" defaultActiveKey={eventKey} className="programs">
        <Tab eventKey="program_inspector" title="Program Inspector">
          <br />
          <ProgramInspector location={location} />
        </Tab>
        <Tab eventKey="program_enrollment" title="Link Program Enrollments">
          <br />
          <div className="col-sm-12 px-0">
            <LinkProgramEnrollments />
          </div>
        </Tab>
      </Tabs>
    </>
  );
}

ProgramEnrollmentsIndexPage.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
};
