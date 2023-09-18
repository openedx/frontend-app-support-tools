import {
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
  selectProvisioningContext,
  hasValidPolicyAndSubsidy,
  transformSubsidyData,
  transformPatchPolicyPayload,
  patchSubsidy,
  patchCatalogs,
  patchPolicy,
  determineInvalidFields,
} from '../data/utils';

const SaveEditsButton = () => {
  const history = useHistory();
  const {
    resetFormData,
    setInvalidSubsidyFields,
    setInvalidPolicyFields,
    resetInvalidFields,
    setAlertMessage,
  } = useProvisioningContext();
  const [formData, multipleFunds] = selectProvisioningContext('formData', 'multipleFunds');
  const { SAVE_BUTTON, ALERTS: { API_ERROR_MESSAGES } } = PROVISIONING_PAGE_TEXT.FORM;
  const { HOME, SUB_DIRECTORY: { ERROR } } = ROUTES.CONFIGURATION.SUB_DIRECTORY.PROVISIONING;
  const { policies, subsidyUuid } = formData;
  const canSavePolicyAndSubsidy = useMemo(() => hasValidPolicyAndSubsidy(formData), [formData]);
  const [submitButtonState, setSubmitButtonState] = useState('default');

  const clearFormAndRedirect = () => {
    resetFormData();
    if (submitButtonState === 'complete') {
      // Second parameter of push triggers the toast notification on dashboard
      history.push(HOME, {
        planSuccessfullySaved: true,
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
    setAlertMessage(false);
    // Checks validity before performing any API calls
    if (policies.length === 0 || !canSavePolicyAndSubsidy) {
      setSubmitButtonState('error');
      resetInvalidFields();

      const data = await determineInvalidFields({ ...formData, multipleFunds });
      setInvalidSubsidyFields(data[0]);
      if (data.length > 1) {
        data[1].forEach((element, index) => {
          setInvalidPolicyFields(element, index);
        });
      }
      setAlertMessage(true);
      global.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // transforms formData into the correct shape for the API
    const {
      internalOnly,
      isoStartDate,
      isoEndDate,
      revenueCategory,
      subsidyTitle,
    } = transformSubsidyData(formData);

    // containers for the API responses
    const catalogSavedResponse = [];
    const subsidySavedResponse = [];

    // patches catalog for each policy
    try {
      const catalogResponses = await Promise.all(policies.map(async (policy) => {
        const payload = {
          catalogQueryUUID: policy.catalogQueryMetadata.catalogQuery.id,
          catalogUuid: policy.catalogUuid,
          title: `${formData.enterpriseUUID} - ${policy.catalogQueryMetadata.catalogQuery.title}`,
        };
        const catalogPatchedResponse = patchCatalogs(payload).catch((error) => {
          throw error;
        });
        return catalogPatchedResponse;
      }));
      // checks if catalogs were updated/saved successfully before proceeding
      if (catalogResponses.filter((response) => response.data.uuid).length === policies.length) {
        catalogSavedResponse.push(catalogResponses);
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

    // patch subsidy
    try {
      const subsidyPayload = {
        subsidyUuid,
        title: subsidyTitle,
        startDate: isoStartDate,
        endDate: isoEndDate,
        revenueCategory,
        internalOnly,
      };
      const subsidyResponse = await patchSubsidy(subsidyPayload);
      // checks if subsidy was updated/saved successfully before proceeding
      if (subsidyResponse.status === 200) {
        subsidySavedResponse.push(subsidyResponse);
        setSubmitButtonState('pending');
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

    // transforms formData and catalogSavedResponse into the correct shape for the API
    const policyPayloads = transformPatchPolicyPayload(formData, catalogSavedResponse);

    // updates subsidy access policy for each policy in the form
    try {
      const policyResponses = await Promise.all(policyPayloads.map(async (payload) => {
        const policyPatchResponse = await patchPolicy(payload);
        return policyPatchResponse;
      }));
      // checks if all policies were saved/updated successfully before proceeding
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

  useEffect(() => {
    // resets form and redirects to dashboard if the form was successfully submitted
    if (submitButtonState === 'complete') {
      clearFormAndRedirect();
    }
  }, [submitButtonState]);

  const buttonLabels = {
    default: SAVE_BUTTON.submit,
    pending: SAVE_BUTTON.pending,
    complete: SAVE_BUTTON.success,
    error: SAVE_BUTTON.error,
  };
  return (
    <StatefulButton
      className="mr-1"
      labels={buttonLabels}
      variant={submitButtonState === 'error' ? 'danger' : 'primary'}
      state={submitButtonState}
      onClick={handleSubmit}
    />
  );
};

export default SaveEditsButton;
