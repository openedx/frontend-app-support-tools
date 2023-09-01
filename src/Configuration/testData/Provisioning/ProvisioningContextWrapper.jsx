import { IntlProvider } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PROVISIONING_PAGE_TEXT from '../../Provisioning/data/constants';
import { ProvisioningContext as NestedProvisioningContext } from '../../Provisioning/ProvisioningContext';

const { ALERTS } = PROVISIONING_PAGE_TEXT.FORM;

export const initialStateValue = {
  customers: [],
  multipleFunds: undefined,
  customCatalog: false,
  alertMessage: ALERTS.unselectedAccountType,
  isEditMode: false,
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

const customerUuid = uuidv4();
export const hydratedInitialState = {
  customers: [],
  multipleFunds: true,
  customCatalog: false,
  alertMessage: ALERTS.unselectedAccountType,
  isEditMode: true,
  catalogQueries: {
    data: [],
    isLoading: true,
  },
  formData: {
    subsidyUuid: uuidv4(),
    subsidyTitle: 'Paper company',
    customerName: 'Dunder mifflin',
    customerUuid,
    enterpriseUUID: `Dunder mifflin --- ${customerUuid}`,
    internalOnly: true,
    financialIdentifier: '00k12sdf4',
    subsidyRevReq: 'Yes (bulk enrollment prepay)',
    startDate: '2023-10-01',
    endDate: '2023-11-01',
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
