import { useContextSelector } from 'use-context-selector';
import PropTypes from 'prop-types';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import snakeCase from 'lodash.snakecase';
import dayjs from './dayjs';
import { ProvisioningContext } from '../ProvisioningContext';
import LmsApiService from '../../../data/services/EnterpriseApiService';
import SubsidyApiService from '../../../data/services/SubsidyApiService';
import { isValidOpportunityProduct } from '../../../utils';
import { PREDEFINED_QUERY_DISPLAY_NAMES } from './constants';

export const indexOnlyPropType = {
  index: PropTypes.number.isRequired,
};

/**
 * Selects and returns the specified data attributes from the ProvisioningContext using the useContextSelector hook.
 *
 * @param {...string} args - The list of data attributes to retrieve from the ProvisioningContext.
 * @returns {Array} [Array] - An array of the specified data attributes from the ProvisioningContext.
 * @throws {Error} If no arguments are provided.
 */
export function selectProvisioningContext(...args) {
  if (args.length === 0) {
    throw new Error('No arguments provided to selectProvisioningContext');
  }
  return args
    .map(dataAttribute => useContextSelector(ProvisioningContext, v => v[0])[dataAttribute]);
}

/**
 * Updates a single policy attribute within an array of policies and returns a new array with the updated policies.
 *
 * @param {Object} data - The data object of the current data state.
 * @param {Object} newDataAttribute - The new data attribute to update policies with.
 * @param {Number} index - The index of the policy to update.
 * @returns {Array} [Array] - An array of the updated policies.
 */
export function updatePolicies(data, newDataAttribute, index) {
  const { policies } = data;
  policies[index] = {
    ...policies[index],
    ...newDataAttribute,
  };
  return [...policies];
}

/**
 * Takes values from formData on submission after preliminary failure of hasValidPolicyAndSubsidy function
 * and determines which fields are not valid, and sets an object in the context for setting the isInvalid UI states
 *
 * @param {Object} formData - values from formData state on submission
 * @returns {Array} - An array of subsidy and policy boolean value objects. `true` values means valid.
 */
export async function determineInvalidFields(formData) {
  const { policies } = formData;
  const allInvalidPolicyFields = [];
  let isValidEnterpriseUUID;
  if (formData?.enterpriseUUID?.length > 0) {
    const { data } = await LmsApiService.fetchEnterpriseCustomersBasicList(formData.enterpriseUUD);
    const filteredCustomer = data?.filter(customer => customer.id === formData.enterpriseUUID);
    isValidEnterpriseUUID = filteredCustomer.length === 1 && formData.enterpriseUUID === filteredCustomer[0].id;
  }
  const invalidSubsidyData = {
    subsidyTitle: !!formData.subsidyTitle,
    enterpriseUUID: !!formData.enterpriseUUID && isValidEnterpriseUUID,
    financialIdentifier: !!formData.financialIdentifier
    && isValidOpportunityProduct(formData.financialIdentifier)
    && formData.financialIdentifier.length === 18,
    startDate: !!formData.startDate && formData.endDate >= formData.startDate,
    endDate: !!formData.endDate && formData.endDate >= formData.startDate,
    subsidyRevReq: !!formData.subsidyRevReq,
    multipleFunds: !(formData.multipleFunds === undefined),
  };
  if (!invalidSubsidyData.multipleFunds || policies.length === 0) {
    return [invalidSubsidyData];
  }
  policies.forEach((policy) => {
    const {
      accountName,
      accountValue,
      predefinedQueryType,
      catalogUuid,
      perLearnerCap,
      perLearnerCapAmount,
      customCatalog,
      policyType,
    } = policy;
    const policyData = {
      accountName: !!accountName,
      accountValue: !!accountValue,
      // Either a predefined query type must be selected, or a catalog UUID is selected, depending on customCatalog.
      // When customCatalog is false, make sure predefinedQueryType is selected:
      predefinedQueryType: !customCatalog ? !!predefinedQueryType : true,
      // When customCatalog is true, make sure predefinedQueryType is selected:
      catalogUuid: customCatalog ? !!catalogUuid : true,
      perLearnerCap: perLearnerCap !== undefined || perLearnerCap === false,
      perLearnerCapAmount: !!perLearnerCapAmount || perLearnerCap === false,
      policyType: !!policyType,
    };
    allInvalidPolicyFields.push(policyData);
  });
  return [invalidSubsidyData, allInvalidPolicyFields];
}

/**
 * Checks all form data to ensure that all required fields are filled out,
 * but not the validity of each field value.
 *
 * @param {Object} formData - The form data object.
 * @returns {Boolean} - Returns true if all form data is valid, false otherwise.
 */
export function hasValidPolicyAndSubsidy(formData) {
  const { policies } = formData;

  // Check subsidy specific data
  const isEnterpriseUUIDValid = !!formData.enterpriseUUID;
  const isFinancialIdentifierValid = !!formData.financialIdentifier
    && isValidOpportunityProduct(formData.financialIdentifier)
    && formData.financialIdentifier.length === 18;
  const isDateRangeValid = !!formData.startDate && !!formData.endDate;
  const isRevReqValid = !!formData.subsidyRevReq;

  // Checks user defined values related to subsidy creation to determine validity
  const isSubsidyValid = isEnterpriseUUIDValid && isFinancialIdentifierValid
  && isDateRangeValid && isRevReqValid;

  // Check if there are any policies
  if (policies.length === 0) {
    return false;
  }
  const arePoliciesValid = policies.every(policy => {
    const isAccountNameValid = !!policy.accountName;
    const isAccountValueValid = !!policy.accountValue;

    const isCatalogDefined = policy.customCatalog ? !!policy.catalogUuid : !!policy.predefinedQueryType;

    // Requires learner cap to pass conditionals to be true
    const { perLearnerCap, perLearnerCapAmount } = policy;
    let isPerLearnerCapValid = false;
    if (perLearnerCap !== undefined) {
      if (!perLearnerCap) {
        isPerLearnerCapValid = true;
      } else if (perLearnerCap && perLearnerCapAmount && perLearnerCapAmount > 0) {
        isPerLearnerCapValid = true;
      }
    }
    // returns true if all fields are valid for every policy
    return isAccountNameValid && isAccountValueValid && isCatalogDefined && isPerLearnerCapValid;
  });

  // returns true if all fields are valid for subsidy fields and all policy fields
  return isSubsidyValid && arePoliciesValid;
}

/**
 * Gets or creates a new catalog for the specified valid enterprise customer.
 *
 * This is idempotent on [enterpriseCustomerUUID, catalogQueryID].
 *
 * @param {{
 *   enterpriseCustomerUuid: String,
 *   catalogQueryId: Number,
 *   title: String,
 * }} - The new catalog data.
 * @returns {{
 *   uuid: String,
 *   title: String,
 *   enterprise_catalog_query: Number,
 *   enterprise_customer: String,
 * }} - The newly created catalog where uuid is the catalog UUID.
 */
export async function getOrCreateCatalog({ enterpriseCustomerUuid, catalogQueryId, title }) {
  const { data } = await LmsApiService.postEnterpriseCustomerCatalog(
    enterpriseCustomerUuid,
    catalogQueryId,
    title,
  );
  return data;
}

/**
 * Extracts the budget display name from a policy form data object.
 * @returns {String} - The budget display name.
 */
export function generateBudgetDisplayName(policy) {
  const catalogQueryDisplayName = PREDEFINED_QUERY_DISPLAY_NAMES[policy?.predefinedQueryType];
  if (catalogQueryDisplayName) {
    return catalogQueryDisplayName;
  }
  if (policy?.customCatalog) {
    return 'Unique/Curated';
  }
  return null;
}

/**
 * Returns a camelCased version of the specified config attribute from the frontend-platform config.
 * With the introduction of runtime config, the config attribute can now support JSON objects.
 *
 * @param {String} attribute - The config attribute to retrieve.
 * @returns {Object} - The camelCased config attribute. Returns null if the attribute is not found.
 */
export function getCamelCasedConfigAttribute(attribute) {
  if (!attribute) {
    return null;
  }
  const camelCasedConfigurationObject = camelCaseObject(getConfig()[attribute]);
  if (camelCasedConfigurationObject) {
    return camelCasedConfigurationObject;
  }
  return null;
}

/**
 * Get bidirectional mappings between catalog query type enums and the database query IDs.
 * This is powered by the MFE config `PREDEFINED_CATALOG_QUERIES`.
 *
 * @returns {{
 * queryTypeToQueryId: Object,
 * queryIdToQueryType: Object,
 * }} Both mappings between query type and query ID.
 */
export function getPredefinedCatalogQueryMappings() {
  const queryTypeToQueryId = getCamelCasedConfigAttribute('PREDEFINED_CATALOG_QUERIES');
  const queryIdToQueryType = Object.fromEntries(Object.entries(queryTypeToQueryId).map(([key, value]) => [value, key]));
  return {
    queryTypeToQueryId,
    queryIdToQueryType,
  };
}

/**
 * Filter down to custom catalogs then sorts them from most to least recently modified.  The returned list of catalogs
 * will ultimately be used in the Unique/Curated catalog dropout selection.
 *
 * @param {Array} catalogs - Object array of enterprise catalogs.
 * @returns {Array} -  Catalogs sorted by most recently modified.
 */
export function sortedCustomCatalogs(allCatalogs) {
  if (!allCatalogs) {
    return null;
  }
  const { queryIdToQueryType } = getPredefinedCatalogQueryMappings();
  // Only include catalogs that are NOT predefined, i.e. only include the ones created by humans.
  const customCatalogs = allCatalogs.filter((catalog) => !([catalog.enterpriseCatalogQuery] in queryIdToQueryType));
  // Bump most recently modified catalogs to the top of the list.
  return customCatalogs.sort((a, b) => {
    if (a.modified < b.modified) {
      return 1;
    }
    if (a.modified > b.modified) {
      return -1;
    }
    return 0;
  });
}

/**
 *
 * @param {Array} fetchedData - The data fetched from the API
 * @param {Function} actionIcon - The icon to be displayed in the action column, passes the redirectURL function
 * @param {Function} redirectURL - The function to be called when the icon is clicked, redirects to passed UUID
 * @returns - The normalized data to be displayed in the table
 */
export function normalizeSubsidyDataTableData({ fetchedSubsidyData, fetchedCustomerData }) {
  if (fetchedSubsidyData.count === 0) {
    return fetchedSubsidyData;
  }
  const normalizedData = fetchedSubsidyData.results.map((item) => {
    const {
      enterpriseCustomerUuid,
      ...rest
    } = item;
    return {
      ...rest,
      enterpriseCustomerName: fetchedCustomerData.find(({ id }) => id === enterpriseCustomerUuid)?.name ?? '',
    };
  });
  return {
    ...fetchedSubsidyData,
    results: normalizedData,
  };
}

/**
 * Creates a new subsidy for the specified valid enterprise customer.
 *
 * @param {{
 * financialIdentifier: String,
 * title: String,
 * enterpriseCustomerUUID: String,
 * startDate: String,
 * endDate: String,
 * startingBalance: Number,
 * revenueCategory: String,
 * internalOnly: Boolean,
 * }} - Object fields required to create a new subsidy
 * @returns {{
 * uuid: String,
 * title: String,
 * enterprise_customer_uuid: String,
 * active_datetime: String,
 * expiration_datetime: String,
 * unit: String,
 * reference_type: String,
 * current_balance: Number,
 * starting_balance: Number,
 * internal_only: Boolean,
 * revenue_category: String
 * }} - Returns the 'data' response back where uuid is the subsidy uuid
 */
export async function createSubsidy({
  financialIdentifier,
  title,
  enterpriseCustomerUUID,
  startDate,
  endDate,
  startingBalance,
  revenueCategory,
  internalOnly,
}) {
  const { data } = await SubsidyApiService.postSubsidy(
    financialIdentifier,
    title,
    enterpriseCustomerUUID,
    startDate,
    endDate,
    startingBalance,
    revenueCategory,
    internalOnly,
  );
  return data;
}

/**
 * Updates an existing subsidy for the specified valid enterprise customer.
 *
 * @param {{
* title: String,
* startDate: String,
* endDate: String,
* revenueCategory: String,
* internalOnly: Boolean,
* }}
* @returns {
* data: {
* uuid: String,
* title: String,
* enterprise_customer_uuid: String,
* active_datetime: String,
* expiration_datetime: String,
* unit: String,
* reference_type: String,
* current_balance: Number,
* starting_balance: Number,
* internal_only: Boolean,
* revenue_category: String,
* },
* status: Number - status code,
* }
*/
export async function patchSubsidy({
  subsidyUuid,
  title,
  startDate,
  endDate,
  revenueCategory,
  internalOnly,
}) {
  const response = await SubsidyApiService.patchSubsidy(
    subsidyUuid,
    title,
    startDate,
    endDate,
    revenueCategory,
    internalOnly,
  );
  return response;
}

/**
 * Takes in the formData object from context, and transforms it into an object
 * that can be used to create a new subsidy.
 *
 * @param {Object} formData
 * @returns - Returns a subsidy data object that can be used to create a new subsidy
 */
export function transformSubsidyData(formData) {
  const { enterpriseUUID, financialIdentifier, internalOnly } = formData;
  const isoEndDate = new Date(formData.endDate).toISOString();
  const isoStartDate = new Date(formData.startDate).toISOString();
  const revenueCategory = formData.subsidyRevReq;
  let subsidyTitle = formData?.subsidyTitle || '';
  const startingBalance = formData.policies.reduce((acc, { accountValue }) => acc + parseInt(accountValue, 10), 0);
  if (subsidyTitle.length === 0) {
    if (formData.policies.length > 1) {
      formData.policies.forEach(async ({ accountName }, index) => {
        if (index === formData.policies.length - 1) {
          subsidyTitle += `${accountName.trim()}`;
        } else {
          subsidyTitle += `${accountName.trim()} --- `;
        }
      });
    } else {
      subsidyTitle = formData.policies[0].accountName.trim();
    }
  }
  return {
    enterpriseUUID,
    financialIdentifier,
    internalOnly,
    isoStartDate,
    isoEndDate,
    revenueCategory,
    startingBalance,
    subsidyTitle,
  };
}

/**
 * Creates a new policy for the specified valid enterprise customer,subsidy and catalog uuid.
 *
 * @param {{
 * description: String,
 * enterpriseCustomerUuid: String,
 * catalogUuid: String,
 * subsidyUuid: String,
 * perLearnerSpendLimit: Number,
 * spendLimit: Number,
 * accessMethod: String,
 * policyType: String,
 * }} - Object fields required to create a new policy
 * @returns {Promise<Object>} - Returns a promise that resolves to the response data from the API
 */
export async function createPolicy({
  displayName,
  description,
  enterpriseCustomerUuid,
  catalogUuid,
  subsidyUuid,
  perLearnerSpendLimit,
  spendLimit,
  accessMethod,
  policyType,
}) {
  const data = LmsApiService.postSubsidyAccessPolicy(
    displayName,
    description,
    enterpriseCustomerUuid,
    catalogUuid,
    subsidyUuid,
    perLearnerSpendLimit,
    spendLimit,
    accessMethod,
    policyType,
  );
  return data;
}

/**
 * Updates an existing policy for the specified valid enterprise customer,
 * subsidy and catalog uuid.
 *
 * @param {{
 * description: String,
 * catalogUuid: String,
 * subsidyUuid: String,
 * perLearnerSpendLimit: Number,
 * accessMethod: String,
 * }}
 * @returns {Promise<Object>} - Returns a promise that resolves to the response data from the API
 */
export async function patchPolicy({
  uuid,
  description,
  catalogUuid,
  perLearnerSpendLimit,
  accessMethod,
}) {
  const data = LmsApiService.patchSubsidyAccessPolicy({
    uuid,
    description,
    catalogUuid,
    perLearnerSpendLimit,
    accessMethod,
  });
  return data;
}

/**
 * Converts the amount from USD cents to dollars
 * @param {Number} usdCents - The amount in USD cents (e.g. 6000)
 * @returns - Returns the converted amount (e.g. $60)
 */
export const formatCurrency = (usdCents) => {
  const centsToDollarConversion = usdCents / 100;
  const currencyUS = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });
  return currencyUS.format(centsToDollarConversion);
};

/**
 * Takes the response of catalog creation, the response of subsidy creation and the formData object from context
 * to create an array of policy data objects that can be used to create new policies.
 *
 * @param {Object} formData - The formData object from context
 * @param {Object} catalogCreationResponse - The response from the catalog creation API
 * @param {Object} subsidyCreationResponse - The response from the subsidy creation API
 * @returns - Returns an array of policy data objects that can be used to create new policies
 */
export function transformPolicyData(formData, catalogCreationResponses, subsidyCreationResponse) {
  const { enterpriseUUID, policies } = formData;
  if (
    policies.length === 0
    || catalogCreationResponses.length === 0
    || subsidyCreationResponse.length === 0
  ) { return []; }
  const payloads = policies.map((policy, index) => ({
    displayName: policy.accountName,
    description: (
      policy.accountDescription?.length > 0
        ? policy.accountDescription
        : (
          `Initial Policy Display Name: ${policy.accountName}, `
          + `Initial Policy Value: ${formatCurrency(policy.accountValue)}, `
          + `Initial Subsidy Value: ${formatCurrency(subsidyCreationResponse[0].current_balance)}`
        )
    ),
    enterpriseCustomerUuid: enterpriseUUID,
    // By the time that this function is run, one of the following will be true:
    // 1. A custom catalog was selected, and policy.catalogUuid represents the custom catalog selection.
    // 2. A predefined catalog query was selected, and catalogCreationResponses[index] represents a managed catalog.
    catalogUuid: catalogCreationResponses[index]?.uuid || policy.catalogUuid,
    subsidyUuid: subsidyCreationResponse[0].uuid,
    perLearnerSpendLimit: policy.perLearnerCap ? policy.perLearnerCapAmount : null,
    spendLimit: policy.accountValue,
    policyType: policy.policyType,
    accessMethod: policy.accessMethod,
  }));
  return payloads;
}

/**
 * Takes the response of updated catalog and the formData object from context
 * to create an array of policy data objects that can be used to update the policies.
 *
 * @param {Object} formData - The formData object from context
 * @returns - Returns an array of policy payload objects that can be used to update policies
 */
export function transformPatchPolicyPayload(formData, catalogCreationResponses) {
  const { subsidyUuid, policies } = formData;
  if (
    policies.length === 0
    || catalogCreationResponses.length === 0
    || !subsidyUuid
  ) { return []; }
  const payloads = policies.map((policy, index) => ({
    uuid: policy.uuid,
    // TODO: If we add support for customizable display names, we'll need to uncomment this.
    // displayName: policy.accountName,
    description: policy.accountDescription,
    // By the time that this function is run, one of the following will be true:
    // 1. A custom catalog was selected, and policy.catalogUuid represents the custom catalog selection.
    // 2. A predefined catalog query was selected, and catalogCreationResponses[index] represents a managed catalog.
    catalogUuid: catalogCreationResponses[index]?.uuid || policy.catalogUuid,
    subsidyUuid,
    perLearnerSpendLimit: policy.perLearnerCap ? policy.perLearnerCapAmount : null,

    // The spendLimit is currently NOT EDITABLE so do not include it in the PATCH payload.
    // spendLimit: policy.accountValue,

    // The policyType and accessMethod is currently NOT EDITABLE so do not include it in the PATCH payload.
    // policyType: policy.policyType,
    // accessMethod: policy.accessMethod,
  }));
  return payloads;
}

/**
 * Takes in the catalog query data and a string to perform an `indexOf` filter the catalog query data `title` field.
 *
 * @param {Object} data - The catalog query data
 * @param {String} filteredBy - The string to filter the catalog query data by
 * @returns - Returns the filtered catalog query data
 */
export function filterIndexOfCatalogQueryTitle(catalogQueries, filteredBy) {
  const camelCasedData = camelCaseObject(catalogQueries);
  if (typeof filteredBy === 'string' && camelCasedData.length > 0 && camelCasedData[0]?.title) {
    return camelCasedData.filter(({ title }) => title.indexOf(filteredBy) !== 0);
  }
  return camelCasedData;
}

/**
 * Autogenerates the policy name based on form data.  intended for use as the policy record display_name field.
 * @param {Object} formData - The formData object from context
 * @param {Number} index - The index of the associated policy
 * @returns - Returns a string that can be used as the policy display name.
 */
export function generatePolicyName(formData, index) {
  const { subsidyTitle, policies } = formData;
  const budgetDisplayName = generateBudgetDisplayName(policies[index]);
  if (budgetDisplayName) {
    return `${subsidyTitle} --- ${budgetDisplayName}`;
  }
  return null;
}

// Start of Datatable functions

/**
 * Takes a date string and returns a date string in the format of MM-DD-YYYY
 * @param {String} date - The date string to be transformed
 * @returns - Returns a date string in the format of MM-DD-YYYY
 */
export function transformDatatableDate(date) {
  if (!date) {
    return null;
  }
  return dayjs(date).utc().format('M-DD-YYYY');
}

/**
 * Destructures `filters` from datatable context prop that builds and returns an
 * object used to build the URLSearchParams for subsidies
 * @param {Object} filters - The filter object from the datatable
 * @returns - Returns an object that can be used to filter the API response
 */
export function transformDataTableData({ filters }) {
  const filterObj = {};
  if (filters.length > 0) {
    filters.forEach((filterItem) => {
      filterObj[filterItem.id] = filterItem.value;
    });
  }
  return filterObj;
}

/**
 * Destructures `sortBy` from datatable context prop and returns
 * a string used to build the URLSearchParams for subsidies
 * @param {Object} sortBy - The sort object from the datatable
 * @returns - Returns a string that can be used to sort the API response
 */
export function sortDataTableData({ sortBy }) {
  const sortByObject = sortBy[0];
  if (!sortByObject) {
    return null;
  }
  let sortString = sortByObject.id;
  if (sortString === 'isActive') {
    sortString = 'expirationDatetime';
  }
  sortString = snakeCase(sortString);
  sortString = sortByObject.desc ? `-${sortString}` : sortString;
  return sortString;
}

/**
 * Filters the enterpriseCustomerName from the fetchedCustomerData and returns the enterpriseCustomerUuid
 * @param {Object} fetchedCustomerData - The fetchedCustomerData from the API
 * @param {Object} filterBy - The filter object from the datatable
 * @returns - Returns the enterpriseCustomerUuid
 */
export function filterByEnterpriseCustomerName({ fetchedCustomerData, filterBy }) {
  const filteredData = filterBy;
  if (filterBy.enterpriseCustomerName) {
    const enterpriseUUID = fetchedCustomerData.filter(
      customer => customer.name.toLowerCase().includes(filterBy.enterpriseCustomerName.toLowerCase()),
    )[0]?.id;
    if (enterpriseUUID) {
      filteredData.enterpriseCustomerUuid = enterpriseUUID;
    }
    delete filteredData.enterpriseCustomerName;
  }
  return filteredData;
}
// End of Datatable functions

export async function getSubsidy(subsidyUuid) {
  const response = await SubsidyApiService.fetchSingleSubsidy(subsidyUuid);
  return response;
}

export async function getCustomer(customerUuid) {
  const response = await LmsApiService.fetchEnterpriseCustomersBasicList(customerUuid);
  return response;
}

export async function getPolicies(customerUuid) {
  const response = await LmsApiService.fetchSubsidyAccessPolicies(customerUuid);
  return response;
}

/**
 * Retrieve one catalog from the LMS/Enterprise API.
 * @param {Number} catalogUuid - UUID of the single catalog to fetch.
 * @returns - An object representing the requested catalog, or undefined if not found.
 */
export async function getCatalog(catalogUuid) {
  const response = await LmsApiService.fetchEnterpriseCustomerCatalogs({ catalogUuid }).catch((e) => {
    throw e;
  });
  if (response?.data?.results?.length === 1) {
    return response.data.results[0];
  }
  return undefined;
}

/**
 * Given an API response for listing all policies for a given customer, further filter the results down to just the
 * policies for the given subsidy.
 * @param {Number} policiesForCustomerResponse - The API response for listing policies for a given customer.
 * @param {Number} subsidyUuid - The specific subsidy to which the returned policies relate.
 * @returns - List of policy data objects which all relate to the given subsidyUuid.
 */
export function getPoliciesForSubsidy(policiesForCustomerResponse, subsidyUuid) {
  const allPoliciesData = policiesForCustomerResponse.data.results;
  return allPoliciesData.filter(policy => policy.subsidy_uuid === subsidyUuid);
}
