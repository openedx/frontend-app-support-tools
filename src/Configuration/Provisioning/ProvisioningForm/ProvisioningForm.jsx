import React, { useEffect, useMemo } from 'react';
import { Alert } from '@edx/paragon';
import PROVISIONING_PAGE_TEXT, { INITIAL_CATALOG_QUERIES } from '../data/constants';
import ProvisioningFormCustomer from './ProvisioningFormCustomer';
import ProvisioningFormTerm from './ProvisioningFormTerm';
import ProvisioningFormSubsidy from './ProvisioningFormSubsidy';
import ProvisioningFormPolicyContainer from './PolicyForm';
import ProvisioningFormAccountType from './ProvisioningFormAccountType';
import ProvisioningFormSubmissionButton from './ProvisioningFormSubmissionButton';
import useProvisioningContext from '../data/hooks';
import { getCamelCasedConfigAttribute, selectProvisioningContext } from '../data/utils';

const ProvisioningForm = () => {
  const { FORM } = PROVISIONING_PAGE_TEXT;
  const [multipleFunds, alertMessage] = selectProvisioningContext('multipleFunds', 'alertMessage');
  const camelCasedQueries = getCamelCasedConfigAttribute('PREDEFINED_CATALOG_QUERIES');

  const { multipleQueries, defaultQuery } = INITIAL_CATALOG_QUERIES;
  const { instantiateMultipleFormData, resetPolicies } = useProvisioningContext();

  const assignedMultipleQueries = multipleQueries?.map((query, index) => ({
    ...query,
    catalogQueryMetadata: {
      catalogQuery: {
        id: camelCasedQueries[Object.keys(FORM.ACCOUNT_TYPE.OPTIONS)[index]],
        title: Object.values(FORM.ACCOUNT_TYPE.OPTIONS)[index],
      },
    },
  }));

  const definedCatalogQueries = useMemo(() => {
    if (multipleFunds) {
      return assignedMultipleQueries;
    }
    return defaultQuery;
  }, [multipleFunds]);

  useEffect(() => {
    resetPolicies();
    instantiateMultipleFormData(definedCatalogQueries);
  }, [multipleFunds, definedCatalogQueries]);
  return (
    <div className="m-0 p-0 mb-5">
      <div className="mt-5">
        <h2>{FORM.SUB_TITLE}</h2>
      </div>
      <ProvisioningFormCustomer />
      <ProvisioningFormTerm />
      <ProvisioningFormSubsidy />
      <ProvisioningFormAccountType />
      {!alertMessage && definedCatalogQueries?.map(({
        uuid,
        catalogQueryTitle,
      }, index) => (
        <ProvisioningFormPolicyContainer
          key={uuid}
          title={catalogQueryTitle}
          index={index}
        />
      ))}
      {alertMessage && (
      <Alert variant="warning" className="mt-5">
        {alertMessage}
      </Alert>
      )}
      <ProvisioningFormSubmissionButton />
    </div>
  );
};

export default ProvisioningForm;
