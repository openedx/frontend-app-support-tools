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

export default function LearnerInformation({
  user, changeHandler,
}) {
  return (
    <>
      <br />
      <Tabs
        id="learner-information"
        className="learner-information"
      >
        <Tab eventKey="account" title="Account Information">
          <br />
          <UserSummary
            userData={user}
            changeHandler={changeHandler}
          />
        </Tab>

        <Tab eventKey="enrollments-entitlements" title="Enrollments/Entitlements">
          <br />
          <EntitlementsAndEnrollmentsContainer user={user.username} />
        </Tab>

        <Tab eventKey="learner-purchases" title="Learner Purchases">
          <br />
          <LearnerPurchases user={user.username} />
        </Tab>

        <Tab eventKey="sso" title="SSO/License Info">
          <br />
          <SingleSignOnRecords
            username={user.username}
          />
          <hr />
          <Licenses
            userEmail={user.email}
          />
        </Tab>

        <Tab eventKey="credentials" title="Learner Credentials">
          <br />
          <LearnerCredentials username={user.username} />
        </Tab>

        <Tab eventKey="records" title="Learner Records">
          <br />
          <LearnerRecords username={user.username} />
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
