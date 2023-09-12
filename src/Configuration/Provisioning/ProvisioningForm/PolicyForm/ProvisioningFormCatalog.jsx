import React, { useState } from 'react';
import {
  Form,
} from '@edx/paragon';
import { v4 as uuidv4 } from 'uuid';
import { useContextSelector } from 'use-context-selector';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import useProvisioningContext from '../../data/hooks';
import { extractDefinedCatalogTitle, getCamelCasedConfigAttribute, indexOnlyPropType } from '../../data/utils';
import { ProvisioningContext } from '../../ProvisioningContext';

// TODO: Replace URL for hyperlink to somewhere to display catalog content information
const ProvisioningFormCatalog = ({ index }) => {
  const {
    setCustomCatalog,
    setCatalogQueryCategory,
    setInvalidPolicyFields,
    setHasEdits,
  } = useProvisioningContext();
  const { CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  const contextData = useContextSelector(ProvisioningContext, v => v[0]);
  const {
    customCatalog,
    isEditMode,
    multipleFunds,
    formData,
    showInvalidField: { policies },
    hasEdits,
  } = contextData;
  const isCatalogQueryMetadataDefinedAndFalse = policies[index]?.catalogQueryMetadata === false;
  const camelCasedQueries = getCamelCasedConfigAttribute('PREDEFINED_CATALOG_QUERIES');

  let submittedFormAssociatedCatalog;
  if (isEditMode && !multipleFunds) {
    if (customCatalog) {
      submittedFormAssociatedCatalog = CATALOG.OPTIONS.custom;
    } else {
      submittedFormAssociatedCatalog = formData.policies[index].catalogQueryMetadata.catalogQuery.title;
    }
  }

  const [value, setValue] = useState(submittedFormAssociatedCatalog || null);
  const customCatalogSelected = value === CATALOG.OPTIONS.custom;
  if (multipleFunds === undefined) {
    return null;
  }

  const handleChange = (e) => {
    const newTabValue = e.target.value;
    const newCatalogQuery = e.target.dataset.catalogqueryid;
    if (isEditMode && !hasEdits) {
      setHasEdits(true);
    }
    if (newTabValue === CATALOG.OPTIONS.custom) {
      setCustomCatalog(true);
      setCatalogQueryCategory({
        catalogQueryMetadata: {
          catalogQuery: '',
        },
      }, index);
    } else if (newTabValue !== CATALOG.OPTIONS.custom) {
      setCustomCatalog(false);
      setCatalogQueryCategory({
        catalogQueryMetadata: {
          catalogQuery: {
            id: newCatalogQuery,
            title: newTabValue,
          },
        },
      }, index);
    }
    setValue(newTabValue);
    setInvalidPolicyFields({ catalogQueryMetadata: true }, index);
  };

  return (
    <article className="mt-4.5">
      <div>
        <h3>{CATALOG.TITLE}</h3>
      </div>
      <Form.Group className="mt-3.5">
        <Form.Label className="mb-2.5">{CATALOG.SUB_TITLE}</Form.Label>
        {multipleFunds && (
        <h4>
          {extractDefinedCatalogTitle(formData.policies[index])}
        </h4>
        )}
        {multipleFunds === false && (
          <>
            <Form.RadioSet
              name="display-catalog-content"
              onChange={handleChange}
              value={value || formData.policies[index].catalogCategory}
            >
              {
            Object.keys(CATALOG.OPTIONS).map((key) => (
              <Form.Radio
                value={CATALOG.OPTIONS[key]}
                type="radio"
                key={uuidv4()}
                data-testid={CATALOG.OPTIONS[key]}
                data-catalogqueryid={camelCasedQueries[key]}
                isInvalid={customCatalogSelected ? false : isCatalogQueryMetadataDefinedAndFalse}
              >
                {CATALOG.OPTIONS[key]}
              </Form.Radio>
            ))
          }
            </Form.RadioSet>
            {!customCatalogSelected && isCatalogQueryMetadataDefinedAndFalse && (
            <Form.Control.Feedback
              type="invalid"
            >
              {CATALOG.ERROR}
            </Form.Control.Feedback>
            )}
          </>
        )}
      </Form.Group>
    </article>
  );
};

ProvisioningFormCatalog.propTypes = indexOnlyPropType;

export default ProvisioningFormCatalog;
