import React, { useCallback, useEffect } from 'react';
import { Button, Form } from '@openedx/paragon';
import { v4 as uuidv4 } from 'uuid';
import { logError } from '@edx/frontend-platform/logging';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import useProvisioningContext from '../../data/hooks';
import { selectProvisioningContext, sortedCustomCatalogs } from '../../data/utils';

const ProvisioningFormCustomCatalogDropdown = () => {
  const [
    existingEnterpriseCatalogs,
    showInvalidField,
    isEditMode,
    formData,
  ] = selectProvisioningContext(
    'existingEnterpriseCatalogs',
    'showInvalidField',
    'isEditMode',
    'formData',
  );
  const {
    hydrateEnterpriseCatalogsData,
    setInvalidPolicyFields,
    setPredefinedQueryType,
    setCatalogUuid,
    setCatalogTitle,
  } = useProvisioningContext();
  const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  let submittedFormCustomCatalogTitle;

  // TODO: In the future the index will have to be brought in for custom catalogs.
  const index = 0;
  if (isEditMode && formData.policies[index].oldCustomCatalog) {
    const { catalogTitle } = formData.policies[index];
    const { catalogUuid } = formData.policies[index];
    submittedFormCustomCatalogTitle = `${catalogTitle} --- ${catalogUuid}`;
  }
  const hydrateEnterpriseCatalogsDataCallback = useCallback(async () => {
    try {
      await hydrateEnterpriseCatalogsData(formData.enterpriseUUID);
    } catch (e) {
      logError(e);
    }
  }, [hydrateEnterpriseCatalogsData, formData.enterpriseUUID]);

  const handleClick = useCallback((e) => {
    const { currentTarget } = e;
    setPredefinedQueryType(undefined, index);
    setCatalogUuid(currentTarget.getAttribute('data-cataloguuid'), index);
    setCatalogTitle(currentTarget.getAttribute('data-catalogtitle'), index);
    setInvalidPolicyFields({ predefinedQueryType: true }, index);
  }, [setCatalogTitle, setCatalogUuid, setInvalidPolicyFields, setPredefinedQueryType]);

  const { policies } = showInvalidField;
  const isFormFieldInvalid = policies[index]?.catalogUuid === false;
  const customCatalogs = sortedCustomCatalogs(existingEnterpriseCatalogs.data);
  const isFormFieldReadonly = customCatalogs.length === 0;

  const generateAutosuggestOptions = useCallback(() => {
    /*
     * generateAutosuggestOptions supports cases where the catalogs are still loading, OR none were found.  In these
     * cases, the user messaging is simply displayed as the title of a sole option.
     */
    if (existingEnterpriseCatalogs.isLoading) {
      const loadingDropdownOptions = (
        <Form.AutosuggestOption key={uuidv4()}>
          Loading...
        </Form.AutosuggestOption>
      );
      return loadingDropdownOptions;
    }
    if (customCatalogs.length > 0) {
      // * Filter/sort catalogs to show only custom catalogs and most recently modified ones first.
      // * Use onClick on each option INSTEAD OF onSelected on the top-level Autosuggest because only onClick gives us
      //   the full event containing the custom data-* values.
      const autoSuggestOptions = customCatalogs.map(
        ({ title, uuid }) => (
          <Form.AutosuggestOption
            key={uuid}
            data-cataloguuid={uuid}
            data-catalogtitle={title}
            onClick={handleClick}
          >
            {`${title} --- ${uuid}`}
          </Form.AutosuggestOption>
        ),
      );
      return autoSuggestOptions;
    }
    const noCatalogsDropdownOptions = (
      <Form.AutosuggestOption key={uuidv4()}>
        No catalogs found for customer.
      </Form.AutosuggestOption>
    );
    return noCatalogsDropdownOptions;
  }, [existingEnterpriseCatalogs.isLoading, customCatalogs, handleClick]);

  useEffect(() => {
    hydrateEnterpriseCatalogsDataCallback();
  }, [hydrateEnterpriseCatalogsDataCallback]);

  return (
    <div className="row">
      <div className="col-10">
        <Form.Group
          className="mt-4.5"
        >
          <Form.Autosuggest
            floatingLabel={CUSTOM_CATALOG.OPTIONS.enterpriseCatalog.title}
            helpMessage={CUSTOM_CATALOG.OPTIONS.enterpriseCatalog.subtitle}
            value={submittedFormCustomCatalogTitle || ''}
            data-testid="custom-catalog-dropdown-autosuggest"
            isInvalid={isFormFieldInvalid}
            readOnly={isFormFieldReadonly}
          >
            {generateAutosuggestOptions()}
          </Form.Autosuggest>
          {isFormFieldInvalid && (
            <Form.Control.Feedback
              type="invalid"
            >
              {CUSTOM_CATALOG.OPTIONS.enterpriseCatalog.error}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      </div>
      {/* TODO: Button should be removed in favor of react-query's refetch functionality */}
      <div className="col-2 align-self-center mb-3">
        <Button onClick={hydrateEnterpriseCatalogsDataCallback}>Refresh</Button>
      </div>
    </div>
  );
};

export default ProvisioningFormCustomCatalogDropdown;
