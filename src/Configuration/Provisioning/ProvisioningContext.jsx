import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createContext } from 'use-context-selector';

export const ProvisioningContext = createContext(null);
const ProvisioningContextProvider = ({ children }) => {
  const contextValue = useState({
    customers: [],
    // `multipleFunds` = true means the user has selected the option to split the spend into two budgets.
    multipleFunds: undefined,
    alertMessage: undefined,
    // `existingEnterpriseCatalogs` is a local cache of all existing catalogs belonging to the enterprise customer which
    // pertains to this subsidy/plan.  When the custom/unique/curated catalog option is selected, values in this object
    // will appear in a drop-down list for the user to select.
    existingEnterpriseCatalogs: {
      data: [],
      isLoading: true,
    },
    formData: {
      // `policies` is a list of all policies/budgets inputs for this plan. After form completion, length should be 1 if
      // multipleFunds = false, and 2 and multipleFunds = true.
      policies: [],
      // `internalOnly` backs the "Test plan" checkbox.  A true value means the plan will not be customer facing.
      internalOnly: false,
    },
    // `showInvalidField` indicates when form fields are valid/invalid, possibly triggering invalid attributes to be set
    // on various form field containers.
    showInvalidField: {
      // `subsidy` contains a mapping of subsidy form fields to boolean (true means valid).
      subsidy: {},
      // `policies` contains a list of mappings of policy form fields to boolean (true means valid), one mapping per
      // policy.
      policies: [],
    },
    // `isEditMode` = true means we're viewing a plan, and we're allowed to edit it.
    isEditMode: false,
    isLoading: true,
    // `hasEdits` = true means we're editing a plan, and at least one field has been edited.
    hasEdits: false,
  });

  return (
    <ProvisioningContext.Provider value={contextValue}>
      {children}
    </ProvisioningContext.Provider>
  );
};

ProvisioningContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProvisioningContextProvider;
