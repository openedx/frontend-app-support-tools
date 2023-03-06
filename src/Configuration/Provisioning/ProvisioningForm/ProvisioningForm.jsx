import React, { useEffect } from 'react';
import { useContextSelector } from 'use-context-selector';
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
  const { multipleFunds } = useContextSelector(ProvisioningContext, v => v[0]);

  // TODO: Extract catalog queries from API to iterate and render policies instead of this for V1
  const { multipleQueries, defaultQuery } = INITIAL_CATALOG_QUERIES;
  const sampleCatalogQuery = multipleFunds ? multipleQueries : defaultQuery;
  const { instatiateMultipleFormData, resetPolicies } = useProvisioningContext();

  useEffect(() => {
    resetPolicies();
    instatiateMultipleFormData(sampleCatalogQuery);
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
      {sampleCatalogQuery && sampleCatalogQuery.map(({ uuid, catalogQueryTitle }, index) => (
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
