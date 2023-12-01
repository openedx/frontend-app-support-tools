import { Alert } from '@edx/paragon';
import { Info } from '@edx/paragon/icons';
import PROVISIONING_PAGE_TEXT from '../data/constants';

const ProvisioningFormNewAlert = () => {
  const { MISSING_FIELD_MESSAGES } = PROVISIONING_PAGE_TEXT.FORM.ALERTS;
  return (
    <article>
      <Alert
        variant="danger"
        icon={Info}
      >
        <Alert.Heading>{MISSING_FIELD_MESSAGES.TITLE}</Alert.Heading>
        <p>
          {MISSING_FIELD_MESSAGES.SUB_TITLE}
        </p>
      </Alert>
    </article>
  );
};

export default ProvisioningFormNewAlert;
