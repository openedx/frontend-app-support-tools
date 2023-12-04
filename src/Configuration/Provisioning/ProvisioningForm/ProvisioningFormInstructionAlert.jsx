import PropTypes from 'prop-types';
import { Alert, useToggle } from '@edx/paragon';
import { Edit } from '@edx/paragon/icons';
import PROVISIONING_PAGE_TEXT from '../data/constants';

const ProvisioningFormInstructionAlert = ({ formMode }) => {
  const { NEW_FORM, EDIT_FORM, VIEW_FORM } = PROVISIONING_PAGE_TEXT.FORM.ALERTS;
  const [isOpen, , close] = useToggle(true);

  let alertContent;
  if (formMode === 'new') {
    alertContent = NEW_FORM;
  } else if (formMode === 'edit') {
    alertContent = EDIT_FORM;
  } else {
    alertContent = VIEW_FORM;
  }

  return (
    <article>
      <Alert
        variant="info"
        icon={Edit}
        dismissible
        show={isOpen}
        closeLabel="Dismiss"
        onClose={close}
      >
        <Alert.Heading>{alertContent.TITLE}</Alert.Heading>
        <p>
          {alertContent.DESCRIPTION}
        </p>
      </Alert>
    </article>
  );
};

ProvisioningFormInstructionAlert.propTypes = {
  formMode: PropTypes.string.isRequired,
};

export default ProvisioningFormInstructionAlert;
