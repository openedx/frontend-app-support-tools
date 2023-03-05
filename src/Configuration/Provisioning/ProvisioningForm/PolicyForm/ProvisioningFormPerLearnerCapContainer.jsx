import { useContextSelector } from 'use-context-selector';
import { ProvisioningContext } from '../../ProvisioningContext';
import ProvisioningFormPerLearnerCap from './ProvisioningFormPerLearnerCap';
import ProvisioningFormPerLearnerCapAmount from './ProvisioningFormPerLearnerCapAmount';

const ProvisioningFormPerLearnerCapContainer = () => {
  const { formData } = useContextSelector(ProvisioningContext, v => v[0]);
  return (
    <>
      <ProvisioningFormPerLearnerCap />
      {formData.perLearnerCap && <ProvisioningFormPerLearnerCapAmount />}
    </>
  );
};

export default ProvisioningFormPerLearnerCapContainer;
