import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Skeleton } from '@openedx/paragon';
import LearnerCreditPlanCard from './LearnerCreditPlanCard';
import SubscriptionPlanCard from './SubscriptionPlanCard';

const CustomerPlanContainer = ({
  slug,
  activeSubsidies,
  activeSubscriptions,
  inactivePolicies,
  inactiveSubscriptions,
  isLoading,
}) => {
  const [showInactive, setShowInactive] = useState(false);
  const countOfActivePlans = activeSubscriptions.length + activePolicies.length;
  const countOfInactivePlans = inactiveSubscriptions.length + inactivePolicies.length;
  const countOfAllPlans = countOfActivePlans + countOfInactivePlans;
  useEffect(() => {
    if (!countOfActivePlans && countOfAllPlans) {
      setShowInactive(true);
    }
  }, []);
  const renderActiveSubsidiesCard = activeSubsidies.map(subsidy => (
    <LearnerCreditPlanCard key={subsidy.uuid} isActive slug={slug} subsidy={subsidy} />
  ));
  const renderInactiveSubsidiesCard = inactiveSubsidies.map(subsidy => (
    <LearnerCreditPlanCard key={subsidy.uuid} isActive={false} slug={slug} subsidy={subsidy} />
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
          {renderActiveSubsidiesCard}
          {renderActiveSubscriptions}
          {showInactive ? (
            <div>
              {renderInactiveSubsidiesCard}
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
  activeSubsidies: PropTypes.arrayOf(PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    activeDatetime: PropTypes.string.isRequired,
    expirationDatetime: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
  })).isRequired,
  activeSubscriptions: PropTypes.arrayOf(PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    expirationDate: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
  })).isRequired,
  inactivePolicies: PropTypes.arrayOf(PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    activeDatetime: PropTypes.string.isRequired,
    expirationDatetime: PropTypes.string.isRequired,
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
