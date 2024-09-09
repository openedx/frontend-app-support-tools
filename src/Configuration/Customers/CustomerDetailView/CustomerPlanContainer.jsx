import { useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Form, Skeleton } from '@openedx/paragon';
import useAllAssociatedPlans from '../data/hooks/useAllAssociatedPlans';
import LearnerCreditPlanCard from './LearnerCreditPlanCard';
import SubscriptionPlanCard from './SubscriptionPlanCard';

const CustomerPlanContainer = ({ slug }) => {
  const { id } = useParams();
  const {
    activePolicies,
    activeSubscriptions,
    countOfActivePlans,
    countOfAllPlans,
    inactivePolicies,
    inactiveSubscriptions,
    isLoading,
  } = useAllAssociatedPlans(id);
  const [showInactive, setShowInactive] = useState(false);
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

  const hasActivePlans = activePolicies.length > 0 || renderActiveSubscriptions.length > 0;

  if (!hasActivePlans) {
    return null;
  }

  return (
    <div>
      {!isLoading ? (
        <div>
          <div className="d-flex justify-content-between">
            <h2>Associated subsidy plans ({showInactive ? countOfAllPlans : countOfActivePlans})</h2>
            {(countOfAllPlans !== countOfActivePlans) && (
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
            )}
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
};

export default CustomerPlanContainer;
