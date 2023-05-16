import { useContextSelector } from 'use-context-selector';
import PropTypes from 'prop-types';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { ProvisioningContext } from '../ProvisioningContext';
import LmsApiService from '../../../data/services/EnterpriseApiService';
import SubsidyApiService from '../../../data/services/SubsidyApiService';
import { splitStringBudget } from './constants';

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
  const isFinancialIdentifierValid = !!formData.financialIdentifier;
  const isDateRangeValid = !!formData.startDate && !!formData.endDate;
  const isRevReqValid = !!formData.subsidyRevReq;

  const isSubsidyValid = isEnterpriseUUIDValid && isFinancialIdentifierValid
  && isDateRangeValid && isRevReqValid;
  // Check policy specific data
  if (policies.length === 0) {
    return false;
  }
  const arePoliciesValid = policies.every(policy => {
    const isAccountNameValid = !!policy.accountName;
    const isAccountValueValid = !!policy.accountValue;
    const isCatalogQueryValid = !!policy.catalogQueryMetadata?.catalogQuery?.id
    && !!policy.catalogQueryMetadata?.catalogQuery?.title;
    const { perLearnerCap, perLearnerCapAmount } = policy;
    let isPerLearnerCapValid = false;
    if (perLearnerCap !== undefined) {
      if (!perLearnerCap) {
        isPerLearnerCapValid = true;
      } else if (perLearnerCap && perLearnerCapAmount && perLearnerCapAmount > 0) {
        isPerLearnerCapValid = true;
      }
    }
    return isAccountNameValid && isAccountValueValid && isCatalogQueryValid && isPerLearnerCapValid;
  });
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
  if (!policy || !policy?.catalogQueryTitle) {
    return null;
  }
  if (policy.catalogQueryTitle.includes(splitStringBudget)) {
    return policy.catalogQueryTitle.split(splitStringBudget)[0];
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
export function createPolicy({
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
  const payloads = policies.map((policy, index) => ({
    description: `This policy created for subsidy ${subsidyCreationResponse[0].uuid} with ${policies.length} associated policies`,
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
