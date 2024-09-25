import { useState, useEffect, useCallback } from 'react';
import { logError } from '@edx/frontend-platform/logging';
import {
  getEnterpriseOffers,
  getCouponOrders,
  getCustomerSubscriptions,
  getSubsidies,
} from '../utils';

const useActiveAssociatedPlans = (enterpriseId) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const fetchData = useCallback(
    async () => {
      try {
        const [
          customerSubscriptionsResponse,
          subsidiesForCustomerResponse,
          enterpriseOffersResponse,
          couponOrdersResponse,
        ] = await Promise.all([
          getCustomerSubscriptions(enterpriseId),
          getSubsidies(enterpriseId),
          getEnterpriseOffers(enterpriseId),
          getCouponOrders(enterpriseId),
        ]);

        couponOrdersResponse.results.some(coupon => {
          if (coupon.available) {
            setData(prevState => ({
              ...prevState,
              hasActiveOtherSubsidies: true,
            }));
          }
          return null;
        });

        subsidiesForCustomerResponse.some(subsidy => {
          if (subsidy.isActive) {
            setData(prevState => ({
              ...prevState,
              hasActiveSubsidies: true,
            }));
          }
          return null;
        });

        customerSubscriptionsResponse.results.some(subscription => {
          if (subscription.isActive) {
            setData(prevState => ({
              ...prevState,
              hasActiveSubscriptions: true,
            }));
          }
          return null;
        });

        enterpriseOffersResponse.results.some(offer => {
          if (offer.isCurrent) {
            setData(prevState => ({
              ...prevState,
              hasActiveOtherSubsidies: true,
            }));
          }
          return null;
        });
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
    data,
    isLoading,
  };
};

export default useActiveAssociatedPlans;
