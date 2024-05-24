import PropTypes from 'prop-types';
import {
  Icon, Form,
} from '@openedx/paragon';
import { WarningFilled } from '@openedx/paragon/icons';
import PROVISIONING_PAGE_TEXT from '../data/constants';

const ProvisioningFormHelpText = ({ className }) => {
  const { HELP_TEXT } = PROVISIONING_PAGE_TEXT.FORM;

  return (
    <Form.Control.Feedback className={className} icon={<Icon src={WarningFilled} />}>
      {HELP_TEXT.LABEL}
    </Form.Control.Feedback>
  );
};

ProvisioningFormHelpText.propTypes = {
  className: PropTypes.string,
};

ProvisioningFormHelpText.defaultProps = {
  className: null,
};

export default ProvisioningFormHelpText;
