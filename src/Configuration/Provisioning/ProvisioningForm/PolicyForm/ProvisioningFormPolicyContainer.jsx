import PropTypes from 'prop-types';
import { useContextSelector } from 'use-context-selector';
import ProvisioningFormCatalogContainer from './ProvisioningFormCatalogContainer';
import ProvisioningFormAccountDetails from './ProvisioningFormAccountDetails';
import ProvisioningFormPerLearnerCapContainer from './ProvisioningFormPerLearnerCapContainer';
import { ProvisioningContext } from '../../ProvisioningContext';

const ProvisioningFormPolicyContainer = ({ title, index }) => {
  const { multipleFunds } = useContextSelector(ProvisioningContext, v => v[0]);

  if (multipleFunds === undefined) {
    return null;
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