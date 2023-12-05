import React, { useEffect } from 'react';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import ProvisioningFormCustomer from './ProvisioningFormCustomer';
import ProvisioningFormTerm from './ProvisioningFormTerm';
import ProvisioningFormSubsidy from './ProvisioningFormSubsidy';
import ProvisioningFormPolicyContainer from './PolicyForm';
import ProvisioningFormAccountType from './ProvisioningFormAccountType';
import ProvisioningFormSubmissionButton from './ProvisioningFormSubmissionButton';
import useProvisioningContext from '../data/hooks';
import { generateBudgetDisplayName, selectProvisioningContext } from '../data/utils';
import ProvisioningFormInternalOnly from './ProvisioningFormInternalOnly';
import ProvisioningFormTitle from './ProvisioningFormTitle';
import ProvisioningFormAlert from './ProvisioningFormAlert';
import ProvisioningFormInstructionAlert from './ProvisioningFormInstructionAlert';

const ProvisioningForm = () => {
  const { FORM } = PROVISIONING_PAGE_TEXT;
  const [multipleFunds, alertMessage, formData] = selectProvisioningContext(
    'multipleFunds',
    'alertMessage',
    'formData',
  );
  const { instantiateMultipleFormData, resetPolicies } = useProvisioningContext();
  useEffect(() => {
    resetPolicies();
    instantiateMultipleFormData(multipleFunds);
  }, [multipleFunds]);
  return (
    <div className="m-0 p-0 mb-5 mt-5">
      {alertMessage && <ProvisioningFormAlert />}
      <ProvisioningFormInstructionAlert formMode={FORM.MODE.NEW} />
      <div className="mt-4.5">
        <h2>{FORM.SUB_TITLE}</h2>
      </div>
      <ProvisioningFormTitle />
      <ProvisioningFormCustomer />
      <ProvisioningFormTerm />
      <ProvisioningFormInternalOnly />
      <ProvisioningFormSubsidy />
      <ProvisioningFormAccountType />
      {(multipleFunds !== undefined) && formData.policies?.map((policy, index) => (
        <ProvisioningFormPolicyContainer
          key={policy.uuid}
          title={generateBudgetDisplayName(policy)}
          index={index}
        />
      ))}
      <ProvisioningFormSubmissionButton />
    </div>
  );
};

export default ProvisioningForm;
