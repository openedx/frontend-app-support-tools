import React, { useEffect, useState } from 'react';
import { Form } from '@edx/paragon';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import { selectProvisioningContext } from '../../data/utils';

const ProvisioningFormCustomCatalogTitle = () => {
  const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  const [formData] = selectProvisioningContext('formData');
  const [catalogQueryTitle, setCatalogQueryTitle] = useState(
    formData.policies[0].catalogQueryMetadata.catalogQuery.title,
  );
  useEffect(() => {
    setCatalogQueryTitle(formData.policies[0].catalogQueryMetadata.catalogQuery.title);
  }, [formData.policies[0].catalogQueryMetadata.catalogQuery.title]);
  return (
    <article className="mt-4.5">
      <Form.Group className="mt-3.5 mb-1">
        <Form.Control
          floatingLabel={CUSTOM_CATALOG.OPTIONS.catalogTitle}
          value={catalogQueryTitle}
          disabled
        />
      </Form.Group>
    </article>
  );
};

export default ProvisioningFormCustomCatalogTitle;
