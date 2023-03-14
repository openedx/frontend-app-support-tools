import { useContextSelector } from 'use-context-selector';
import PropTypes from 'prop-types';
import { ProvisioningContext } from '../../ProvisioningContext';
import ProvisioningFormPerLearnerCap from './ProvisioningFormPerLearnerCap';
import ProvisioningFormPerLearnerCapAmount from './ProvisioningFormPerLearnerCapAmount';

const ProvisioningFormPerLearnerCapContainer = ({ index }) => {
  const { formData } = useContextSelector(ProvisioningContext, v => v[0]);
  return (
    <>
      <ProvisioningFormPerLearnerCap index={index} />
      {formData.policies[index]?.perLearnerCap && <ProvisioningFormPerLearnerCapAmount index={index} />}
    </>
  );
};

ProvisioningFormPerLearnerCapContainer.propTypes = {
  index: PropTypes.number.isRequired,
};

export default ProvisioningFormPerLearnerCapContainer;
