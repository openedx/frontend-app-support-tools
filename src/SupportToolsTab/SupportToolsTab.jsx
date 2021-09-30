import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@edx/paragon';
import { history } from '@edx/frontend-platform';
import { FEATURE_BASED_ENROLLMENT_TAB, LEARNER_INFO_TAB, TAB_PATH_MAP } from './constants';
import UserPage from '../users/v2/UserPage';
import FeatureBasedEnrollmentIndexPage from '../FeatureBasedEnrollments/FeatureBasedEnrollmentIndexPage';

export default function SupportToolsTab({ location }) {
  let tabKey = LEARNER_INFO_TAB;
  if (location.pathname.indexOf(TAB_PATH_MAP[FEATURE_BASED_ENROLLMENT_TAB]) !== -1) {
    tabKey = FEATURE_BASED_ENROLLMENT_TAB;
  }

  return (
    <>
      <section className="mx-5 mt-3">
        <h2 className="font-weight-bold">Support Tools</h2>
        <p>Suite of tools used by support team to help triage and resolve select learner issues.</p>
      </section>
      <section className="mx-5">
        <Tabs
          className="support-tools-tab"
          id="support-tools-tab"
          onSelect={(key) => {
            if (key in TAB_PATH_MAP) {
              history.replace(TAB_PATH_MAP[key]);
            }
          }}
          defaultActiveKey={tabKey}
          unmountOnExit
        >
          <Tab eventKey={LEARNER_INFO_TAB} title="Learner Information">
            <br />
            <UserPage location={location} />
          </Tab>

          <Tab eventKey={FEATURE_BASED_ENROLLMENT_TAB} title="Feature Based Enrollment">
            <br />
            <FeatureBasedEnrollmentIndexPage location={location} />
          </Tab>

        </Tabs>
      </section>
    </>
  );
}

SupportToolsTab.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
};
