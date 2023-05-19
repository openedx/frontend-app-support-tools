import React, { useEffect } from 'react';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import ProvisioningFormCustomer from './ProvisioningFormCustomer';
import ProvisioningFormTerm from './ProvisioningFormTerm';
import ProvisioningFormSubsidy from './ProvisioningFormSubsidy';
import ProvisioningFormPolicyContainer from './PolicyForm';
import ProvisioningFormAccountType from './ProvisioningFormAccountType';
import ProvisioningFormSubmissionButton from './ProvisioningFormSubmissionButton';
import useProvisioningContext from '../data/hooks';
import { selectProvisioningContext } from '../data/utils';
import ProvisioningFormInternalOnly from './ProvisioningFormInternalOnly';
import ProvisioningFormTitle from './ProvisioningFormTitle';
import ProvisioningFormAlert from './ProvisioningFormAlert';

const ProvisioningForm = () => {
  const { FORM } = PROVISIONING_PAGE_TEXT;
  const [multipleFunds, alertMessage, formData, showInvalidField] = selectProvisioningContext(
    'multipleFunds',
    'alertMessage',
    'formData',
    'showInvalidField',
  );
  const { instantiateMultipleFormData, resetPolicies } = useProvisioningContext();
  useEffect(() => {
    resetPolicies();
    instantiateMultipleFormData(multipleFunds);
  }, [multipleFunds]);
  console.log(formData, showInvalidField, 'form data');
  return (
    <div className="m-0 p-0 mb-5 mt-5">
      {alertMessage && <ProvisioningFormAlert />}
      <div className="mt-4.5">
        <h2>{FORM.SUB_TITLE}</h2>
      </div>
      <ProvisioningFormTitle />
      <ProvisioningFormCustomer />
      <ProvisioningFormTerm />
      <ProvisioningFormInternalOnly />
      <ProvisioningFormSubsidy />
      <ProvisioningFormAccountType />
      {(multipleFunds !== undefined) && formData.policies?.map(({
        uuid,
        catalogQueryTitle,
      }, index) => (
        <ProvisioningFormPolicyContainer
          key={uuid}
          title={catalogQueryTitle}
          index={index}
        />
      ))}
      <ProvisioningFormSubmissionButton />
    </div>
  );
};

export default ProvisioningForm;
