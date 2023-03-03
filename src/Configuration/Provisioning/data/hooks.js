import { useCallback } from 'react';
import { useContextSelector } from 'use-context-selector';
import { ProvisioningContext } from '../ProvisioningContext';

export default function useProvisioningContext() {
  const setState = useContextSelector(ProvisioningContext, (v) => v[1]);
  const setMultipleFunds = useCallback((fundingBoolean) => {
    setState((s) => ({
      ...s,
      multipleFunds: fundingBoolean,
    }));
  }, [setState]);

  const setCustomCatalog = useCallback((customCatalogBoolean) => {
    setState((s) => ({
      ...s,
      customCatalog: customCatalogBoolean,
    }));
  }, [setState]);

  const setCustomerUUID = useCallback((customerUUID) => {
    setState((s) => ({
      ...s,
      formData: {
        ...s.formData,
        enterpriseUUID: customerUUID,
      },
    }));
  }, [setState]);

  const setFinancialIdentifier = useCallback((financialIdentifier) => {
    setState((s) => ({
      ...s,
      formData: {
        ...s.formData,
        financialIdentifier,
      },
    }));
  }, [setState]);

  const setStartDate = useCallback((startDate) => {
    setState((s) => ({
      ...s,
      formData: {
        ...s.formData,
        startDate,
      },
    }));
  }, [setState]);

  const setEndDate = useCallback((endDate) => {
    setState((s) => ({
      ...s,
      formData: {
        ...s.formData,
        endDate,
      },
    }));
  }, [setState]);

  return {
    setMultipleFunds,
    setCustomCatalog,
    setCustomerUUID,
    setFinancialIdentifier,
    setStartDate,
    setEndDate,
  };
}
