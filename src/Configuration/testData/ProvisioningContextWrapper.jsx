import { IntlProvider } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import { useState } from 'react';
import PROVISIONING_PAGE_TEXT from '../Provisioning/data/constants';
import { ProvisioningContext as NestedProvisioningContext } from '../Provisioning/ProvisioningContext';

const { ALERTS } = PROVISIONING_PAGE_TEXT.FORM;

export const initialStateValue = {
  customers: [],
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
  showInvalidField: {
    subsidy: [],
    policies: [],
  },
};

export const ProvisioningContext = ({
  children,
  value,
}) => {
  const contextValue = useState(value);
  return (
    <IntlProvider locale="en">
      <NestedProvisioningContext.Provider value={contextValue}>
        {children}
      </NestedProvisioningContext.Provider>
    </IntlProvider>
  );
};

ProvisioningContext.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.shape(),
};

ProvisioningContext.defaultProps = {
  value: initialStateValue,
};
