import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createContext } from 'use-context-selector';

export const ProvisioningContext = createContext(null);

const ProvisioningContextProvider = ({ children }) => {
  const contextValue = useState({
    multipleFunds: undefined,
    customCatalog: false,
    formData: {
      policies: [],
    },
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
