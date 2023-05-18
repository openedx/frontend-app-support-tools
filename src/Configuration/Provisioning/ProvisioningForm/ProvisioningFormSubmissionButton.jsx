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
  const { BUTTON, ALERTS: { API_ERROR_MESSAGES } } = PROVISIONING_PAGE_TEXT.FORM;
  const { HOME, SUB_DIRECTORY: { ERROR } } = ROUTES.CONFIGURATION.SUB_DIRECTORY.PROVISIONING;
  const { resetFormData } = useProvisioningContext();
  const [formData] = selectProvisioningContext('formData');
  const { policies } = formData;
  const canCreatePolicyAndSubsidy = useMemo(() => hasValidPolicyAndSubidy(formData), [formData]);

  const [submitButtonState, setSubmitButtonState] = useState('default');

  const clearFormAndRedirect = () => {
    resetFormData();
    if (submitButtonState === 'complete') {
      // Second parameter of push triggers the toast notification on dashboard
      history.push(HOME, {
        planSuccessfullyCreated: true,
      });
      return;
    }
    history.push(HOME);
  };

  const redirectOnError = (statusCode, message) => {
    history.push(ERROR, {
      errorMessage: `Error ${statusCode}: ${message}`,
    });
  };

  const handleSubmit = async () => {
    setSubmitButtonState('pending');
    // Checks validiy before performing any API calls
    if (policies.length === 0 || !canCreatePolicyAndSubsidy) {
      setSubmitButtonState('error');
      return;
    }

    // transforms formData into the correct shape for the API
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

    // containers for the API responses
    const catalogCreationResponse = [];
    const subsidyCreationResponse = [];

    // creates catalog for each policy
    try {
      const catalogResponses = await Promise.all(policies.map(async (policy) => {
        const payload = {
          enterpriseCustomerUUID: formData.enterpriseUUID,
          catalogQueryUUID: policy.catalogQueryMetadata.catalogQuery.id,
          title: `${formData.enterpriseUUID} - ${policy.catalogQueryMetadata.catalogQuery.title}`,
        };
        const catalogCreatedResponse = createCatalogs(payload).catch((error) => {
          throw error;
        });
        return catalogCreatedResponse;
      }));
      // checks if all catalogs were created successfully before proceeding
      if (catalogResponses.filter((response) => response.uuid).length === policies.length) {
        catalogCreationResponse.push(catalogResponses);
      }
    } catch (error) {
      setSubmitButtonState('error');
      const { customAttributes } = error;
      if (customAttributes) {
        logError(`Alert Error: ${API_ERROR_MESSAGES.ENTERPRISE_CUSTOMER_CATALOG[customAttributes.httpErrorStatus]} ${error}`);
        redirectOnError(
          customAttributes.httpErrorStatus,
          API_ERROR_MESSAGES.ENTERPRISE_CUSTOMER_CATALOG[
            customAttributes.httpErrorStatus
          ] || API_ERROR_MESSAGES.DEFAULT,
        );
        return;
      }
    }

    // creates subsidy
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
      // checks if subsidy was created successfully before proceeding
      if (subsidyResponse) {
        subsidyCreationResponse.push(subsidyResponse);
      }
    } catch (error) {
      setSubmitButtonState('error');
      const { customAttributes } = error;
      if (customAttributes) {
        logError(`Alert Error: ${API_ERROR_MESSAGES.SUBSIDY_CREATION[customAttributes.httpErrorStatus]} ${error}`);
        redirectOnError(
          customAttributes.httpErrorStatus,
          API_ERROR_MESSAGES.SUBSIDY_CREATION[customAttributes.httpErrorStatus] || API_ERROR_MESSAGES.DEFAULT,
        );
        return;
      }
    }

    // transforms formData, catalogCreationResponse and subsidyCreationResponse into the correct shape for the API
    const policyPayloads = transformPolicyData(
      formData,
      catalogCreationResponse,
      subsidyCreationResponse,
    );

    // creates subsidy access policy for each policy in the form
    try {
      const policyResponses = await Promise.all(policyPayloads.map(async (payload) => {
        const policyCreatedResponse = await createPolicy(payload);
        return policyCreatedResponse;
      }));
      // checks if all policies were created successfully before proceeding
      if (policyResponses) {
        setSubmitButtonState('complete');
      }
    } catch (error) {
      setSubmitButtonState('error');
      const { customAttributes } = error;
      if (customAttributes) {
        logError(
          `Alert Error: ${API_ERROR_MESSAGES.POLICY_CREATION[customAttributes.httpErrorStatus] || API_ERROR_MESSAGES.DEFAULT} ${error}`,
        );
        redirectOnError(
          customAttributes.httpErrorStatus,
          API_ERROR_MESSAGES.POLICY_CREATION[customAttributes.httpErrorStatus] || API_ERROR_MESSAGES.DEFAULT,
        );
      }
    }
  };

  const handleCancel = () => {
    clearFormAndRedirect();
  };

  useEffect(() => {
    // resets form and redirects to dashboard if the form was successfully submitted
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
