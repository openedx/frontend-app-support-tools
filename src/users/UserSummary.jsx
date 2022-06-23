import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../utils';
import { getAccountActivationUrl } from './data/urls';
import OnboardingStatus from './OnboardingStatus';
import VerifiedName from './VerifiedName';
import AccountActions from './account-actions/AccountActions';
import EnterpriseAssociations from './EnterpriseAssociations';

export default function UserSummary({
  userData,
  changeHandler,
}) {
  return (
    <section className="mb-3">
      <div className="d-flex flex-row flex-wrap">
        <div className="col-sm-6">

          <div id="account-table" className="flex-column pr-4 m-3 card account-info">
            <h3>Account Details</h3>
            <table>
              <tbody>

                <tr>
                  <th>Full Name</th>
                  <td>{userData.name}</td>
                </tr>

                <tr>
                  <th>Verified Name</th>
                  <td>{userData.verifiedName}</td>
                </tr>

                <tr>
                  <th>Username</th>
                  <td>{userData.username}</td>
                </tr>

                <tr>
                  <th>LMS User ID</th>
                  <td>{userData.id}</td>
                </tr>

                <tr>
                  <th>Email</th>
                  <td>{userData.email}</td>
                </tr>

                <tr>
                  <th>{!userData.isActive ? 'Confirmation Link' : 'Confirmed'}</th>
                  <td>
                    {
                    // eslint-disable-next-line no-nested-ternary
                    userData.isActive
                      ? 'yes'
                      : (
                        userData.activationKey !== null
                          ? <a href={getAccountActivationUrl(userData.activationKey)} rel="noopener noreferrer" target="_blank" className="word_break">{userData.activationKey}</a>
                          : 'N/A'
                      )
                    }
                  </td>
                </tr>

                <tr>
                  <th>Country</th>
                  <td>{userData.country}</td>
                </tr>

                <tr>
                  <th>Join Date/Time</th>
                  <td>{formatDate(userData.dateJoined)}</td>
                </tr>

                <tr>
                  <th>Last Login</th>
                  <td>{formatDate(userData.lastLogin)}</td>
                </tr>

                <tr>
                  <th>Password Status</th>
                  <td>{userData.passwordStatus.status}</td>
                </tr>

              </tbody>

            </table>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="row p-4 m-3 account-actions" id="account-actions">
            <AccountActions userData={userData} changeHandler={changeHandler} />
          </div>
          <div className="flex-column">
            <VerifiedName username={userData.username} />
            <OnboardingStatus username={userData.username} />
          </div>
        </div>
        <div className="col mt-3 mx-3 enterprise-associations">
          <EnterpriseAssociations username={userData.username} />
        </div>
      </div>
    </section>
  );
}

UserSummary.propTypes = {
  userData: PropTypes.shape({
    name: PropTypes.string,
    verifiedName: PropTypes.string,
    username: PropTypes.string,
    id: PropTypes.number,
    email: PropTypes.string,
    activationKey: PropTypes.string,
    isActive: PropTypes.bool,
    country: PropTypes.string,
    dateJoined: PropTypes.string,
    lastLogin: PropTypes.string,
    passwordStatus: PropTypes.shape({
      status: PropTypes.string,
      passwordToggleHistory: PropTypes.arrayOf(PropTypes.shape(
        {
          created: PropTypes.string.isRequired,
          comment: PropTypes.string.isRequired,
          disabled: PropTypes.bool.isRequired,
          createdBy: PropTypes.string.isRequired,
        },
      )),
    }),
  }).isRequired,
  changeHandler: PropTypes.func.isRequired,
};
