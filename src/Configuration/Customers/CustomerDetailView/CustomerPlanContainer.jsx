import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Skeleton } from '@openedx/paragon';
import LearnerCreditPlanCard from './LearnerCreditPlanCard';
import SubscriptionPlanCard from './SubscriptionPlanCard';

const CustomerPlanContainer = ({
  slug,
  activePolicies,
  activeSubscriptions,
  countOfActivePlans,
  countOfAllPlans,
  inactivePolicies,
  inactiveSubscriptions,
  isLoading,
}) => {
  const [showInactive, setShowInactive] = useState(false);
  useEffect(() => {
    if (!countOfActivePlans && countOfAllPlans) {
      setShowInactive(true);
    }
  }, []);
  const renderActivePoliciesCard = activePolicies.map(policy => (
    <LearnerCreditPlanCard key={policy.uuid} isActive slug={slug} policy={policy} />
  ));
  const renderInactivePoliciesCard = inactivePolicies.map(policy => (
    <LearnerCreditPlanCard key={policy.uuid} isActive={false} slug={slug} policy={policy} />
  ));
  const renderActiveSubscriptions = activeSubscriptions.map(subscription => (
    <SubscriptionPlanCard key={subscription.uuid} isActive slug={slug} subscription={subscription} />
  ));
  const renderInActiveSubscriptions = inactiveSubscriptions.map(subscription => (
    <SubscriptionPlanCard key={subscription.uuid} isActive={false} slug={slug} subscription={subscription} />
  ));

  return (
    <div>
      {!isLoading ? (
        <div>
          <div className="d-flex justify-content-between">
            <h2>Associated subsidy plans ({showInactive ? countOfAllPlans : countOfActivePlans})</h2>
            {(countOfAllPlans > countOfActivePlans && countOfActivePlans) ? (
              <Form.Switch
                className="ml-2.5 mt-2.5"
                checked={showInactive}
                onChange={() => {
                  setShowInactive(prevState => !prevState);
                }}
                data-testid="show-removed-toggle"
              >
                Show inactive
              </Form.Switch>
            ) : null}
          </div>
          <hr />
          {renderActivePoliciesCard}
          {renderActiveSubscriptions}
          {showInactive ? (
            <div>
              {renderInactivePoliciesCard}
              {renderInActiveSubscriptions}
            </div>
          ) : null}
        </div>
      ) : <Skeleton height={230} />}
    </div>
  );
};

CustomerPlanContainer.propTypes = {
  slug: PropTypes.string.isRequired,
  activePolicies: PropTypes.arrayOf(PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    subsidyActiveDatetime: PropTypes.string.isRequired,
    subsidyExpirationDatetime: PropTypes.string.isRequired,
    policyType: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
  })).isRequired,
  activeSubscriptions: PropTypes.arrayOf(PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    expirationDate: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
  })).isRequired,
  countOfActivePlans: PropTypes.number.isRequired,
  countOfAllPlans: PropTypes.number.isRequired,
  inactivePolicies: PropTypes.arrayOf(PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    subsidyActiveDatetime: PropTypes.string.isRequired,
    subsidyExpirationDatetime: PropTypes.string.isRequired,
    policyType: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
  })).isRequired,
  inactiveSubscriptions: PropTypes.arrayOf(PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    expirationDate: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
  })).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default CustomerPlanContainer;
