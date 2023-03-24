import {
  Stack,
  Form,
} from '@edx/paragon';
import { useState, useEffect } from 'react';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import { selectProvisioningContext } from '../../data/utils';

const ProvisioningFormCustomCatalogTextArea = () => {
  const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  const [formData] = selectProvisioningContext('formData');

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
    </Stack>
  );
};

export default ProvisioningFormCustomCatalogTextArea;
