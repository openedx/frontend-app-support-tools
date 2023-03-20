import PropTypes from 'prop-types';
import { Alert } from '@edx/paragon';
import ProvisioningFormCatalogContainer from './ProvisioningFormCatalogContainer';
import ProvisioningFormAccountDetails from './ProvisioningFormAccountDetails';
import ProvisioningFormPerLearnerCapContainer from './ProvisioningFormPerLearnerCapContainer';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import selectProvisioningContext from '../../data/utils';

const ProvisioningFormPolicyContainer = ({ title, index }) => {
  const { ALERTS } = PROVISIONING_PAGE_TEXT.FORM;
  const [multipleFunds] = selectProvisioningContext('multipleFunds');
  if (multipleFunds === undefined) {
    return (
      <Alert variant="warning" className="mt-5">
        {ALERTS.unselectedAccountType}
      </Alert>
    );
  }

  return (
    <div className="mt-5">
      <h2>{title}</h2>
      <ProvisioningFormAccountDetails index={index} />
      <ProvisioningFormCatalogContainer index={index} />
      <ProvisioningFormPerLearnerCapContainer index={index} />
    </div>
  );
};

ProvisioningFormPolicyContainer.propTypes = {
  title: PropTypes.string,
  index: PropTypes.number.isRequired,
};

ProvisioningFormPolicyContainer.defaultProps = {
  title: '',
};

export default ProvisioningFormPolicyContainer;
