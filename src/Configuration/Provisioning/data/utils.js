import { useContextSelector } from 'use-context-selector';
import PropTypes from 'prop-types';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { ProvisioningContext } from '../ProvisioningContext';
import LmsApiService from '../../../data/services/EnterpriseApiService';
import SubsidyApiService from '../../../data/services/SubsidyApiService';
import { splitStringBudget } from './constants';
import { isValidOpportunityProduct } from '../../../utils';

export const indexOnlyPropType = {
  index: PropTypes.number.isRequired,
};

/**
 * Given an enterpriseUUID is passed to the 'queryBy' function, it will return url
 * with a query parameter 'q' that is a substring of the enterpriseUUID (first 7 characters).
 *
 * @param {string} enterpriseCustomerUUID - The UUID of the enterprise customer.
 * @returns {string} - The url to query the LMS for the customer catalog.
 */
export const lmsCustomerCatalog = {
  queryBy: (enterpriseCustomerUUID) => {
    if (enterpriseCustomerUUID) {
      return `/admin/enterprise/enterprisecustomercatalog/?q=${enterpriseCustomerUUID.slice(0, 7)}`;
    }
    return '/admin/enterprise/enterprisecustomercatalog/';
  },
};

/**
 * Sorts an array of catalog queries by most recently modified date
 *
 * @param {Array} catalogQueries - Object array of catalog queries
 * @returns {Array} - Sorted catalog queries by most recently modified
 */
export function sortedCatalogQueries(catalogQueries) {
  return catalogQueries.sort((b, a) => {
    if (a.modified < b.modified) {
      return -1;
    }
    if (a.modified > b.modified) {
      return 1;
    }
    return 0;
  });
}

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
 * Takes values from formData on submission after preliminary failure of hasValidPolicyAndSubidy function
 * and determines which fields are not valid, and sets an object in the context for setting the isInvalid UI states
 * @param {Object} formData - values from formData state on submission
 * @returns {Array}  An array of subsidy and policy boolean value objects
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
      accountName, accountValue, catalogQueryMetadata, perLearnerCap, perLearnerCapAmount,
    } = policy;
    const policyData = {
      accountName: !!accountName,
      accountValue: !!accountValue,
      catalogQueryMetadata: !!catalogQueryMetadata?.catalogQuery?.id,
      perLearnerCap: perLearnerCap !== undefined || perLearnerCap === false,
      perLearnerCapAmount: !!perLearnerCapAmount || perLearnerCap === false,
    };
    allInvalidPolicyFields.push(policyData);
  });
  return [invalidSubsidyData, allInvalidPolicyFields];
}

/**
 * Checks all form data to ensure that all required fields are filled out,
 * but not the individual validity of each field.
 *
 * @param {Object} formData - The form data object.
 * @returns {Boolean} - Returns true if all form data is valid, false otherwise.
 */
export function hasValidPolicyAndSubidy(formData) {
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

    // Requires both an id and title to be valid
    const isCatalogQueryValid = !!policy.catalogQueryMetadata?.catalogQuery?.id
    && !!policy.catalogQueryMetadata?.catalogQuery?.title;

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
    return isAccountNameValid && isAccountValueValid && isCatalogQueryValid && isPerLearnerCapValid;
  });

  // returns true if all fields are valid for subsidy fields and all policy fields
  return isSubsidyValid && arePoliciesValid;
}

/**
 * Creates a new catalog for the specified valid enterprise customer.
 *
 * @param {{
 * enterpriseCustomerUUID: String,
 * catalogQueryUUID: Number,
 * title: String
 * }} - The new catalog data.
 * @returns {{
 * uuid: String,
 * title: String,
 * catalogQueryUUID: Number,
 * enterpriseCustomerUUID: String
 * }} - The newly created catalog where uuid is the catalog UUID.
 */
export async function createCatalogs({ enterpriseCustomerUUID, catalogQueryUUID, title }) {
  const { data } = await LmsApiService.postEnterpriseCustomerCatalog(
    enterpriseCustomerUUID,
    catalogQueryUUID,
    title,
  );
  return data;
}

/**
 * Extracts the catalog title from the catalogQueryTitle field of a policy.
 * Splitting on ' budget' for the case with multiple catalog queries, where the title
 * of each individual 'Policy' form data is `${title} account`
 *
 * @param {Object} policy - The policy object.
 * @returns {String} - The catalog title.
 */
export function extractDefinedCatalogTitle(policy) {
  if (policy?.catalogQueryMetadata?.catalogQuery) {
    return policy?.catalogQueryMetadata?.catalogQuery.title;
  }
  if (policy?.catalogQueryTitle?.includes(splitStringBudget)) {
    return policy.catalogQueryTitle.split(splitStringBudget)[0];
  }
  if (!policy || !policy?.catalogQueryTitle) {
    return null;
  }
  return '';
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
 *
 * @param {Array} fetchedData - The data fetched from the API
 * @param {Function} actionIcon - The icon to be displayed in the action column, passes the redirectURL function
 * @param {Function} redirectURL - The function to be called when the icon is clicked, redirects to passed UUID
 * @returns - The normalized data to be displayed in the table
 */
export function normalizeSubsidyDataTableData({ fetchedSubsidyData, fetchedCustomerData }) {
  if (fetchedSubsidyData.count === 0) {
    return {
      ...fetchedSubsidyData,
      results: [],
    };
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
  const revenueCategory = formData.subsidyRevReq.includes('bulk')
    ? 'bulk-enrollment-prepay'
    : 'partner-no-rev-prepay';
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
 * spendLimit: Number
 * }} - Object fields required to create a new policy
 * @returns {Promise<Object>} - Returns a promise that resolves to the response data from the API
 */
export async function createPolicy({
  description,
  enterpriseCustomerUuid,
  catalogUuid,
  subsidyUuid,
  perLearnerSpendLimit,
  spendLimit,
}) {
  const data = LmsApiService.postSubsidyAccessPolicy(
    description,
    enterpriseCustomerUuid,
    catalogUuid,
    subsidyUuid,
    perLearnerSpendLimit,
    spendLimit,
  );

  return data;
}

/**
 * Takes the response of catalog creation, the response of subsidy creation and the formData object from context
 * to create an array of policy data objects that can be used to create new policies.
 *
 * @param {Object} formData - The formData object from context
 * @param {Object} catalogCreationResponse - The response from the catalog creation API
 * @param {Object} subsidyCreationResponse - The response from the subsidy creation API
 * @returns - Returns an array of policy data objects that can be used to create new policies
 */
export function transformPolicyData(formData, catalogCreationResponse, subsidyCreationResponse) {
  const { enterpriseUUID, policies } = formData;
  if (
    policies.length === 0
    || catalogCreationResponse.length === 0
    || subsidyCreationResponse.length === 0
  ) { return []; }
  const payloads = policies.map((policy, index) => ({
    description: policy.accountDescription?.length > 0
      ? policy.accountDescription
      : `${policy.accountName}, Initial Policy Value: $${policy.accountValue}, Initial Subsidy Value: $${policies.reduce((acc, { accountValue }) => acc + parseInt(accountValue, 10), 0)}`,
    enterpriseCustomerUuid: enterpriseUUID,
    catalogUuid: catalogCreationResponse[0][index].uuid,
    subsidyUuid: subsidyCreationResponse[0].uuid,
    perLearnerSpendLimit: policy.perLearnerCap ? parseInt(policy.perLearnerCapAmount, 10) * 100 : null,
    spendLimit: parseInt(policy.accountValue, 10) * 100,
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
 * Autogenerates the policy name based on the subsidy title and the catalog query title.
 * @param {Object} formData - The formData object from context
 * @param {Number} index - The index of the associated policy
 * @returns - Returns a string that can be used as the policy name
 */
export function generatePolicyName(formData, index) {
  const { subsidyTitle, policies } = formData;
  return `${subsidyTitle} --- ${extractDefinedCatalogTitle(policies[index])}`;
}

// Start of Datatable functions

/**
 * Takes a date string and returns a date string in the format of MM-DD-YYYY
 * @param {String} date - The date string to be transformed
 * @returns - Returns a date string in the format of MM-DD-YYYY
 */
export function transformDatatableDate(date) {
  if (date) {
    return new Date(date).toLocaleDateString().replace(/\//g, '-');
  }
  return null;
}

/**
 * Takes the filter object from the datatable and returns an object that can be used to filter the API response
 * @param {Object} filters - The filter object from the datatable
 * @returns - Returns an object that can be used to filter the API response
 */
export function filterDatatableData({ filters }) {
  const filterObj = {};
  if (filters.length > 0) {
    filters.forEach((filterItem) => {
      filterObj[filterItem.id] = filterItem.value;
    });
  }
  return filterObj;
}

/**
 * Takes the sort object from the datatable and returns a string that can be used to sort the API response
 * @param {Object} sortBy - The sort object from the datatable
 * @returns - Returns a string that can be used to sort the API response
 */
export function sortDatatableData({ sortBy }) {
  if (sortBy[0]?.id) {
    if (sortBy[0].id === 'isActive') {
      return sortBy[0].desc ? '-expirationDatetime' : 'expirationDatetime';
    }
    return sortBy[0].desc ? `-${sortBy[0].id}` : sortBy[0].id;
  }
  return null;
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
