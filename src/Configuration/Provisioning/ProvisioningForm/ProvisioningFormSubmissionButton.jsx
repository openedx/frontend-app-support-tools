import {
  Button,
  ActionRow,
  StatefulButton,
} from '@edx/paragon';
import { useHistory } from 'react-router';
import {
  useEffect, useMemo, useState,
} from 'react';
import { logError } from '@edx/frontend-platform/logging';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import ROUTES from '../../../data/constants/routes';
import useProvisioningContext from '../data/hooks';
import {
  createCatalogs,
  selectProvisioningContext,
  hasValidPolicyAndSubidy,
  createSubsidy,
  transformSubsidyData,
  transformPolicyData,
  createPolicy,
} from '../data/utils';

const ProvisioningFormSubmissionButton = () => {
  const history = useHistory();
  const { BUTTON, ALERTS } = PROVISIONING_PAGE_TEXT.FORM;
  const { HOME } = ROUTES.CONFIGURATION.SUB_DIRECTORY.PROVISIONING;
  const { resetFormData } = useProvisioningContext();
  const [formData] = selectProvisioningContext('formData');
  const { policies } = formData;
  const canCreatePolicyAndSubsidy = useMemo(() => hasValidPolicyAndSubidy(formData), [formData]);

  const [submitButtonState, setSubmitButtonState] = useState('default');

  const clearFormAndRedirect = () => {
    resetFormData();
    history.push(HOME);
  };
  const handleSubmit = async () => {
    setSubmitButtonState('pending');
    if (policies.length === 0 || !canCreatePolicyAndSubsidy) {
      setSubmitButtonState('error');
      return;
    }
    const {
      enterpriseUUID,
      financialIdentifier,
      internalOnly,
      isoStartDate,
      isoEndDate,
      revenueCategory,
      startingBalance,
      subsidyTitle,
    } = transformSubsidyData(formData);
    const catalogCreationResponse = [];
    const subsidyCreationResponse = [];

    try {
      const catalogResponses = await Promise.all(policies.map(async (policy) => {
        const payload = {
          enterpriseCustomerUUID: formData.enterpriseUUID,
          catalogQueryUUID: policy.catalogQueryMetadata.catalogQuery.id,
          title: `${formData.enterpriseUUID} - ${policy.catalogQueryMetadata.catalogQuery.title}`,
        };
        const catalogCreatedResponse = createCatalogs(payload);
        return catalogCreatedResponse;
      }));
      if (catalogResponses.filter((response) => response.uuid).length === policies.length) {
        catalogCreationResponse.push(catalogResponses);
      }
    } catch (error) {
      setSubmitButtonState('error');
      const { customAttributes } = error;
      if (customAttributes) {
        logError(`Alert Error: ${ALERTS.API_ERROR_MESSAGES.ENTERPRISE_CUSTOMER_CATALOG[customAttributes.httpErrorStatus]} ${error}`);
      }
    }
    try {
      const subsidyPayload = {
        financialIdentifier,
        title: subsidyTitle,
        enterpriseCustomerUUID: enterpriseUUID,
        startDate: isoStartDate,
        endDate: isoEndDate,
        startingBalance,
        revenueCategory,
        internalOnly,
      };
      const subsidyResponse = await createSubsidy(subsidyPayload);
      if (subsidyResponse) {
        subsidyCreationResponse.push(subsidyResponse);
      }
    } catch (error) {
      setSubmitButtonState('error');
      const { customAttributes } = error;
      if (customAttributes) {
        logError(`Alert Error: ${ALERTS.API_ERROR_MESSAGES.SUBSIDY_CREATION[customAttributes.httpErrorStatus]} ${error}`);
      }
    }
    const policyPayloads = transformPolicyData(formData, catalogCreationResponse, subsidyCreationResponse);
    try {
      const policyResponses = await Promise.all(policyPayloads.map(async (payload) => {
        const policyCreatedResponse = createPolicy(payload);
        return policyCreatedResponse;
      }));
      if (policyResponses) {
        setSubmitButtonState('complete');
      }
    } catch (error) {
      setSubmitButtonState('error');
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
