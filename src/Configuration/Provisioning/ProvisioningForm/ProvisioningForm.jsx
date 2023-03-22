import React, { useEffect } from 'react';
import { useContextSelector } from 'use-context-selector';
import { Alert } from '@edx/paragon';
import PROVISIONING_PAGE_TEXT, { INITIAL_CATALOG_QUERIES } from '../data/constants';
import ProvisioningFormCustomer from './ProvisioningFormCustomer';
import ProvisioningFormTerm from './ProvisioningFormTerm';
import ProvisioningFormSubsidy from './ProvisioningFormSubsidy';
import ProvisioningFormPolicyContainer from './PolicyForm';
import ProvisioningFormAccountType from './ProvisioningFormAccountType';
import ProvisioningFormSubmissionButton from './ProvisioningFormSubmissionButton';
import { ProvisioningContext } from '../ProvisioningContext';
import useProvisioningContext from '../data/hooks';

const ProvisioningForm = () => {
  const { FORM } = PROVISIONING_PAGE_TEXT;
  const { multipleFunds, alertMessage } = useContextSelector(ProvisioningContext, v => v[0]);
  // TODO: Extract catalog queries from API to iterate and render policies instead of this for V1
  const { multipleQueries, defaultQuery } = INITIAL_CATALOG_QUERIES;
  const sampleCatalogQuery = multipleFunds ? multipleQueries : defaultQuery;
  const { instantiateMultipleFormData, resetPolicies } = useProvisioningContext();

  useEffect(() => {
    resetPolicies();
    instantiateMultipleFormData(sampleCatalogQuery);
  }, [multipleFunds]);

  const renderAlert = () => {
    if (multipleFunds === undefined || alertMessage) {
      return (
        <Alert variant="warning" className="mt-5">
          {alertMessage}
        </Alert>
      );
    }
    return null;
  };
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
      {renderAlert()}
      <ProvisioningFormSubmissionButton />
    </div>
  );
};

export default ProvisioningForm;
