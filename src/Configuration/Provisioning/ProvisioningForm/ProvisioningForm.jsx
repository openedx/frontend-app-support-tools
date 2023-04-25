import React, { useEffect } from 'react';
import { Alert } from '@edx/paragon';
import PROVISIONING_PAGE_TEXT, { INITIAL_CATALOG_QUERIES } from '../data/constants';
import ProvisioningFormCustomer from './ProvisioningFormCustomer';
import ProvisioningFormTerm from './ProvisioningFormTerm';
import ProvisioningFormSubsidy from './ProvisioningFormSubsidy';
import ProvisioningFormPolicyContainer from './PolicyForm';
import ProvisioningFormAccountType from './ProvisioningFormAccountType';
import ProvisioningFormSubmissionButton from './ProvisioningFormSubmissionButton';
import useProvisioningContext from '../data/hooks';
import { selectProvisioningContext } from '../data/utils';

const ProvisioningForm = () => {
  const { FORM } = PROVISIONING_PAGE_TEXT;
  const [multipleFunds, alertMessage, customers] = selectProvisioningContext('multipleFunds', 'alertMessage', 'customers');
  // TODO: Extract catalog queries from API to iterate and render policies instead of this for V1
  const { multipleQueries, defaultQuery } = INITIAL_CATALOG_QUERIES;
  const sampleCatalogQuery = multipleFunds ? multipleQueries : defaultQuery;
  const { instantiateMultipleFormData, resetPolicies, getCustomers } = useProvisioningContext();
  useEffect(() => {
    if (customers.length === 0) {
      getCustomers();
    }
    resetPolicies();
    instantiateMultipleFormData(sampleCatalogQuery);
  }, [multipleFunds]);

  return (
    <div className="m-0 p-0 mb-5">
      <div className="mt-5">
        <h2>{FORM.SUB_TITLE}</h2>
      </div>
      <ProvisioningFormCustomer />
      <ProvisioningFormTerm />
      <ProvisioningFormSubsidy />
      <ProvisioningFormAccountType />
      {!alertMessage && sampleCatalogQuery && sampleCatalogQuery.map(({ uuid, catalogQueryTitle }, index) => (
        <ProvisioningFormPolicyContainer
          key={uuid}
          title={catalogQueryTitle}
          index={index}
        />
      ))}
      {(multipleFunds === undefined || alertMessage) && (
      <Alert variant="warning" className="mt-5">
        {alertMessage}
      </Alert>
      )}
      <ProvisioningFormSubmissionButton />
    </div>
  );
};

export default ProvisioningForm;
