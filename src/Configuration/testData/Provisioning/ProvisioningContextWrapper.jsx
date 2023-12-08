import { v4 as uuidv4 } from 'uuid';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import { useState } from 'react';
import PROVISIONING_PAGE_TEXT, {
  PREDEFINED_QUERIES_ENUM,
  PREDEFINED_QUERY_DISPLAY_NAMES,
} from '../../Provisioning/data/constants';
import { ProvisioningContext as NestedProvisioningContext } from '../../Provisioning/ProvisioningContext';

const { ALERTS } = PROVISIONING_PAGE_TEXT.FORM;

export const initialStateValue = {
  customers: [],
  multipleFunds: undefined,
  alertMessage: ALERTS.unselectedAccountType,
  isEditMode: false,
  existingEnterpriseCatalogs: {
    data: [],
    isLoading: true,
  },
  formData: {
    policies: [],
    internalOnly: false,
  },
  showInvalidField: {
    subsidy: [],
    policies: [],
  },
  isLoading: true,
};

const enterpriseUUID = uuidv4();
export const hydratedInitialState = {
  customers: [],
  multipleFunds: true,
  alertMessage: ALERTS.unselectedAccountType,
  isEditMode: true,
  existingEnterpriseCatalogs: {
    data: [],
    isLoading: true,
  },
  formData: {
    subsidyUuid: '0196e5c3-ba08-4798-8bf1-019d747c27bf',
    subsidyTitle: 'Paper company',
    customerName: 'Dunder mifflin',
    enterpriseUUID,
    internalOnly: true,
    financialIdentifier: '00k12sdf4asdfasdfa',
    subsidyRevReq: 'Yes (bulk-enrollment-prepay)',
    startDate: '2023-10-01',
    endDate: '2023-11-01',
    policies: [
      {
        accountValue: '4000',
        perLearnerCap: true,
        perLearnerCapAmount: '99',
        description: 'blahblah',
        accountName: 'Test Subsidy Title --- Open Courses budget',
        customCatalog: false,
        predefinedQueryType: PREDEFINED_QUERIES_ENUM.openCourses,
        catalogTitle: `${enterpriseUUID} --- ${PREDEFINED_QUERY_DISPLAY_NAMES.openCourses}`,
        catalogUuid: uuidv4(),
        policyType: 'PerLearnerSpendCreditAccessPolicy',
        accessMethod: 'direct',
      },
    ],
  },
  showInvalidField: {
    subsidy: [],
    policies: [],
  },
  hasEdits: false,
  isLoading: false,
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
