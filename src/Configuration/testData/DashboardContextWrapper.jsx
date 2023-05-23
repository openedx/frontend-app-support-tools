import { IntlProvider } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { DashboardContext as NextedDashboardContext } from '../Provisioning/DashboardContext';

export const initialStateValue = {
  enterpriseSubsidies: [],
};

export const DashboardContext = ({
  children,
  value,
}) => {
  const contextValue = useState(value);
  return (
    <IntlProvider locale="en">
      <NextedDashboardContext.Provider value={contextValue}>
        {children}
      </NextedDashboardContext.Provider>
    </IntlProvider>
  );
};

DashboardContext.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.shape(),
};

DashboardContext.defaultProps = {
  value: initialStateValue,
};
