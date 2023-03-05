import {
  Button,
  ActionRow,
} from '@edx/paragon';
import { useHistory } from 'react-router';
import { useContextSelector } from 'use-context-selector';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import { ProvisioningContext } from '../ProvisioningContext';
import ROUTES from '../../../data/constants/routes';
import useProvisioningContext from '../data/hooks';

const ProvisioningFormSubmissionButton = () => {
  const history = useHistory();
  const { BUTTON } = PROVISIONING_PAGE_TEXT.FORM;
  const { HOME } = ROUTES.CONFIGURATION.SUB_DIRECTORY.PROVISIONING;
  const data = useContextSelector(ProvisioningContext, v => v[0]);
  const { resetFormData } = useProvisioningContext();
  const handleSubmit = async () => {
    // TODO: do something like this to post the form data to the backend
    // const response = await postProvisioningData(formData);
    // if (response) {
    //     setSuccessMessage(PROVISIONING_PAGE_TEXT.SUCCESS_MESSAGE);
    // }
    console.log(data);
    history.push(HOME);
  };
  const handleCancel = () => {
    // verify form data clears, default restored
    console.log(data);
    resetFormData();
    console.log(data);
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
