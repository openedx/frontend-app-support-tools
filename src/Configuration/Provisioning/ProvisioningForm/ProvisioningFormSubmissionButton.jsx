import { ActionRow, Button, StatefulButton } from '@openedx/paragon';
import { useEffect, useMemo, useState } from 'react';
import { logError } from '@edx/frontend-platform/logging';
import { useNavigate } from 'react-router-dom';

import PROVISIONING_PAGE_TEXT, { PREDEFINED_QUERY_DISPLAY_NAMES } from '../data/constants';
import ROUTES from '../../../data/constants/routes';
import useProvisioningContext from '../data/hooks';
import {
  createPolicy,
  createSubsidy,
  determineInvalidFields,
  getOrCreateCatalog,
  getPredefinedCatalogQueryMappings,
  hasValidPolicyAndSubsidy,
  selectProvisioningContext,
  transformPolicyData,
  transformSubsidyData,
} from '../data/utils';

const ProvisioningFormSubmissionButton = () => {
  const navigate = useNavigate();
  const {
    resetFormData,
    setInvalidSubsidyFields,
    setInvalidPolicyFields,
    resetInvalidFields,
    setAlertMessage,
  } = useProvisioningContext();
  const [formData, multipleFunds] = selectProvisioningContext('formData', 'multipleFunds');
  const { BUTTON, ALERTS: { API_ERROR_MESSAGES } } = PROVISIONING_PAGE_TEXT.FORM;
  const { HOME, SUB_DIRECTORY: { ERROR } } = ROUTES.CONFIGURATION.SUB_DIRECTORY.PROVISIONING;
  const { policies } = formData;
  const canCreatePolicyAndSubsidy = useMemo(() => hasValidPolicyAndSubsidy(formData), [formData]);

  const [submitButtonState, setSubmitButtonState] = useState('default');

  const clearFormAndRedirect = () => {
    resetFormData();
    if (submitButtonState === 'complete') {
      // Second parameter of push triggers the toast notification on dashboard
      navigate(HOME, {
        state: {
          planSuccessfullyCreated: true,
        },
      });
      return;
    }
    navigate(HOME);
  };

  const redirectOnError = (statusCode, message) => {
    navigate(ERROR, {
      state: {
        errorMessage: `Error ${statusCode}: ${message}`,
      },
    });
  };

  const handleSubmit = async () => {
    setSubmitButtonState('pending');
    setAlertMessage(false);
    // Checks validity before performing any API calls
    if (policies.length === 0 || !canCreatePolicyAndSubsidy) {
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
    let catalogCreateResponses = [];
    const subsidyCreationResponse = [];

    const { queryTypeToQueryId } = getPredefinedCatalogQueryMappings();

    // Create or update a catalog for each policy that specifies an off-the-shelf content filter.
    try {
      catalogCreateResponses = await Promise.all(policies.map(async (policy) => {
        // All cases to cover (only first two apply for the current view/container):
        //
        // +--------+---------------------+---------------------+----------------------------------------------------+
        // | View   | Old Radio Selection | New Radio Selection |              Catalog API Action(s)                 |
        // +--------+---------------------+---------------------+----------------------------------------------------+
        // | create | n/a                 | predefined query    | Get or create catalog using POST.                  |
        // | plan   |                     |                     | Notes:                                             |
        // |        |                     |                     | - POST is idempotent on [customer, query].         |
        // +--------+---------------------+---------------------+----------------------------------------------------+
        // | create | n/a                 | custom catalog      | Do nothing.                                        |
        // | plan   |                     |                     |                                                    |
        // +--------+---------------------+---------------------+----------------------------------------------------+
        // | edit   | predefined query    | predefined query    | Get or create catalog using POST.                  |
        // | plan   |                     |                     | Notes:                                             |
        // |        |                     |                     | - POST is idempotent on [customer, query].         |
        // |        |                     |                     | - We should PATCH policy to use new/found catalog. |
        // |        |                     |                     | - This may result in an orphaned catalog.          |
        // +--------+---------------------+---------------------+----------------------------------------------------+
        // | edit   | predefined query    | custom catalog      | Do nothing.                                        |
        // | plan   |                     |                     | Notes:                                             |
        // |        |                     |                     | - We should PATCH policy to use custom catalog.    |
        // |        |                     |                     | - This may result in an orphaned catalog.          |
        // +--------+---------------------+---------------------+----------------------------------------------------+
        // | edit   | custom catalog      | predefined query    | Get or create catalog using POST.                  |
        // | plan   |                     |                     | Notes:                                             |
        // |        |                     |                     | - POST is idempotent on [customer, query].         |
        // |        |                     |                     | - We should PATCH policy to use new/found catalog. |
        // +--------+---------------------+---------------------+----------------------------------------------------+
        // | edit   | custom catalog      | custom catalog      | Do nothing.                                        |
        // | plan   |                     |                     | Notes:                                             |
        // |        |                     |                     | - We should PATCH policy to use custom catalog.    |
        // +--------+---------------------+---------------------+----------------------------------------------------+
        //
        if (policy.predefinedQueryType) {
          // A predefined query type is prescribed in form data, so a predefined query was selected in the form.
          // Handle the first case in the matrix (get or create a new catalog for the selected predefined query).
          const predefinedQueryDisplayName = PREDEFINED_QUERY_DISPLAY_NAMES[
            policy.predefinedQueryType
          ];
          const catalogCreateResponse = getOrCreateCatalog({
            enterpriseCustomerUuid: formData.enterpriseUUID,
            catalogQueryId: queryTypeToQueryId[policy.predefinedQueryType],
            title: `${formData.enterpriseUUID} - ${predefinedQueryDisplayName}`,
          }).catch((error) => {
            throw error;
          });
          return catalogCreateResponse;
        }
        // We did not find a predefined catalog query type, so we assume a custom catalog has been selected.  Handle
        // second case in the matrix (do nothing since we're using a custom catalog)
        return undefined;
      }));
    } catch (error) {
      setSubmitButtonState('error');
      const { customAttributes } = error;
      if (customAttributes) {
        logError(
          'Alert Error: '
          + `${API_ERROR_MESSAGES.ENTERPRISE_CUSTOMER_CATALOG_CREATION[customAttributes.httpErrorStatus]} `
          + `${error}`,
        );
        redirectOnError(
          customAttributes.httpErrorStatus,
          API_ERROR_MESSAGES.ENTERPRISE_CUSTOMER_CATALOG_CREATION[
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
      catalogCreateResponses,
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
        variant={submitButtonState === 'error' ? 'danger' : 'primary'}
        state={submitButtonState}
        onClick={handleSubmit}
      />
      <Button
        variant="secondary"
        value={BUTTON.cancel}
        onClick={handleCancel}
        disabled={submitButtonState === 'pending'}
      >
        {BUTTON.cancel}
      </Button>
    </ActionRow>
  );
};

export default ProvisioningFormSubmissionButton;
