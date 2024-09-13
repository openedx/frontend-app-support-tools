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
    activeSubsidies,
    activeSubscriptions,
    countOfActivePlans,
    countOfAllPlans,
    inactiveSubsidies,
    inactiveSubscriptions,
    isLoading,
  } = useAllAssociatedPlans(id);
  const [showInactive, setShowInactive] = useState(false);
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
            <Form.Switch
              className="ml-2.5 mt-2.5"
              checked={showInactive}
              disabled={countOfAllPlans === countOfActivePlans}
              onChange={() => {
                setShowInactive(prevState => !prevState);
              }}
              data-testid="show-removed-toggle"
            >
              Show inactive
            </Form.Switch>
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
};

export default CustomerPlanContainer;
