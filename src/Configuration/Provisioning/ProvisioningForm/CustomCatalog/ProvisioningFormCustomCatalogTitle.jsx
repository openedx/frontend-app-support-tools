import React, { useEffect, useState } from 'react';
import { Form } from '@edx/paragon';
import { useContextSelector } from 'use-context-selector';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import { ProvisioningContext } from '../../ProvisioningContext';

const ProvisioningFormCustomCatalogTitle = () => {
  const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  const { formData } = useContextSelector(ProvisioningContext, v => v[0]);
  const [catalogQueryTitle, setCatalogQueryTitle] = useState(
    formData.policies[0].catalogQueryMetadata.catalogQuery.title,
  );
  useEffect(() => {
    setCatalogQueryTitle(formData.policies[0].catalogQueryMetadata.catalogQuery.title);
  }, [formData.policies[0].catalogQueryMetadata.catalogQuery.title]);
  return (
    <article className="mt-4.5">
      <Form.Group className="mt-4.5 mb-1">
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
