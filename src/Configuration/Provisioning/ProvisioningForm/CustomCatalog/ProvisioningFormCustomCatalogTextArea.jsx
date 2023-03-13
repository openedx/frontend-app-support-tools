import {
  Stack,
  Form,
} from '@edx/paragon';
import { useState, useEffect } from 'react';
import { useContextSelector } from 'use-context-selector';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import { ProvisioningContext } from '../../ProvisioningContext';

const ProvisioningFormCustomCatalogTextArea = () => {
  const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  const { formData } = useContextSelector(ProvisioningContext, v => v[0]);
  // TODO: Replace this with a real API response
  // const sampleCourseModesResponse = [
  //   'verified',
  //   'professional',
  //   'no-id-professional',
  //   'audit',
  //   'honor',
  // ];
  // const [courseModes] = useState(JSON.stringify(sampleCourseModesResponse, null, 4));

  const [catalogQueryContentFilter, setCatalogQueryContentFilter] = useState(
    JSON.stringify(formData.policies[0].catalogQueryMetadata.catalogQuery.contentFilter, null, 4),
  );

  useEffect(() => {
    setCatalogQueryContentFilter(
      JSON.stringify(formData.policies[0].catalogQueryMetadata.catalogQuery.contentFilter, null, 4),
    );
  }, [formData.policies[0].catalogQueryMetadata.catalogQuery.contentFilter]);
  return (
    <Stack className="mt-4.5">
      <Form.Control
        className="mb-1"
        as="textarea"
        style={{ height: '200px' }}
        floatingLabel={CUSTOM_CATALOG.OPTIONS.contentFilter}
        value={catalogQueryContentFilter}
        disabled
      />
      {/* Will need to be abstracted to a separate component when
       enterpriseCustomerCatalog Uuid is added to the API response */}
      {/* <Form.Control
        className="mt-4.5"
        as="textarea"
        style={{ height: '200px' }}
        floatingLabel={CUSTOM_CATALOG.OPTIONS.courseModes}
        value={courseModes}
        disabled
      /> */}
    </Stack>
  );
};

export default ProvisioningFormCustomCatalogTextArea;
