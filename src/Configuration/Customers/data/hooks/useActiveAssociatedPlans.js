import { useState, useEffect, useCallback } from 'react';
import { logError } from '@edx/frontend-platform/logging';
import {
  getEnterpriseOffers,
  getCouponOrders,
  getCustomerAgreements,
  getSubsidyAccessPolicies,
} from '../utils';

const useActiveAssociatedPlans = (enterpriseId) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const fetchData = useCallback(
    async () => {
      try {
        const [
          customerAgreementsResponse,
          policiesForCustomerResponse,
          enterpriseOffersResponse,
          couponOrdersResponse,
        ] = await Promise.all([
          getCustomerAgreements(enterpriseId),
          getSubsidyAccessPolicies(enterpriseId),
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

        policiesForCustomerResponse.results.some(policy => {
          if (policy.active) {
            setData(prevState => ({
              ...prevState,
              hasActivePolicies: true,
            }));
          }
          return null;
        });

        customerAgreementsResponse.results.some(agreement => {
          agreement.subscriptions.some(subscription => {
            if (subscription.isActive) {
              setData(prevState => ({
                ...prevState,
                hasActiveAgreements: true,
              }));
            }
            return null;
          });
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
