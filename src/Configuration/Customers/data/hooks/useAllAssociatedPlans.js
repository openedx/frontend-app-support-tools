import { useState, useEffect, useCallback } from 'react';
import { logError } from '@edx/frontend-platform/logging';
import {
  getCustomerSubscriptions,
  getSubsidies,
} from '../utils';

const useAllAssociatedPlans = (enterpriseId) => {
  const [isLoading, setIsLoading] = useState(true);
  const [inactiveSubscriptions, setInactiveSubscriptions] = useState([]);
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  const [activeSubsidies, setActiveSubsidies] = useState([]);
  const [inactiveSubsidies, setInactiveSubsidies] = useState([]);

  const fetchData = useCallback(
    async () => {
      try {
        const [
          subscriptionsResponse,
          subsidiesResponse,
        ] = await Promise.all([
          getCustomerSubscriptions(enterpriseId),
          getSubsidies(enterpriseId),
        ]);
        setActiveSubscriptions(subscriptionsResponse.results.filter(subscription => subscription.isActive === true));
        setInactiveSubscriptions(subscriptionsResponse.results.filter(subscription => subscription.isActive === false));
        setActiveSubsidies(subsidiesResponse.filter(subsidy => subsidy.isActive === true));
        setInactiveSubsidies(subsidiesResponse.filter(subsidy => subsidy.isActive === false));
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
    activeSubsidies,
    activeSubscriptions,
    inactiveSubsidies,
    inactiveSubscriptions,
    isLoading,
  };
};

export default useAllAssociatedPlans;
