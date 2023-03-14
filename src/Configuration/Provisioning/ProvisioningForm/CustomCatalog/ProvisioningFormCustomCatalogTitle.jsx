import React from 'react';
import { Form } from '@edx/paragon';
import PROVISIONING_PAGE_TEXT from '../../data/constants';

const ProvisioningFormCustomCatalogTitle = () => {
  const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  return (
    <article className="mt-4.5">
      <Form.Group className="mt-4.5 mb-1">
        <Form.Control
          floatingLabel={CUSTOM_CATALOG.OPTIONS.catalogTitle}
        />
      </Form.Group>
    </article>
  );
};

export default ProvisioningFormCustomCatalogTitle;
