import { useContextSelector } from 'use-context-selector';
import PropTypes from 'prop-types';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { ProvisioningContext } from '../ProvisioningContext';
import LmsApiService from '../../../data/services/EnterpriseApiService';

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
 * @param {Object} formData - The form data object.
 * @returns {Boolean} - Returns true if all form data is valid, false otherwise.
 */
export function hasValidPolicyAndSubidy(formData) {
  const { policies } = formData;

  // Check subsidy specific data
  const isEnterpriseUUIDValid = !!formData.enterpriseUUID;
  const isFinancialIdentifierValid = !!formData.financialIdentifier;
  const isDateRangeValid = !!formData.startDate && !!formData.endDate;
  const isInternalOnlyValid = !!formData.internalOnly;
  const isRevReqValid = !!formData.subsidyRevReq;

  const isSubsidyValid = isEnterpriseUUIDValid && isFinancialIdentifierValid
  && isDateRangeValid && isInternalOnlyValid && isRevReqValid;
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
 * @param {{
 * enterpriseCustomerUUID: string,
 * catalogQueryUUID: Number,
 * title: string
 * }} - The new catalog data.
 * @returns {{
 * uuid: string,
 * title: string,
 * catalogQueryUUID: Number,
 * enterpriseCustomerUUID: string
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
 * Splitting on ' account' for the case with multiple catalog queries, where the title
 * of each individual 'Policy' form data is `${title} account`
 * @param {Object} policy - The policy object.
 * @returns {String} - The catalog title.
 */
export function extractDefinedCatalogTitle(policy) {
  if (!policy || !policy?.catalogQueryTitle) {
    return null;
  }
  if (policy.catalogQueryTitle.includes(' account')) {
    return policy.catalogQueryTitle.split(' account')[0];
  }
  return null;
}

/**
 * Returns a camelCased version of the specified config attribute from the frontend-platform config.
 * With the introduction of runtime config, the config attribute can now support JSON objects.
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
