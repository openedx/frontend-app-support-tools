import { useContextSelector } from 'use-context-selector';
import { ProvisioningContext } from '../ProvisioningContext';

export const lmsCustomerCatalog = {
  queryBy: (enterpriseCustomerUUID) => {
    if (enterpriseCustomerUUID) {
      return `/admin/enterprise/enterprisecustomercatalog/?q=${enterpriseCustomerUUID.slice(0, 7)}`;
    }
    return '/admin/enterprise/enterprisecustomercatalog/';
  },
};

// Takes an array of catalog queries and sorted them by last modified date (newest first)
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
