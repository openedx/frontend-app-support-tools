import React, { useState } from 'react';
import {
  Form,
} from '@edx/paragon';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import useProvisioningContext from '../../data/hooks';
import selectProvisioningContext from '../../data/utils';

// TODO: Replace URL for hyperlink to somewhere to display catalog content information
const ProvisioningFormCatalog = ({ index }) => {
  const { setCustomCatalog, setCatalogCategory } = useProvisioningContext();
  const { CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  const [multipleFunds, formData] = selectProvisioningContext('multipleFunds', 'formData');

  const [value, setValue] = useState(null);
  if (multipleFunds === undefined) {
    return null;
  }

  const handleChange = async (e) => {
    const newTabValue = e.target.value;
    if (newTabValue === CATALOG.OPTIONS.custom) {
      setCustomCatalog(true);
    } else if (newTabValue !== CATALOG.OPTIONS.custom) {
      setCustomCatalog(false);
    }
    setCatalogCategory({ catalogCategory: newTabValue });
    setValue(newTabValue);
  };

  return (
    <article className="mt-4.5">
      <div>
        <h3>{CATALOG.TITLE}</h3>
      </div>
      <p className="mt-4">{CATALOG.SUB_TITLE}</p>
      {multipleFunds && (
      <p>
        {formData?.policies[index]?.catalogQueryTitle.split(' account')[0]}
      </p>
      )}
      {multipleFunds === false && (
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
      )}
    </article>
  );
};

ProvisioningFormCatalog.propTypes = {
  index: PropTypes.number.isRequired,
};

export default ProvisioningFormCatalog;
