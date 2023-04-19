import {
  Button,
  ActionRow,
  StatefulButton,
} from '@edx/paragon';
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import { logError } from '@edx/frontend-platform/logging';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import ROUTES from '../../../data/constants/routes';
import useProvisioningContext from '../data/hooks';
import { selectProvisioningContext, validFormData } from '../data/utils';
import LmsApiService from '../../../data/services/EnterpriseApiService';

const ProvisioningFormSubmissionButton = () => {
  const history = useHistory();
  const { BUTTON, ALERTS } = PROVISIONING_PAGE_TEXT.FORM;
  const { HOME } = ROUTES.CONFIGURATION.SUB_DIRECTORY.PROVISIONING;
  const { resetFormData } = useProvisioningContext();
  const [formData] = selectProvisioningContext('formData');
  const { policies } = formData;
  const canCreatePolicyAndSubsidy = validFormData(formData);

  const [submitButtonState, setSubmitButtonState] = useState('default');

  const createCatalogs = async (payload) => {
    const data = await LmsApiService.postEnterpriseCustomerCatalog(
      ...payload,
    );
    return data;
  };
  const handleSubmit = async () => {
    setSubmitButtonState('pending');
    // handle subsidy data
    // handle per policy catalog data
    try {
      policies.forEach(async (policy) => {
        // checks if policy has all the valid fields and if customerCatalogUUID is not present
        if (canCreatePolicyAndSubsidy && !policy.customerCatalogUUID) {
          const payload = [
            formData.enterpriseUUID,
            policy.catalogQueryMetadata.catalogQuery.id,
            `${formData.enterpriseUUID} - ${policy.catalogQueryMetadata.catalogQuery.title}`,
          ];
          const catalogCreatedResponse = await createCatalogs(payload);
          // attach catalogs to policies here
          if (catalogCreatedResponse) {
            // eslint-disable-next-line no-console
            return setSubmitButtonState('complete');
          }
        }
        return setSubmitButtonState('error');
      });
    } catch (error) {
      logError(error);
      setSubmitButtonState('error');
      const { customAttributes } = error;
      if (customAttributes) {
        // eslint-disable-next-line no-console
        console.log(ALERTS.API_ERROR_MESSAGES.ENTERPRISE_CUSTOMER_CATALOG[customAttributes.httpErrorStatus]);
      }
    }
  };
  useEffect(() => {
    if (submitButtonState === 'complete') {
      resetFormData();
      history.push(HOME);
    }
  });

  const handleCancel = () => {
    // verify form data clears, default restored
    resetFormData();
    history.push(HOME);
  };

  const buttonLabels = {
    default: BUTTON.submit,
    pending: BUTTON.pending,
    complete: BUTTON.success,
    error: BUTTON.error,
  };

  return (
    <ActionRow className="justify-content-start mt-5">
      <StatefulButton
        labels={buttonLabels}
        variant="primary"
        state={submitButtonState}
        onClick={handleSubmit}
      />
      <Button
        variant="secondary"
        value={BUTTON.cancel}
        onClick={handleCancel}
      >
        {BUTTON.cancel}
      </Button>
    </ActionRow>
  );
};

export default ProvisioningFormSubmissionButton;
