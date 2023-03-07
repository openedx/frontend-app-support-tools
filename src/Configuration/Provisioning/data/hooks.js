import { useCallback } from 'react';
import { useContextSelector } from 'use-context-selector';
import { ProvisioningContext } from '../ProvisioningContext';

export default function useProvisioningContext() {
  const setState = useContextSelector(ProvisioningContext, (v) => v[1]);
  const setMultipleFunds = useCallback((fundingBoolean) => {
    setState(s => ({
      ...s,
      multipleFunds: fundingBoolean,
      formData: {
        ...s.formData,
        multipleFunds: fundingBoolean,
      },
    }));
  }, [setState]);

  const setCustomCatalog = useCallback((customCatalogBoolean) => {
    setState(s => ({
      ...s,
      customCatalog: customCatalogBoolean,
    }));
  }, [setState]);

  const instatiateMultipleFormData = useCallback((catalogQueryTitle) => {
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
    setState(s => {
      const { policies } = s.formData;
      policies[index] = {
        ...policies[index],
        ...accountName,
      };
      const newPolicies = policies.map((policy) => policy);
      return {
        ...s,
        formData: {
          ...s.formData,
          policies: newPolicies,
        },
      };
    });
  }, [setState]);

  const setAccountValue = useCallback((accountValue, index) => {
    setState(s => {
      const { policies } = s.formData;
      policies[index] = {
        ...policies[index],
        ...accountValue,
      };
      const newPolicies = policies.map((policy) => policy);
      return {
        ...s,
        formData: {
          ...s.formData,
          policies: newPolicies,
        },
      };
    });
  }, [setState]);

  const setCatalogCategory = useCallback((catalogCategory, index) => {
    setState(s => {
      const { policies } = s.formData;
      policies[index] = {
        ...policies[index],
        ...catalogCategory,
      };
      const newPolicies = policies.map((policy) => policy);
      return {
        ...s,
        formData: {
          ...s.formData,
          policies: newPolicies,
        },
      };
    });
  }, [setState]);

  const perLearnerCap = useCallback((perLearnerCapValue, index) => {
    setState(s => {
      const { policies } = s.formData;
      policies[index] = {
        ...policies[index],
        ...perLearnerCapValue,
      };
      const newPolicies = policies.map((policy) => policy);
      return {
        ...s,
        formData: {
          ...s.formData,
          policies: newPolicies,
        },
      };
    });
  }, [setState]);

  const setPerLearnerCap = useCallback((perLearnerCapAmount, index) => {
    setState(s => {
      const { policies } = s.formData;
      policies[index] = {
        ...policies[index],
        ...perLearnerCapAmount,
      };
      const newPolicies = policies.map((policy) => policy);
      return {
        ...s,
        formData: {
          ...s.formData,
          policies: newPolicies,
        },
      };
    });
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
    instatiateMultipleFormData,
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
