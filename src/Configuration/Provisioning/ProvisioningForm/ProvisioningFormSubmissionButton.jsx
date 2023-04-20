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
import { createCatalogs, selectProvisioningContext, validFormData } from '../data/utils';

const ProvisioningFormSubmissionButton = () => {
  const history = useHistory();
  const { BUTTON, ALERTS } = PROVISIONING_PAGE_TEXT.FORM;
  const { HOME } = ROUTES.CONFIGURATION.SUB_DIRECTORY.PROVISIONING;
  const { resetFormData } = useProvisioningContext();
  const [formData] = selectProvisioningContext('formData');
  const { policies } = formData;
  const canCreatePolicyAndSubsidy = validFormData(formData);

  const [submitButtonState, setSubmitButtonState] = useState('default');

  const clearFormAndRedirect = () => {
    resetFormData();
    history.push(HOME);
  };

  // eslint-disable-next-line consistent-return
  const handleSubmit = async () => {
    setSubmitButtonState('pending');
    // handle subsidy data
    // handle per policy catalog data
    if (policies.length === 0 || !canCreatePolicyAndSubsidy) {
      return setSubmitButtonState('error');
    }
    try {
      policies.forEach(async (policy) => {
        // checks if policy has all the valid fields and if customerCatalogUUID is not present
        if (!policy.customerCatalogUUID) {
          const payload = [
            formData.enterpriseUUID,
            policy.catalogQueryMetadata.catalogQuery.id,
            `${formData.enterpriseUUID} - ${policy.catalogQueryMetadata.catalogQuery.title}`,
          ];
          const catalogCreatedResponse = await createCatalogs(payload);
          // attach catalogs to policies here
          if (catalogCreatedResponse) {
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
        return console.log(ALERTS.API_ERROR_MESSAGES.ENTERPRISE_CUSTOMER_CATALOG[customAttributes.httpErrorStatus]);
      }
    }
  };

  const handleCancel = () => {
    clearFormAndRedirect();
  };

  useEffect(() => {
    if (submitButtonState === 'complete') {
      clearFormAndRedirect();
    }
  }, [submitButtonState]);

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
