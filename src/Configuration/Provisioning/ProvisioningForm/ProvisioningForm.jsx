import React from 'react';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import ProvisioningFormCustomer from './ProvisioningFormCustomer';
import ProvisioningFormTerm from './ProvisioningFormTerm';
import ProvisioningFormFundContainer from './ProvisioningFormFundContainer';
import ProvisioningFormCatalogContainer from './ProvisioningFormCatalogContainer';
import ProvisioningFormSubsidy from './ProvisioningFormSubsidy';

const ProvisioningForm = () => {
  const { FORM } = PROVISIONING_PAGE_TEXT;
  return (
    <div className="m-0 p-0">
      <div className="mt-5">
        <h2>{FORM.SUB_TITLE}</h2>
      </div>
      <ProvisioningFormCustomer />
      <ProvisioningFormTerm />
      <ProvisioningFormSubsidy />
      <ProvisioningFormFundContainer />
      <ProvisioningFormCatalogContainer />
    </div>
  );
};

export default ProvisioningForm;
