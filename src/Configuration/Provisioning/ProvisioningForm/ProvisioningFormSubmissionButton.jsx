import {
  Button,
  ActionRow,
} from '@edx/paragon';
import { useHistory } from 'react-router';
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

  const createCatalogs = async (payload) => {
    const data = await LmsApiService.postEnterpriseCustomerCatalog(
      ...payload,
    );
    return data;
  };
  const handleSubmit = async () => {
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
          if (catalogCreatedResponse) {
            // eslint-disable-next-line no-console
            console.log(catalogCreatedResponse);
          }
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      const { customAttributes } = error;
      if (customAttributes) {
        // eslint-disable-next-line no-console
        console.error(ALERTS.API_ERROR_MESSAGES.ENTERPRISE_CUSTOMER_CATALOG[customAttributes.httpErrorStatus]);
      }
    }
    resetFormData();
    history.push(HOME);
  };
  const handleCancel = () => {
    // verify form data clears, default restored
    resetFormData();
    history.push(HOME);
  };
  return (
    <ActionRow className="justify-content-start mt-5">
      <Button
        variant="primary"
        value={BUTTON.submit}
        onClick={handleSubmit}
      >
        {BUTTON.submit}
      </Button>
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
