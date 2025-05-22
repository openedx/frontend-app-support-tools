import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@openedx/paragon';
import UserSummary from './UserSummary';
import SingleSignOnRecords from './SingleSignOnRecords';
import Licenses from './licenses/Licenses';
import EntitlementsAndEnrollmentsContainer from './EntitlementsAndEnrollmentsContainer';
import LearnerCredentials from './LearnerCredentials';
import LearnerRecords from './LearnerRecords';
import LearnerPurchases from './LearnerPurchases';
import CourseReset from './CourseReset';

export default function LearnerInformation({
  user, changeHandler,
}) {
  return (
    <>
      <br />
      <Tabs
        data-testid="learnerInformationTabs"
        id="learner-information"
        className="learner-information"
      >
        <Tab data-testid="learnerInformationAccountPane" eventKey="account" title="Account Information">
          <br />
          <UserSummary
            userData={user}
            changeHandler={changeHandler}
          />
        </Tab>

        <Tab data-testid="learnerInformationEnrollmentsPane" eventKey="enrollments-entitlements" title="Enrollments/Entitlements">
          <br />
          <EntitlementsAndEnrollmentsContainer user={user.username} />
        </Tab>

        <Tab data-testid="learnerInformationPurchasePane" eventKey="learner-purchases" title="Learner Purchases">
          <br />
          <LearnerPurchases user={user.username} />
        </Tab>

        <Tab data-testid="learnerInformationSSOPane" eventKey="sso" title="SSO/License Info">
          <br />
          <SingleSignOnRecords
            username={user.username}
          />
          <hr />
          <Licenses
            userEmail={user.email}
          />
        </Tab>

        <Tab data-testid="learnerInformationCredentialsPane" eventKey="credentials" title="Learner Credentials">
          <br />
          <LearnerCredentials username={user.username} />
        </Tab>

        <Tab data-testid="learnerInformationRecordsPane" eventKey="records" title="Learner Records">
          <br />
          <LearnerRecords username={user.username} />
        </Tab>
        <Tab data-testid="learnerInformationResetPane" eventKey="course-reset" title="Course Reset">
          <br />
          <CourseReset username={user.username} />
        </Tab>
      </Tabs>
    </>
  );
}

LearnerInformation.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  changeHandler: PropTypes.func.isRequired,
};
