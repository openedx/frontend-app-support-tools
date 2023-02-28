import {
  Container,
} from '@edx/paragon';
import React from 'react';
import ProvisioningFormCustomer from './ProvisioningFormCustomer';
import ProvisioningFormFundType from './ProvisioningFormFundType';
import ProvisioningFormTerm from './ProvisioningFormTerm';

const ProvisioningForm = () => (
  <Container className="m-0 p-0" size="md" fluid>
    <div className="mt-5">
      <h2>Plan Details</h2>
    </div>
    <ProvisioningFormCustomer />
    <ProvisioningFormTerm />
    <ProvisioningFormFundType />
  </Container>
);

export default ProvisioningForm;
