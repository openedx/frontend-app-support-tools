import { useCallback } from 'react';
import { useContextSelector } from 'use-context-selector';
import { ProvisioningContext } from '../ProvisioningContext';
import { updatePolicies } from './utils';

export default function useProvisioningContext() {
  const setState = useContextSelector(ProvisioningContext, (v) => v[1]);
  const setMultipleFunds = useCallback((fundingBoolean) => {
    setState(s => ({
      ...s,
      multipleFunds: fundingBoolean,
    }));
  }, [setState]);

  const setCustomCatalog = useCallback((customCatalogBoolean) => {
    setState(s => ({
      ...s,
      customCatalog: customCatalogBoolean,
    }));
  }, [setState]);

  const instantiateMultipleFormData = useCallback((catalogQueryTitle) => {
    setState(s => {
      const { formData } = s;
      return {
        ...s,
        formData: {
          ...formData,
          policies: catalogQueryTitle,
        },
      };
    });
  }, [setState]);

  const resetPolicies = useCallback(() => {
    setState(s => ({
      ...s,
      formData: {
        ...s.formData,
        policies: [],
      },
    }));
  }, [setState]);

  const setCustomerUUID = useCallback((customerUUID) => {
    setState(s => ({
      ...s,
      formData: {
        ...s.formData,
        enterpriseUUID: customerUUID,
      },
    }));
  }, [setState]);

  const setFinancialIdentifier = useCallback((financialIdentifier) => {
    setState(s => ({
      ...s,
      formData: {
        ...s.formData,
        financialIdentifier,
      },
    }));
  }, [setState]);

  const setStartDate = useCallback((startDate) => {
    setState(s => ({
      ...s,
      formData: {
        ...s.formData,
        startDate,
      },
    }));
  }, [setState]);

  const setEndDate = useCallback((endDate) => {
    setState(s => ({
      ...s,
      formData: {
        ...s.formData,
        endDate,
      },
    }));
  }, [setState]);

  const setSubsidyRevReq = useCallback((subsidyRevReq) => {
    setState(s => ({
      ...s,
      formData: {
        ...s.formData,
        subsidyRevReq,
      },
    }));
  }, [setState]);

  const setAccountName = useCallback((accountName, index) => {
    setState(s => ({
      ...s,
      formData: {
        ...s.formData,
        policies: updatePolicies(s.formData, accountName, index),
      },
    }));
  }, [setState]);

  const setAccountValue = useCallback((accountValue, index) => {
    setState(s => ({
      ...s,
      formData: {
        ...s.formData,
        policies: updatePolicies(s.formData, accountValue, index),
      },
    }));
  }, [setState]);

  const setCatalogCategory = useCallback((catalogCategory, index) => {
    setState(s => ({
      ...s,
      formData: {
        ...s.formData,
        policies: updatePolicies(s.formData, catalogCategory, index),
      },
    }));
  }, [setState]);

  const perLearnerCap = useCallback((perLearnerCapValue, index) => {
    setState(s => ({
      ...s,
      formData: {
        ...s.formData,
        policies: updatePolicies(s.formData, perLearnerCapValue, index),
      },
    }));
  }, [setState]);

  const setPerLearnerCap = useCallback((perLearnerCapAmount, index) => {
    setState(s => ({
      ...s,
      formData: {
        ...s.formData,
        policies: updatePolicies(s.formData, perLearnerCapAmount, index),
      },
    }));
  }, [setState]);

  const resetFormData = useCallback(() => {
    setState(() => ({
      multipleFunds: undefined,
      customCatalog: false,
      formData: {
        policies: [],
      },
    }));
  }, [setState]);

  return {
    setMultipleFunds,
    setCustomCatalog,
    instantiateMultipleFormData,
    resetPolicies,
    setCustomerUUID,
    setFinancialIdentifier,
    setStartDate,
    setEndDate,
    setSubsidyRevReq,
    setAccountName,
    setAccountValue,
    setCatalogCategory,
    perLearnerCap,
    setPerLearnerCap,
    resetFormData,
  };
}
