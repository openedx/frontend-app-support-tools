import PropTypes from 'prop-types';
import ProvisioningFormPerLearnerCap from './ProvisioningFormPerLearnerCap';
import ProvisioningFormPerLearnerCapAmount from './ProvisioningFormPerLearnerCapAmount';
import selectProvisioningContext from '../../data/utils';

const ProvisioningFormPerLearnerCapContainer = ({ index }) => {
  const [formData] = selectProvisioningContext('formData');
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
