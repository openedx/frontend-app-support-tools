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
import { utc } from 'moment';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import ROUTES from '../../../data/constants/routes';
import useProvisioningContext from '../data/hooks';
import {
  createCatalogs, selectProvisioningContext, hasValidPolicyAndSubidy, createSubsidy,
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
    // setSubmitButtonState('pending');
    // handle subsidy data
    // handle per policy catalog data
    if (policies.length === 0 || !canCreatePolicyAndSubsidy) {
      setSubmitButtonState('error');
      return;
    }
    console.log(formData, canCreatePolicyAndSubsidy);
    const { enterpriseUUID, financialIdentifier, internalOnly } = formData;
    const isoEndDate = new Date(formData.endDate).toISOString();
    const isoStartDate = new Date(formData.startDate).toISOString();
    const revenueCategory = formData.subsidyRevReq.includes('bulk')
      ? 'bulk-enrollment-prepay'
      : 'partner-no-rev-prepay';
    let subsidyTitle = '';
    const startingBalance = formData.policies.reduce((acc, { accountValue }) => acc + parseInt(accountValue, 10), 0);
    if (formData.policies.length > 1) {
      formData.policies.forEach(async ({ accountName }, index) => {
        if (index === formData.policies.length - 1) {
          subsidyTitle += `${accountName.trim()}`;
        } else {
          subsidyTitle += `${accountName.trim()} --- `;
        }
      });
    } else {
      subsidyTitle = formData.policies[0].accountName.trim();
    }
    console.log(isoStartDate, isoEndDate, subsidyTitle, revenueCategory, startingBalance);
    try {
      const payload = {
        financialIdentifier,
        title: subsidyTitle,
        enterpriseCustomerUUID: enterpriseUUID,
        startDate: isoStartDate,
        endDate: isoEndDate,
        startingBalance,
        revenueCategory,
        internalOnly,
      };
      const response = createSubsidy(payload);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
    // try {
    //   const responses = await Promise.all(policies.map(async (policy) => {
    //     const payload = {
    //       enterpriseCustomerUUID: formData.enterpriseUUID,
    //       catalogQueryUUID: policy.catalogQueryMetadata.catalogQuery.id,
    //       title: `${formData.enterpriseUUID} - ${policy.catalogQueryMetadata.catalogQuery.title}`,
    //     };
    //     const catalogCreatedResponse = createCatalogs(payload);
    //     return catalogCreatedResponse;
    //   }));
    //   if (responses.filter((response) => response.uuid).length === policies.length) {
    //     setSubmitButtonState('complete');
    //   }
    // } catch (error) {
    //   setSubmitButtonState('error');
    //   const { customAttributes } = error;
    //   if (customAttributes) {
    //     logError(`Alert Error: ${ALERTS.API_ERROR_MESSAGES.ENTERPRISE_CUSTOMER_CATALOG[customAttributes.httpErrorStatus]} ${error}`);
    //   }
    // }
  };

  const handleCancel = () => {
    clearFormAndRedirect();
  };

  useEffect(() => {
    if (submitButtonState === 'complete') {
      // clearFormAndRedirect();
      console.log('success');
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
