import ProvisioningFormPerLearnerCap from './ProvisioningFormPerLearnerCap';
import ProvisioningFormPerLearnerCapAmount from './ProvisioningFormPerLearnerCapAmount';
import { indexOnlyPropType, selectProvisioningContext } from '../../data/utils';

const ProvisioningFormPerLearnerCapContainer = ({ index }) => {
  const [formData] = selectProvisioningContext('formData');
  return (
    <>
      <ProvisioningFormPerLearnerCap index={index} />
      {formData.policies[index]?.perLearnerCap && <ProvisioningFormPerLearnerCapAmount index={index} />}
    </>
  );
};

ProvisioningFormPerLearnerCapContainer.propTypes = indexOnlyPropType;

export default ProvisioningFormPerLearnerCapContainer;
