import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createContext } from 'use-context-selector';
import PROVISIONING_PAGE_TEXT from './data/constants';

export const ProvisioningContext = createContext(null);
const ProvisioningContextProvider = ({ children }) => {
  const { ALERTS } = PROVISIONING_PAGE_TEXT.FORM;
  const contextValue = useState({
    multipleFunds: undefined,
    customCatalog: false,
    alertMessage: ALERTS.unselectedAccountType,
    catalogQueries: {
      data: [],
      isLoading: true,
    },
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
