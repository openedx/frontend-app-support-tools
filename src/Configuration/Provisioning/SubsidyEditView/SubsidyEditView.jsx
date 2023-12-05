import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useContextSelector } from 'use-context-selector';

import { logError } from '@edx/frontend-platform/logging';

import useProvisioningContext from '../data/hooks';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import { ProvisioningContext } from '../ProvisioningContext';
import ProvisioningFormTitle from '../ProvisioningForm/ProvisioningFormTitle';
import ROUTES from '../../../data/constants/routes';
import AccountTypeDetail from '../SubsidyDetailView/AccountTypeDetail';
import CancelButton from './CancelButton';
import CustomerDetail from '../SubsidyDetailView/CustomerDetail';
import PageLoading from '../../../components/common/PageLoading';
import ProvisioningFormAlert from '../ProvisioningForm/ProvisioningFormAlert';
import ProvisioningFormTerm from '../ProvisioningForm/ProvisioningFormTerm';
import ProvisioningFormInternalOnly from '../ProvisioningForm/ProvisioningFormInternalOnly';
import ProvisioningFormSubsidy from '../ProvisioningForm/ProvisioningFormSubsidy';
import ProvisioningFormPolicyContainer from '../ProvisioningForm/PolicyForm';
import SaveEditsButton from './SaveEditsButton';
import ProvisioningFormInstructionAlert from '../ProvisioningForm/ProvisioningFormInstructionAlert';

const SubsidyEditView = () => {
  const { FORM } = PROVISIONING_PAGE_TEXT;
  const params = useParams();
  const subsidyUuid = params.id;
  const navigate = useNavigate();
  const { SUB_DIRECTORY: { ERROR } } = ROUTES.CONFIGURATION.SUB_DIRECTORY.PROVISIONING;

  const contextData = useContextSelector(ProvisioningContext, v => v[0]);
  const {
    formData,
    isLoading,
    multipleFunds,
    alertMessage,
  } = contextData;
  const { hydrateEnterpriseSubsidiesData } = useProvisioningContext();
  const redirectOnError = (statusCode, message) => {
    navigate(ERROR, {
      state: {
        errorMessage: `Error ${statusCode}: ${message}`,
      },
    });
  };

  useEffect(() => {
    const handleTabClose = (event) => {
      event.preventDefault();
      // Creating a copy to bypass lint rule: no-param-reassign when setting a property on a DOM object.
      // TODO: Investigate why event.preventDefault does. not open dialog.
      // refer to docs: https://developer.mozilla.org/en-US/docs/Web/API/BeforeUnloadEvent
      const copyEvent = event;
      copyEvent.returnValue = true;
      return copyEvent.returnValue;
    };
    window.addEventListener('beforeunload', handleTabClose);
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, []);

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
    !isLoading ? (
      <div className="m-0 p-0 mb-6 mt-5">
        { alertMessage && <ProvisioningFormAlert /> }
        <ProvisioningFormInstructionAlert formMode={FORM.MODE.EDIT} />
        <div className="mt-4.5">
          <h2>{FORM.SUB_TITLE}</h2>
          <ProvisioningFormTitle />
          <CustomerDetail
            enterpriseCustomer={formData.customerName}
            financialIdentifier={formData.financialIdentifier}
            uuid={formData.enterpriseUUID}
          />
          <ProvisioningFormTerm />
          <ProvisioningFormInternalOnly />
          <ProvisioningFormSubsidy />
          <AccountTypeDetail isMultipleFunds={multipleFunds} />
          {(multipleFunds !== undefined) && formData.policies?.map(({
            uuid,
            policyFormTitle,
          }, index) => (
            <ProvisioningFormPolicyContainer
              key={uuid}
              title={policyFormTitle}
              index={index}
            />
          ))}
        </div>
        <div className="d-flex mt-5">
          <SaveEditsButton />
          <CancelButton />
        </div>
      </div>
    ) : <PageLoading srMessage="Loading" />
  );
};

export default SubsidyEditView;
