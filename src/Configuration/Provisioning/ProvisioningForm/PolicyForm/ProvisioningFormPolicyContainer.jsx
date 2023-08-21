import PropTypes from 'prop-types';
import ProvisioningFormCatalogContainer from './ProvisioningFormCatalogContainer';
import ProvisioningFormAccountDetails from './ProvisioningFormAccountDetails';
import ProvisioningFormPerLearnerCapContainer from './ProvisioningFormPerLearnerCapContainer';
import { indexOnlyPropType } from '../../data/utils';
import ProvisioningFormDescription from './ProvisioningFormDescription';

const ProvisioningFormPolicyContainer = ({ title, index }) => (
  <div className="mt-5">
    <h2>{title}</h2>
    <ProvisioningFormAccountDetails index={index} />
    <ProvisioningFormDescription index={index} />
    <ProvisioningFormCatalogContainer index={index} />
    <ProvisioningFormPerLearnerCapContainer index={index} />
  </div>
);

ProvisioningFormPolicyContainer.propTypes = {
  title: PropTypes.string,
  ...indexOnlyPropType,
};

ProvisioningFormPolicyContainer.defaultProps = {
  title: '',
};

export default ProvisioningFormPolicyContainer;
