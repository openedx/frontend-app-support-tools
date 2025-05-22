import {
  StatefulButton,
} from '@openedx/paragon';
import { useNavigate } from 'react-router-dom';
import {
  useEffect, useMemo, useState,
} from 'react';
import { logError } from '@edx/frontend-platform/logging';
import PROVISIONING_PAGE_TEXT, {
  PREDEFINED_QUERY_DISPLAY_NAMES,
} from '../data/constants';
import ROUTES from '../../../data/constants/routes';
import useProvisioningContext from '../data/hooks';
import {
  selectProvisioningContext,
  hasValidPolicyAndSubsidy,
  transformSubsidyData,
  transformPatchPolicyPayload,
  getOrCreateCatalog,
  patchSubsidy,
  patchPolicy,
  determineInvalidFields,
  getPredefinedCatalogQueryMappings,
} from '../data/utils';

const SaveEditsButton = () => {
  const navigate = useNavigate();
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
      navigate(HOME, {
        state: {
          planSuccessfullySaved: true,
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
    if (policies.length === 0 || !canSavePolicyAndSubsidy || !formData.subsidyTitle) {
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

    const { queryTypeToQueryId } = getPredefinedCatalogQueryMappings();

    // transforms formData into the correct shape for the API
    const {
      internalOnly,
      isoStartDate,
      isoEndDate,
      revenueCategory,
      subsidyTitle,
    } = transformSubsidyData(formData);

    // containers for the API responses
    const subsidySavedResponse = [];

    // containers for the API responses
    let catalogCreateResponses = [];

    // Create or update a catalog for each policy that specifies an off-the-shelf content filter.
    try {
      catalogCreateResponses = await Promise.all(policies.map(async (policy) => {
        // All cases to cover (only last four cases apply for the current view/container):
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
          // Handle the third/fifth cases in the matrix (get or create a new catalog for the selected predefined query).
          //
          // Also, we can skip a POST if the selection has not changed:
          if (policy.predefinedQueryType !== policy.oldPredefinedQueryType) {
            // The predefined query selection has changed, so we need to try to create a catalog.
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
        }
        // We did not find a predefined catalog query type, so we assume a custom catalog has been selected.  Handle
        // fourth/sixth cases in the matrix (do nothing since we're using a custom catalog).
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

    // transforms formData into the correct shape for the API
    const policyPayloads = transformPatchPolicyPayload(formData, catalogCreateResponses);

    // updates subsidy access policy for each policy in the form
    try {
      await Promise.all(policyPayloads.map(async (payload) => {
        const policyPatchResponse = await patchPolicy(payload);
        return policyPatchResponse;
      }));
      setSubmitButtonState('complete');
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
      data-testid="save-edits-stateful-button"
      className="mr-1"
      labels={buttonLabels}
      variant={submitButtonState === 'error' ? 'danger' : 'primary'}
      state={submitButtonState}
      onClick={handleSubmit}
    />
  );
};

export default SaveEditsButton;
