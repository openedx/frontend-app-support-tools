import PropTypes from 'prop-types';
import ProvisioningFormCatalogContainer from './ProvisioningFormCatalogContainer';
import ProvisioningFormAccountDetails from './ProvisioningFormAccountDetails';
import ProvisioningFormPerLearnerCapContainer from './ProvisioningFormPerLearnerCapContainer';

const ProvisioningFormPolicyContainer = ({ title, index }) => (
  <div className="mt-5">
    <h2>{title}</h2>
    <ProvisioningFormAccountDetails index={index} />
    <ProvisioningFormCatalogContainer index={index} />
    <ProvisioningFormPerLearnerCapContainer index={index} />
  </div>
);

ProvisioningFormPolicyContainer.propTypes = {
  title: PropTypes.string,
  index: PropTypes.number.isRequired,
};

ProvisioningFormPolicyContainer.defaultProps = {
  title: '',
};

export default ProvisioningFormPolicyContainer;
