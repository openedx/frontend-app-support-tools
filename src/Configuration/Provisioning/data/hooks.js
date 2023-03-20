import { useCallback } from 'react';
import { useContextSelector } from 'use-context-selector';
import { ProvisioningContext } from '../ProvisioningContext';
import { updatePolicies } from './utils';

export default function useProvisioningContext() {
  const setState = useContextSelector(ProvisioningContext, (v) => v[1]);

  const updateRootDataState = useCallback((newDataAttribute) => {
    setState((s) => ({
      ...s,
      ...newDataAttribute,
    }));
  }, [setState]);

  const updateFormDataState = useCallback((newDataAttribute, copyPolicies = false, index = 0) => {
    setState((s) => {
      const output = copyPolicies
        ? {
          ...s,
          formData: {
            ...s.formData,
            policies: updatePolicies(s.formData, newDataAttribute, index),
          },
        }
        : {
          ...s,
          formData: {
            ...s.formData,
            ...newDataAttribute,
          },
        };
      return output;
    }, [setState]);
  }, [setState]);

  const setMultipleFunds = (fundingBoolean) => updateRootDataState({ multipleFunds: fundingBoolean });

  const setCustomCatalog = (customCatalogBoolean) => updateRootDataState({ customCatalog: customCatalogBoolean });

  const instantiateMultipleFormData = (catalogQueryTitle) => updateFormDataState({ policies: catalogQueryTitle });

  const resetPolicies = () => updateFormDataState({ policies: [] });

  const setCustomerUUID = (customerUUID) => updateFormDataState({ enterpriseUUID: customerUUID });

  const setFinancialIdentifier = (financialIdentifier) => updateFormDataState({ financialIdentifier });

  const setStartDate = (startDate) => updateFormDataState({ startDate });

  const setEndDate = (endDate) => updateFormDataState({ endDate });

  const setSubsidyRevReq = (subsidyRevReq) => updateFormDataState({ subsidyRevReq });

  const setAccountName = (accountName, index) => updateFormDataState(accountName, true, index);

  const setAccountValue = (accountValue, index) => updateFormDataState(accountValue, true, index);

  const setCatalogCategory = (catalogCategory, index) => updateFormDataState(catalogCategory, true, index);

  const perLearnerCap = (perLearnerCapValue, index) => updateFormDataState(perLearnerCapValue, true, index);

  const setPerLearnerCap = (perLearnerCapAmount, index) => updateFormDataState(perLearnerCapAmount, true, index);

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
