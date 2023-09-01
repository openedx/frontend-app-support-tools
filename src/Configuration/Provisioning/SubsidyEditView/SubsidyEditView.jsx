import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useContextSelector } from 'use-context-selector';

import { logError } from '@edx/frontend-platform/logging';
import useProvisioningContext from '../data/hooks';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import { ProvisioningContext } from '../ProvisioningContext';
import ProvisioningFormTitle from '../ProvisioningForm/ProvisioningFormTitle';
import ROUTES from '../../../data/constants/routes';
import CustomerDetail from '../SubsidyDetailView/CustomerDetail';
import ProvisioningFormTerm from '../ProvisioningForm/ProvisioningFormTerm';
import ProvisioningFormInternalOnly from '../ProvisioningForm/ProvisioningFormInternalOnly';
import { selectProvisioningContext } from '../data/utils';
import ProvisioningFormSubsidy from '../ProvisioningForm/ProvisioningFormSubsidy';
import ProvisioningFormPolicyContainer from '../ProvisioningForm/PolicyForm';
import AccountTypeDetail from '../SubsidyDetailView/AccountTypeDetail';

const SubsidyEditView = () => {
  const { FORM } = PROVISIONING_PAGE_TEXT;
  const [multipleFunds, formData] = selectProvisioningContext(
    'multipleFunds',
    'formData',
  );

  const params = useParams();
  const subsidyUuid = params.id;
  const history = useHistory();
  const { SUB_DIRECTORY: { ERROR } } = ROUTES.CONFIGURATION.SUB_DIRECTORY.PROVISIONING;

  const contextData = useContextSelector(ProvisioningContext, v => v[0]);
  const { hydrateEnterpriseSubsidiesData } = useProvisioningContext();
  const redirectOnError = (statusCode, message) => {
    history.push(ERROR, {
      errorMessage: `Error ${statusCode}: ${message}`,
    });
  };

  useEffect(() => {
    try {
      hydrateEnterpriseSubsidiesData(subsidyUuid);
    } catch (error) {
      const { customAttributes } = error;
      logError(error);
      redirectOnError(customAttributes?.httpErrorStatus, error);
    }
  }, [subsidyUuid]);

  return (
    !contextData.isLoading ? (
      <div className="m-0 p-0 mb-5 mt-5">
        <div className="mt-4.5">
          <h2>{FORM.SUB_TITLE}</h2>
          <ProvisioningFormTitle />
          <CustomerDetail
            enterpriseCustomer={formData.customerName}
            financialIdentifier={formData.financialIdentifier}
            uuid={formData.customerUuid}
          />
          <ProvisioningFormTerm />
          <ProvisioningFormInternalOnly />
          <ProvisioningFormSubsidy />
          <AccountTypeDetail isMultipleFunds={multipleFunds} />
          {(multipleFunds !== undefined) && formData.policies?.map(({
            uuid,
            catalogQueryTitle,
          }, index) => (
            <ProvisioningFormPolicyContainer
              key={uuid}
              title={catalogQueryTitle}
              index={index}
            />
          ))}
        </div>
      </div>
    ) : null
  );
};

export default SubsidyEditView;
