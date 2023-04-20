import React, { useState } from 'react';
import {
  Form,
  Container,
} from '@edx/paragon';
import { v4 as uuidv4 } from 'uuid';
import { useContextSelector } from 'use-context-selector';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import useProvisioningContext from '../../data/hooks';
import { extractDefinedCatalogTitle, indexOnlyPropType } from '../../data/utils';
import { ProvisioningContext } from '../../ProvisioningContext';

// TODO: Replace URL for hyperlink to somewhere to display catalog content information
const ProvisioningFormCatalog = ({ index }) => {
  const { setCustomCatalog, setCatalogQueryCategory } = useProvisioningContext();
  const { CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  const contextData = useContextSelector(ProvisioningContext, v => v[0]);
  const { multipleFunds, formData } = contextData;
  const camelCasedQueries = camelCaseObject(getConfig().PREDEFINED_CATALOG_QUERIES);
  const [value, setValue] = useState(null);

  if (multipleFunds === undefined) {
    return null;
  }

  const handleChange = (e) => {
    const newTabValue = e.target.value;
    const newCatalogQuery = e.target.dataset.catalogqueryid;
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
  };

  return (
    <article className="mt-4.5">
      <div>
        <h3>{CATALOG.TITLE}</h3>
      </div>
      <p className="mt-4">{CATALOG.SUB_TITLE}</p>
      {multipleFunds
        && (
        <Container>
          <h4>
            {extractDefinedCatalogTitle(formData.policies[index])}
          </h4>
        </Container>
        )}
      {multipleFunds === false && (
      <Container>
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
              data-catalogQueryId={camelCasedQueries[key]}
            >
              {CATALOG.OPTIONS[key]}
            </Form.Radio>
          ))
        }
        </Form.RadioSet>
      </Container>
      )}
    </article>
  );
};

ProvisioningFormCatalog.propTypes = indexOnlyPropType;

export default ProvisioningFormCatalog;
