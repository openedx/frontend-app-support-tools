import ProvisioningFormPerLearnerCap from './ProvisioningFormPerLearnerCap';
import ProvisioningFormPerLearnerCapAmount from './ProvisioningFormPerLearnerCapAmount';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import { indexOnlyPropType, selectProvisioningContext } from '../../data/utils';

const ProvisioningFormPerLearnerCapContainer = ({ index }) => {
  const [formData] = selectProvisioningContext('formData');
  const { POLICY_TYPE: { OPTIONS } } = PROVISIONING_PAGE_TEXT.FORM;
  return (
    <>
      {formData.policies[index]?.policyType === OPTIONS.LEARNER_SELECTS.VALUE
        && <ProvisioningFormPerLearnerCap index={index} />}
      {formData.policies[index]?.perLearnerCap && <ProvisioningFormPerLearnerCapAmount index={index} />}
    </>
  );
};

ProvisioningFormPerLearnerCapContainer.propTypes = indexOnlyPropType;

export default ProvisioningFormPerLearnerCapContainer;
