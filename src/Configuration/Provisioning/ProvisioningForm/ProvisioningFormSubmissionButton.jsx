// TODO: Remove instanbul next and test file when submission button is complete
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
import { createCatalogs, selectProvisioningContext, hasValidData } from '../data/utils';

const ProvisioningFormSubmissionButton = () => {
  const history = useHistory();
  const { BUTTON, ALERTS } = PROVISIONING_PAGE_TEXT.FORM;
  const { HOME } = ROUTES.CONFIGURATION.SUB_DIRECTORY.PROVISIONING;
  const { resetFormData } = useProvisioningContext();
  const [formData] = selectProvisioningContext('formData');
  const { policies } = formData;
  const canCreatePolicyAndSubsidy = hasValidData(formData);

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
      const responses = await Promise.all(policies.map(async (policy) => {
        if (!policy.customerCatalogUUID) {
          const payload = {
            enterpriseCustomerUUID: formData.enterpriseUUID,
            catalogQueryUUID: policy.catalogQueryMetadata.catalogQuery.id,
            title: `${formData.enterpriseUUID} - ${policy.catalogQueryMetadata.catalogQuery.title}`,
          };
          const catalogCreatedResponse = createCatalogs(payload);
          return catalogCreatedResponse;
        }
        return { uuid: policy.customerCatalogUUID };
      }));
      if (responses.filter((response) => response.uuid).length === policies.length) {
        return setSubmitButtonState('complete');
      }
    } catch (error) {
      setSubmitButtonState('error');
      const { customAttributes } = error;
      if (customAttributes) {
        logError(`Alert Error: ${ALERTS.API_ERROR_MESSAGES.ENTERPRISE_CUSTOMER_CATALOG[customAttributes.httpErrorStatus]} ${error}`);
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
