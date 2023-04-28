import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createContext } from 'use-context-selector';

export const DashboardContext = createContext(null);
const DashboardContextProvider = ({ children }) => {
  const contextValue = useState({
    enterpriseSubsidies: [],
  });

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

DashboardContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardContextProvider;
