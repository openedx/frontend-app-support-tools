import { useCallback } from 'react';
import { useContextSelector } from 'use-context-selector';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import dayjs from './dayjs';
import LmsApiService from '../../../data/services/EnterpriseApiService';
import { INITIAL_POLICIES, MAX_PAGE_SIZE } from './constants';
import { ProvisioningContext } from '../ProvisioningContext';
import {
  filterByEnterpriseCustomerName,
  getCatalog,
  getCustomer,
  getPolicies,
  getPoliciesForSubsidy,
  getPredefinedCatalogQueryMappings,
  getSubsidy,
  normalizeSubsidyDataTableData,
  updatePolicies,
} from './utils';
import { DashboardContext } from '../DashboardContext';
import SubsidyApiService from '../../../data/services/SubsidyApiService';

export function useDashboardContext() {
  const setState = useContextSelector(DashboardContext, v => v[1]);

  const hydrateEnterpriseSubsidies = useCallback(async ({ pageIndex, sortBy, filterBy }) => {
    // Retrieve Basic List
    const customerData = await LmsApiService.fetchEnterpriseCustomersBasicList();
    const fetchedCustomerData = camelCaseObject(customerData.data);

    // Filter by enterprise customer uuid for the enterprise customer uuid
    const filteredData = filterByEnterpriseCustomerName({ fetchedCustomerData, filterBy });

    // Retrieve Subsidy Data with sorted and filtered data
    const subsidyData = await SubsidyApiService.getAllSubsidies({
      pageIndex,
      pageSize: MAX_PAGE_SIZE,
      sortBy,
      filteredData,
    });

    const fetchedSubsidyData = camelCaseObject(subsidyData.data);

    // Normalize data for table
    const normalizedData = normalizeSubsidyDataTableData({
      fetchedSubsidyData,
      fetchedCustomerData,
    });

    // Set state
    setState(s => ({
      ...s,
      enterpriseSubsidies: {
        fetchedCustomerData,
        ...normalizedData,
        pageIndex,
      },
    }));
  }, [setState]);

  return {
    hydrateEnterpriseSubsidies,
  };
}

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
      if (copyPolicies) {
        return {
          ...s,
          formData: {
            ...s.formData,
            policies: updatePolicies(s.formData, newDataAttribute, index),
          },
        };
      }
      return {
        ...s,
        formData: {
          ...s.formData,
          ...newDataAttribute,
        },
      };
    }, [setState]);
  }, [setState]);

  const updateShowInvalidFieldState = useCallback((newDataAttribute, copyPolicies = false, index = 0) => {
    setState((s) => {
      if (copyPolicies) {
        return {
          ...s,
          showInvalidField: {
            ...s.showInvalidField,
            policies: updatePolicies(s.showInvalidField, newDataAttribute, index),
          },
        };
      }
      return {
        ...s,
        showInvalidField: {
          ...s.showInvalidField,
          ...newDataAttribute,
        },
      };
    }, [setState]);
  }, [setState]);

  const setMultipleFunds = (fundingBoolean) => updateRootDataState({ multipleFunds: fundingBoolean });

  const setAlertMessage = (alertMessage) => updateRootDataState({ alertMessage });

  const setCustomCatalog = (customCatalog, index) => updateFormDataState({ customCatalog }, true, index);

  const instantiateMultipleFormData = (multipleFunds) => {
    const { multiplePolicies, singlePolicy } = INITIAL_POLICIES;
    if (multipleFunds) {
      updateFormDataState({ policies: multiplePolicies });
    } else {
      updateFormDataState({ policies: singlePolicy });
    }
  };

  const resetPolicies = () => updateFormDataState({ policies: [] });

  const setSubsidyTitle = (subsidyTitle) => updateFormDataState({ subsidyTitle });

  const setCustomerUUID = (customerUUID) => updateFormDataState({ enterpriseUUID: customerUUID });

  const getCustomers = useCallback(async (customer) => {
    const { data } = await LmsApiService.fetchEnterpriseCustomersBasicList(customer);
    setState(s => ({
      ...s,
      customers: data,
    }));
  }, [setState]);

  const setFinancialIdentifier = (financialIdentifier) => updateFormDataState({ financialIdentifier });

  const setStartDate = (startDate) => updateFormDataState({ startDate });

  const setEndDate = (endDate) => updateFormDataState({ endDate });

  const setSubsidyRevReq = (subsidyRevReq) => updateFormDataState({ subsidyRevReq });

  const setInternalOnly = (internalOnly) => updateFormDataState({ internalOnly });

  const setAccountName = (accountName, index) => updateFormDataState(accountName, true, index);

  const setAccountValue = (accountValue, index) => updateFormDataState(accountValue, true, index);

  const setAccountDescription = (accountDescription, index) => updateFormDataState(accountDescription, true, index);

  const setCustomerCatalog = (customerCatalogBoolean, index) => updateFormDataState(
    customerCatalogBoolean,
    true,
    index,
  );

  const setPredefinedQueryType = (predefinedQueryType, index) => updateFormDataState(
    { predefinedQueryType },
    true,
    index,
  );

  const setCatalogUuid = (catalogUuid, index) => updateFormDataState(
    { catalogUuid },
    true,
    index,
  );

  const setCatalogTitle = (catalogTitle, index) => updateFormDataState(
    { catalogTitle },
    true,
    index,
  );

  const perLearnerCap = (perLearnerCapValue, index) => updateFormDataState(perLearnerCapValue, true, index);

  const setPerLearnerCap = (perLearnerCapAmount, index) => updateFormDataState(perLearnerCapAmount, true, index);

  const setPolicyType = (policyType, index) => updateFormDataState(policyType, true, index);

  const setHasEdits = (hasEditsBoolean) => updateRootDataState({ hasEdits: hasEditsBoolean });

  /**
   * Fetch all the catalogs for a given customer and store them in state for later display within a selector.
   *
   * @param {Object} invalidSubsidyFields - An object which maps field names to booleans which are true if the field is
   *   valid, e.g. { ...invalidSubsidyFields, subsidyRevReq: true }
   */
  const hydrateEnterpriseCatalogsData = useCallback(async (customerUuid) => {
    const { data } = await LmsApiService.fetchEnterpriseCustomerCatalogs({ customerUuid });
    setState(s => ({
      ...s,
      existingEnterpriseCatalogs: {
        data: camelCaseObject(data.results),
        isLoading: false,
      },
    }));
  }, [setState]);

  // Retrieve subsidy data
  const hydrateEnterpriseSubsidiesData = useCallback(async (subsidyUuid) => {
    const subsidyResponse = await getSubsidy(subsidyUuid);
    const subsidyData = subsidyResponse.data.results[0];
    const [customerResponse, policiesForCustomerResponse] = await Promise.all([
      getCustomer(subsidyData.enterprise_customer_uuid),
      getPolicies(subsidyData.enterprise_customer_uuid),
    ]);
    const customerData = customerResponse.data[0];
    const policiesResponseData = getPoliciesForSubsidy(policiesForCustomerResponse, subsidyUuid);
    const isMultipleFunds = policiesResponseData.length > 1;
    const catalogs = await Promise.all(policiesResponseData.map(async (policyData) => {
      const catalog = await getCatalog(policyData.catalog_uuid).then(error => error);
      return catalog;
    }));
    const policiesData = policiesResponseData.map(policy => {
      const formattedPolicies = [];
      const { queryIdToQueryType } = getPredefinedCatalogQueryMappings();

      catalogs.forEach(catalog => {
        if (catalog.uuid === policy.catalog_uuid) {
          const predefinedQueryType = queryIdToQueryType[catalog.enterprise_catalog_query];
          formattedPolicies.push({
            accountName: policy.display_name,
            accountDescription: policy.description,
            uuid: policy.uuid,
            policyType: policy.policy_type,
            // currency values ALWAYS stored in USD cents.
            accountValue: policy.spend_limit,
            // currency values ALWAYS stored in USD cents.
            perLearnerCapAmount: policy.per_learner_spend_limit,
            perLearnerCap: !!policy.per_learner_spend_limit,
            // Set both old and current catalog values to identical values, to start.
            // Old values should remain static and will help us later decide whether to skip catalog creation.
            oldPredefinedQueryType: predefinedQueryType,
            oldCustomCatalog: !predefinedQueryType,
            oldCatalogUuid: !predefinedQueryType ? catalog.uuid : undefined,
            // New values will change over time as different options are selected.
            predefinedQueryType,
            customCatalog: !predefinedQueryType,
            catalogUuid: !predefinedQueryType ? catalog.uuid : undefined,
            // We ostensibly don't rely on the catalog title for anything critical, but in case it is a custom catalog
            // we can cache the title here so that we have something to display in the detail view header.
            catalogTitle: catalog.title,
          });
        }
      });
      return Object.assign({}, ...formattedPolicies);
    });

    setState(s => ({
      ...s,
      formData: {
        ...s.formData,
        subsidyUuid,
        subsidyTitle: subsidyData?.title,
        customerName: customerData?.name,
        enterpriseUUID: customerData?.id,
        internalOnly: subsidyData?.internal_only,
        financialIdentifier: subsidyData?.reference_id,
        subsidyRevReq: subsidyData?.revenue_category,
        startDate: dayjs(subsidyData?.active_datetime).utc().format('YYYY-MM-DD'),
        endDate: dayjs(subsidyData?.expiration_datetime).utc().format('YYYY-MM-DD'),
        policies: policiesData,
        catalogs,
      },
      isEditMode: getConfig().FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION === 'true',
      showInvalidField: {
        ...s.showInvalidField,
        endDate: !!subsidyData?.active_datetime,
        financialIdentifier: !!subsidyData?.reference_id,
        multipleFunds: isMultipleFunds,
        startDate: !!subsidyData?.expiration_datetime,
        subsidyTitle: !!subsidyData?.title,
      },
      multipleFunds: isMultipleFunds,
      isLoading: false,
    }));
  }, [setState]);

  const resetFormData = useCallback(() => {
    setState(() => ({
      multipleFunds: undefined,
      formData: {
        policies: [],
      },
    }));
  }, [setState]);

  const resetInvalidFields = useCallback(() => {
    setState((s) => ({
      ...s,
      showInvalidField: {
        subsidy: {},
        policies: [],
      },
    }));
  });

  /**
   * Set whether or not a certain subsidy field is invalid.
   *
   * Notes:
   * - Important: true means valid, false means invalid.
   * - Under the hood, this updates attributes of `s.showInvalidField.subsidy`.
   *
   * @param {Object} invalidSubsidyFields - An object which maps field names to booleans which are true if the field is
   *   valid, e.g. { ...invalidSubsidyFields, subsidyRevReq: true }
   */
  const setInvalidSubsidyFields = (invalidSubsidyFields) => {
    updateShowInvalidFieldState({ subsidy: invalidSubsidyFields });
  };

  /**
   * Set whether or not a certain policy field is invalid.
   *
   * Notes:
   * - Important: true means valid, false means invalid.
   * - Under the hood, this updates attributes of `s.showInvalidField.policies[index]`.
   *
   * @param {Object} invalidPolicyFields - An object which maps field names to booleans which are true if the field is
   *   valid, e.g. { accountValue: true }
   * @param {Number} index - The policy index.
   */
  const setInvalidPolicyFields = (invalidPolicyFields, index) => {
    updateShowInvalidFieldState(invalidPolicyFields, true, index);
  };

  return {
    setMultipleFunds,
    hydrateEnterpriseCatalogsData,
    hydrateEnterpriseSubsidiesData,
    setCustomCatalog,
    setSubsidyTitle,
    setCustomerCatalog,
    instantiateMultipleFormData,
    resetPolicies,
    setCustomerUUID,
    setFinancialIdentifier,
    setStartDate,
    setEndDate,
    setSubsidyRevReq,
    setInternalOnly,
    setAccountName,
    setAccountValue,
    setAccountDescription,
    perLearnerCap,
    setPerLearnerCap,
    resetFormData,
    setAlertMessage,
    getCustomers,
    setInvalidSubsidyFields,
    setInvalidPolicyFields,
    resetInvalidFields,
    setHasEdits,
    setPolicyType,
    setPredefinedQueryType,
    setCatalogUuid,
    setCatalogTitle,
  };
}
