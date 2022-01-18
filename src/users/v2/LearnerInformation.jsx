import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@edx/paragon';
import UserSummary from './UserSummary';
import SingleSignOnRecords from './SingleSignOnRecords';
import Licenses from '../licenses/v2/Licenses';
import EntitlementsAndEnrollmentsContainer from '../EntitlementsAndEnrollmentsContainer';

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
