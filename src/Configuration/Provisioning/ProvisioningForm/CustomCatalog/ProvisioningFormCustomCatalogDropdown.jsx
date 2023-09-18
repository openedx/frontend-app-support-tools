import React, { useCallback, useEffect, useState } from 'react';
import { Form, Button } from '@edx/paragon';
import { v4 as uuidv4 } from 'uuid';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import useProvisioningContext from '../../data/hooks';
import { selectProvisioningContext, sortedCatalogQueries } from '../../data/utils';

const ProvisioningFormCustomCatalogDropdown = () => {
  const [catalogQueries, showInvalidField, isEditMode, customCatalog, formData] = selectProvisioningContext('catalogQueries', 'showInvalidField', 'isEditMode', 'customCatalog', 'formData');
  const { hydrateCatalogQueryData, setCatalogQueryCategory, setInvalidPolicyFields } = useProvisioningContext();
  const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  let submittedFormCustomCatalogTitle;
  if (isEditMode && customCatalog) {
    const catalogTitle = formData.policies[0].catalogQueryMetadata.catalogQuery.title;
    const catalogUuid = formData.policies[0].catalogQueryMetadata.catalogQuery.uuid;
    submittedFormCustomCatalogTitle = `${catalogTitle} --- ${catalogUuid}`;
    if (!catalogTitle && !catalogUuid) {
      submittedFormCustomCatalogTitle = CUSTOM_CATALOG.OPTIONS.enterpriseCatalogQuery.title;
    }
  }

  useEffect(() => {
    hydrateCatalogQueryData();
  }, []);

  const [selected, setSelected] = useState({ title: submittedFormCustomCatalogTitle || '' });
  const { policies } = showInvalidField;
  const isCatalogQueryMetadataDefinedAndFalse = policies[0]?.catalogQueryMetadata === false;
  const generateAutosuggestOptions = useCallback(() => {
    const defaultDropdown = (
      <Form.AutosuggestOption key={uuidv4()}>
        Loading
      </Form.AutosuggestOption>
    );
    if (catalogQueries.data.length > 0) {
      const sortedData = sortedCatalogQueries(catalogQueries.data);
      const apiCatalogQueries = sortedData.map(
        ({ title, uuid }) => (
          <Form.AutosuggestOption key={uuid}>
            {`${title} --- ${uuid}`}
          </Form.AutosuggestOption>
        ),
      );
      return apiCatalogQueries;
    }
    return defaultDropdown;
  });
  const handleOnSelected = (value) => {
    // TODO: In the future the index will have to be brought in for custom catalogs per group
    if (value) {
      const valueUuid = value.split(' --- ')[1].trim();
      setCatalogQueryCategory({
        catalogQueryMetadata: {
          catalogQuery: catalogQueries.data.find(({ uuid }) => uuid === valueUuid),
        },
      }, 0);
      setInvalidPolicyFields({ catalogQueryMetadata: true }, 0);
    }
    setSelected(prevState => ({ selected: { ...prevState.selected, title: value } }));
  };

  return (
    <div className="row">
      <div className="col-10">
        <Form.Group
          className="mt-4.5"
        >
          <Form.Autosuggest
            floatingLabel={CUSTOM_CATALOG.OPTIONS.enterpriseCatalogQuery.title}
            helpMessage={CUSTOM_CATALOG.OPTIONS.enterpriseCatalogQuery.subtitle}
            value={selected.title}
            onSelected={handleOnSelected}
            data-testid="custom-catalog-dropdown-autosuggest"
            isInvalid={isCatalogQueryMetadataDefinedAndFalse}
          >
            {generateAutosuggestOptions()}
          </Form.Autosuggest>
          {isCatalogQueryMetadataDefinedAndFalse && (
            <Form.Control.Feedback
              type="invalid"
            >
              {CUSTOM_CATALOG.OPTIONS.enterpriseCatalogQuery.error}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      </div>
      {/* TODO: Button should be removed in favor of react-query's refetch functionality */}
      <div className="col-2 align-self-center mb-3">
        <Button onClick={hydrateCatalogQueryData}>Refresh</Button>
      </div>
    </div>
  );
};

export default ProvisioningFormCustomCatalogDropdown;
