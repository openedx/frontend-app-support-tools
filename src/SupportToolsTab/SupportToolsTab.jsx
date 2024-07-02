import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, Tab } from '@openedx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import {
  FEATURE_BASED_ENROLLMENT_TAB,
  LEARNER_INFO_TAB,
  PROGRAM_ENROLLMENT_TAB,
  TAB_PATH_MAP,
} from './constants';
import UserPage from '../users/UserPage';
import FeatureBasedEnrollmentIndexPage from '../FeatureBasedEnrollments/FeatureBasedEnrollmentIndexPage';
import ProgramEnrollmentsIndexPage from '../ProgramEnrollments/ProgramEnrollmentsIndexPage';

export default function SupportToolsTab() {
  const location = useLocation();
  const navigate = useNavigate();

  let tabKey = LEARNER_INFO_TAB;
  switch (location.pathname) {
    case TAB_PATH_MAP[FEATURE_BASED_ENROLLMENT_TAB]:
      tabKey = FEATURE_BASED_ENROLLMENT_TAB;
      break;
    case TAB_PATH_MAP[LEARNER_INFO_TAB]:
      tabKey = LEARNER_INFO_TAB;
      break;
    case TAB_PATH_MAP[PROGRAM_ENROLLMENT_TAB]:
      tabKey = PROGRAM_ENROLLMENT_TAB;
      break;
    default:
      tabKey = LEARNER_INFO_TAB;
      break;
  }

  return (
    <div className="container-fluid">
      <section className="mt-3">
        <h2 className="font-weight-bold">Support Tools</h2>
        <FormattedMessage
          id="supportTools.mainTab.description"
          defaultMessage="Suite of tools used by support team to help triage and resolve select learner issues."
          description="A brief description of the support tools."
          tagName="p"
        />
      </section>
      <section>
        <Tabs
          className="support-tools-tab"
          id="support-tools-tab"
          onSelect={(key) => {
            if (key in TAB_PATH_MAP) {
              navigate(TAB_PATH_MAP[key], { replace: true });
            }
          }}
          defaultActiveKey={tabKey}
        >
          <Tab eventKey={LEARNER_INFO_TAB} title="Learner Information">
            <br />
            <UserPage location={location} />
          </Tab>

          <Tab
            eventKey={FEATURE_BASED_ENROLLMENT_TAB}
            title="Feature Based Enrollment"
          >
            <br />
            <FeatureBasedEnrollmentIndexPage location={location} />
          </Tab>
          <Tab eventKey={PROGRAM_ENROLLMENT_TAB} title="Program Information">
            <br />
            <ProgramEnrollmentsIndexPage location={location} />
          </Tab>
        </Tabs>
      </section>
    </div>
  );
}
