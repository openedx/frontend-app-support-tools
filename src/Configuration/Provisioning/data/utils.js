import { useContextSelector } from 'use-context-selector';
import { ProvisioningContext } from '../ProvisioningContext';

/**
 * Selects and returns the specified data attributes from the ProvisioningContext using the useContextSelector hook.
 * @param {...string} args - The list of data attributes to retrieve from the ProvisioningContext.
 * @returns {Array} [Array] - An array of the specified data attributes from the ProvisioningContext.
 * @throws {Error} If no arguments are provided.
 */
export default function selectProvisioningContext(...args) {
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
