import React, { useState } from 'react';
import {
  Form,
  Hyperlink,
  Container,
} from '@edx/paragon';
import { v4 as uuidv4 } from 'uuid';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import useProvisioningContext from '../../data/hooks';
import { indexOnlyPropType, selectProvisioningContext } from '../../data/utils';

// TODO: Replace URL for hyperlink to somewhere to display catalog content information
const ProvisioningFormCatalog = ({ index }) => {
  const { setCustomCatalog, setCatalogQueryCategory } = useProvisioningContext();
  const { CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  const [multipleFunds, formData] = selectProvisioningContext('multipleFunds', 'formData');
  const [value, setValue] = useState(null);

  if (multipleFunds === undefined) {
    return null;
  }

  const handleChange = (e) => {
    const newTabValue = e.target.value;
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
          catalogQuery: 'To Be Populated with a Predetermined Catalog Query that currently does not exist',
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
      {multipleFunds && (
      <Hyperlink
        target="_blank"
        destination="https://www.google.com"
      >
        {formData.policies[index]?.catalogQueryTitle.split(' account')[0]}
      </Hyperlink>
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
