import { useCallback } from 'react';
import { useContextSelector } from 'use-context-selector';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import dayjs from 'dayjs';
import LmsApiService from '../../../data/services/EnterpriseApiService';
import PROVISIONING_PAGE_TEXT, {
  INITIAL_CATALOG_QUERIES,
  MAX_PAGE_SIZE,
  CATALOG_QUERIES,
  splitStringBudget,
} from './constants';
import { ProvisioningContext } from '../ProvisioningContext';
import {
  updatePolicies,
  getCamelCasedConfigAttribute,
  getCatalogs,
  getCatalogUuid,
  getCatalogQueries,
  getCustomer,
  getPolicies,
  getSubsidy,
  normalizeSubsidyDataTableData,
  filterIndexOfCatalogQueryTitle,
  filterByEnterpriseCustomerName,
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

  const setCustomCatalog = (customCatalogBoolean) => updateRootDataState({ customCatalog: customCatalogBoolean });

  const instantiateMultipleFormData = (multipleFunds) => {
    const { multipleQueries, defaultQuery } = INITIAL_CATALOG_QUERIES;
    const { FORM } = PROVISIONING_PAGE_TEXT;
    const camelCasedQueries = getCamelCasedConfigAttribute('PREDEFINED_CATALOG_QUERIES');

    if (multipleFunds) {
      const multipleFormData = multipleQueries?.map((query, index) => ({
        ...query,
        catalogQueryMetadata: {
          catalogQuery: {
            id: camelCasedQueries[Object.keys(FORM.ACCOUNT_TYPE.OPTIONS)[index]],
            title: Object.values(FORM.ACCOUNT_TYPE.OPTIONS)[index],
          },
        },
      }));
      updateFormDataState({ policies: multipleFormData });
      return;
    }
    updateFormDataState({ policies: defaultQuery });
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

  const setCatalogQueryCategory = (catalogCategory, index) => updateFormDataState(catalogCategory, true, index);

  const setCatalogQuerySelection = (catalogSelection, index) => updateFormDataState(catalogSelection, true, index);

  const perLearnerCap = (perLearnerCapValue, index) => updateFormDataState(perLearnerCapValue, true, index);

  const setPerLearnerCap = (perLearnerCapAmount, index) => updateFormDataState(perLearnerCapAmount, true, index);

  const hydrateCatalogQueryData = useCallback(async () => {
    const { data } = await LmsApiService.fetchEnterpriseCatalogQueries();
    const learnerCreditPrefix = '[DO NOT ALTER][LEARNER CREDIT]';
    const filteredCatalogQueries = filterIndexOfCatalogQueryTitle(data.results, learnerCreditPrefix);

    setState(s => ({
      ...s,
      catalogQueries: {
        ...s.catalogQueries,
        data: filteredCatalogQueries,
        isLoading: false,
      },
    }));
  });

  // Retrieve subsidy data
  const hydrateEnterpriseSubsidiesData = useCallback(async (subsidyUuid) => {
    const { FORM: { SUBSIDY_TYPE } } = PROVISIONING_PAGE_TEXT;

    const selections = {
      'partner-no-rev-prepay': SUBSIDY_TYPE.OPTIONS.no,
      'bulk-enrollment-prepay': SUBSIDY_TYPE.OPTIONS.yes,
    };
    const subsidyResponse = await getSubsidy(subsidyUuid);
    const subsidyCustomerId = subsidyResponse.data.results[0].enterprise_customer_uuid;
    const [customer, policies] = await Promise.all([
      getCustomer(subsidyCustomerId), getPolicies(subsidyCustomerId),
    ]);
    const catalogUuids = getCatalogUuid(policies, subsidyUuid);
    const isMultipleFunds = policies.data.results.filter(policy => policy.subsidy_uuid === subsidyUuid).length > 1;

    let catalogs;
    if (catalogUuids !== undefined) {
      catalogs = await Promise.all(catalogUuids.map(async (catalogUuid) => {
        const catalog = await getCatalogs(catalogUuid);
        return Object.assign({}, ...catalog.data.results);
      }));
    }
    const catalogQueries = await getCatalogQueries();

    let customCatalog;
    const policiesData = policies.data.results.filter(policy => policy.subsidy_uuid === subsidyUuid).map(policy => {
      let catalogCategoryTitle;
      const formattedPolicies = [];

      catalogs.forEach(catalog => {
        if (catalog.uuid === policy.catalog_uuid) {
          [, catalogCategoryTitle] = catalog.title.split(' - ');
          let catalogQuery;
          // this check is to identify subsidies that either have:
          // 1) multiple plans
          // 2) single plan
          // 3) single plan with custom catalog
          if (isMultipleFunds) {
            catalogQuery = {
              id: CATALOG_QUERIES[catalogCategoryTitle].id,
              title: catalogCategoryTitle,
              catalogUuid: catalog.uuid,
            };
          } else if (catalogCategoryTitle.includes('budget')) {
            catalogQuery = {
              id: CATALOG_QUERIES[`${catalogCategoryTitle} budget`]?.id,
              title: catalogCategoryTitle.split(splitStringBudget)[0],
              catalogUuid: catalog.uuid,
            };
          } else {
            catalogQuery = Object.assign(
              {},
              ...camelCaseObject(
                catalogQueries.results.filter(query => catalogCategoryTitle === query.title),
              ),
            );
            customCatalog = true;
          }

          formattedPolicies.push({
            accountDescription: policy.description,
            accountValue: policy.spend_limit,
            uuid: policy.uuid,
            catalogQueryTitle: isMultipleFunds ? catalogCategoryTitle : 'Budget',
            // Need to divide by 100 to convert amount in cents to dollar
            perLearnerCapAmount: policy.per_learner_spend_limit / 100,
            perLearnerCap: !!policy.per_learner_spend_limit,
            catalogQueryMetadata: {
              catalogQuery,
            },
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
        subsidyTitle: subsidyResponse.data.results[0]?.title,
        customerName: customer.data[0]?.name,
        customerUuid: customer.data[0]?.id,
        enterpriseUUID: `${customer.data[0]?.name} --- ${customer.data[0]?.id}`,
        internalOnly: subsidyResponse.data.results[0]?.internal_only,
        financialIdentifier: subsidyResponse.data.results[0]?.reference_id,
        subsidyRevReq: selections[subsidyResponse.data.results[0]?.revenue_category],
        startDate: dayjs(subsidyResponse.data.results[0]?.active_datetime).format('YYYY-MM-DD'),
        endDate: dayjs(subsidyResponse.data.results[0]?.expiration_datetime).format('YYYY-MM-DD'),
        policies: policiesData,
        catalogs,
      },
      isEditMode: getConfig().FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION === 'true',
      showInvalidField: {
        ...s.showInvalidField,
        endDate: !!subsidyResponse.data.results[0]?.active_datetime,
        financialIdentifier: !!subsidyResponse.data.results[0]?.reference_id,
        multipleFunds: isMultipleFunds,
        startDate: !!subsidyResponse.data.results[0]?.expiration_datetime,
        subsidyTitle: !!subsidyResponse.data.results[0]?.title,
      },
      multipleFunds: isMultipleFunds,
      customCatalog,
      isLoading: false,
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

  const resetInvalidFields = useCallback(() => {
    setState((s) => ({
      ...s,
      showInvalidField: {
        subsidy: [],
        policies: [],
      },
    }));
  });

  const setInvalidSubsidyFields = (subsidy) => updateShowInvalidFieldState({ subsidy });

  const setInvalidPolicyFields = (policy, index) => updateShowInvalidFieldState(policy, true, index);

  return {
    setMultipleFunds,
    hydrateCatalogQueryData,
    hydrateEnterpriseSubsidiesData,
    setCustomCatalog,
    setSubsidyTitle,
    setCustomerCatalog,
    setCatalogQuerySelection,
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
    setCatalogQueryCategory,
    perLearnerCap,
    setPerLearnerCap,
    resetFormData,
    setAlertMessage,
    getCustomers,
    setInvalidSubsidyFields,
    setInvalidPolicyFields,
    resetInvalidFields,
  };
}
