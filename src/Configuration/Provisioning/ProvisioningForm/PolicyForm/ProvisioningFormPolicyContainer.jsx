import PropTypes from 'prop-types';
import ProvisioningFormCatalogContainer from './ProvisioningFormCatalogContainer';
import ProvisioningFormAccountDetails from './ProvisioningFormAccountDetails';
import ProvisioningFormPerLearnerCapContainer from './ProvisioningFormPerLearnerCapContainer';

const ProvisioningFormPolicyContainer = ({ title }) => (
  <div className="mt-5">
    <h2>{title}</h2>
    <ProvisioningFormAccountDetails />
    <ProvisioningFormCatalogContainer />
    <ProvisioningFormPerLearnerCapContainer />
  </div>
);

ProvisioningFormPolicyContainer.propTypes = {
  title: PropTypes.string,
};

ProvisioningFormPolicyContainer.defaultProps = {
  title: '',
};

export default ProvisioningFormPolicyContainer;
