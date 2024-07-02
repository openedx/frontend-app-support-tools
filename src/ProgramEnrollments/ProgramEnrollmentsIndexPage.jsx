import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, Tab } from '@openedx/paragon';
import LinkProgramEnrollments from './LinkProgramEnrollments';
import ProgramInspector from './ProgramInspector/ProgramInspector';

export default function ProgramEnrollmentsIndexPage() {
  const location = useLocation();
  const [eventKey, setEventKey] = useState('program_inspector');

  useEffect(() => {
    if (location.search) {
      setEventKey('program_inspector');
    } else {
      setEventKey('program_enrollment');
    }
  }, [location.search]);

  return (
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
  );
}
