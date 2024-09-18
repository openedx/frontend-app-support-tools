import { useState, useEffect, useCallback } from 'react';
import { logError } from '@edx/frontend-platform/logging';
import {
  getCustomerSubscriptions,
  getSubsidyAccessPolicies,
} from '../utils';

const useAllAssociatedPlans = (enterpriseId) => {
  const [isLoading, setIsLoading] = useState(true);
  const [inactiveSubscriptions, setInactiveSubscriptions] = useState([]);
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  const [activePolicies, setActivePolicies] = useState([]);
  const [inactivePolicies, setInactivePolicies] = useState([]);

  const fetchData = useCallback(
    async () => {
      try {
        const [
          subscriptionsResponse,
          policiesResponse,
        ] = await Promise.all([
          getCustomerSubscriptions(enterpriseId),
          getSubsidyAccessPolicies(enterpriseId),
        ]);
        setActiveSubscriptions(subscriptionsResponse.results.filter(subscription => subscription.isActive === true));
        setInactiveSubscriptions(subscriptionsResponse.results.filter(subscription => subscription.isActive === false));
        setActivePolicies(policiesResponse.results.filter(policy => policy.isSubsidyActive === true));
        setInactivePolicies(policiesResponse.results.filter(policy => policy.isSubsidyActive === false));
      } catch (error) {
        logError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [enterpriseId],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    activePolicies,
    activeSubscriptions,
    inactivePolicies,
    inactiveSubscriptions,
    isLoading,
  };
};

export default useAllAssociatedPlans;
