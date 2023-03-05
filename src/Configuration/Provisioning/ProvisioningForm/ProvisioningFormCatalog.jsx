import React, { useState } from 'react';
import {
  Form,
} from '@edx/paragon';
import { v4 as uuidv4 } from 'uuid';
import { useContextSelector } from 'use-context-selector';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import useProvisioningContext from '../data/hooks';
import { ProvisioningContext } from '../ProvisioningContext';

const ProvisioningFormCatalog = () => {
  const { setCustomCatalog } = useProvisioningContext();
  const { CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  const { multipleFunds } = useContextSelector(ProvisioningContext, v => v[0]);
  const [value, setValue] = useState(null);

  if (multipleFunds === undefined || multipleFunds) {
    return null;
  }

  const handleChange = async (e) => {
    const newTabValue = e.target.value;
    if (newTabValue === CATALOG.OPTIONS.custom) {
      setCustomCatalog(true);
    } else if (newTabValue !== CATALOG.OPTIONS.custom) {
      setCustomCatalog(false);
    }
    setValue(newTabValue);
  };

  return (
    <article className="mt-4.5">
      <div>
        <h3>{CATALOG.TITLE}</h3>
      </div>
      <p className="mt-4">{CATALOG.SUB_TITLE}</p>
      <Form.RadioSet
        name="display-content"
        onChange={handleChange}
        value={value}
      >
        {
          Object.keys(CATALOG.OPTIONS).map((key) => (
            <Form.Radio
              value={CATALOG.OPTIONS[key]}
              type="radio"
              key={uuidv4()}
            >
              {CATALOG.OPTIONS[key]}
            </Form.Radio>
          ))
        }
      </Form.RadioSet>
    </article>
  );
};

export default ProvisioningFormCatalog;
