import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createContext } from 'use-context-selector';

export const ProvisioningContext = createContext(null);
const ProvisioningContextProvider = ({ children }) => {
  const contextValue = useState({
    customers: [],
    multipleFunds: undefined,
    customCatalog: false,
    alertMessage: undefined,
    catalogQueries: {
      data: [],
      isLoading: true,
    },
    formData: {
      policies: [],
    },
    showInvalidField: {
      subsidy: [],
      policies: [],
    },
    isEditMode: false,
    isLoading: true,
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
