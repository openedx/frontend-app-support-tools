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
    <div className="m-0 p-0 mb-5">
      <div className="mt-5">
        <h2>{FORM.SUB_TITLE}</h2>
      </div>
      <ProvisioningFormCustomer />
      <ProvisioningFormTerm />
      <ProvisioningFormInternalOnly />
      <ProvisioningFormSubsidy />
      <ProvisioningFormAccountType />
      {!alertMessage && formData.policies?.map(({
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
