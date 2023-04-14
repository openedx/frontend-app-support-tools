import { useCallback } from 'react';
import { useContextSelector } from 'use-context-selector';
import { camelCaseObject } from '@edx/frontend-platform';
import LmsApiService from '../../../data/services/EnterpriseApiService';
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

  const setAlertMessage = (alertMessage) => updateRootDataState({ alertMessage });

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

  const setCustomerCatalog = (customerCatalogBoolean, index) => updateFormDataState(
    customerCatalogBoolean,
    true,
    index,
  );

  const setCustomerCatalogUUID = (customerCatalogUUID, index) => updateFormDataState(customerCatalogUUID, true, index);

  const setCatalogQueryCategory = (catalogCategory, index) => updateFormDataState(catalogCategory, true, index);

  const setCatalogQuerySelection = (catalogSelection, index) => updateFormDataState(catalogSelection, true, index);

  const perLearnerCap = (perLearnerCapValue, index) => updateFormDataState(perLearnerCapValue, true, index);

  const setPerLearnerCap = (perLearnerCapAmount, index) => updateFormDataState(perLearnerCapAmount, true, index);

  const hydrateCatalogQueryData = useCallback(async () => {
    const { data } = await LmsApiService.fetchEnterpriseCatalogQueries();
    const camelCasedData = camelCaseObject(data.results);
    const learnerCreditPrefix = '[DO NOT ALTER][LEARNER CREDIT]';
    const filteredCourses = camelCasedData.filter(({ title }) => title.indexOf(learnerCreditPrefix) !== 0);

    setState(s => ({
      ...s,
      catalogQueries: {
        ...s.catalogQueries,
        data: filteredCourses,
        isLoading: false,
      },
    }));
  });

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
    hydrateCatalogQueryData,
    setCustomCatalog,
    setCustomerCatalog,
    setCustomerCatalogUUID,
    setCatalogQuerySelection,
    instantiateMultipleFormData,
    resetPolicies,
    setCustomerUUID,
    setFinancialIdentifier,
    setStartDate,
    setEndDate,
    setSubsidyRevReq,
    setAccountName,
    setAccountValue,
    setCatalogQueryCategory,
    perLearnerCap,
    setPerLearnerCap,
    resetFormData,
    setAlertMessage,
  };
}
