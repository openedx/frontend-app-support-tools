import React, { useState } from 'react';
import {
  Form,
} from '@edx/paragon';
import { v4 as uuidv4 } from 'uuid';
import { useContextSelector } from 'use-context-selector';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import useProvisioningContext from '../data/hooks';
import { ProvisioningContext } from '../ProvisioningContext';

const ProvisioningFormAccountType = () => {
  const { setMultipleFunds } = useProvisioningContext();
  const { ACCOUNT_CREATION } = PROVISIONING_PAGE_TEXT.FORM;
  // const { formData } = useContextSelector(ProvisioningContext, v => v[0]);
  const { formData } = useContextSelector(ProvisioningContext, v => v[0]);
  const [value, setValue] = useState(null);

  const handleChange = (e) => {
    const newTabValue = e.target.value;
    if (newTabValue === ACCOUNT_CREATION.OPTIONS.multiple) {
      setMultipleFunds(true);
    } else if (newTabValue === ACCOUNT_CREATION.OPTIONS.single) {
      setMultipleFunds(false);
    }
    setValue(newTabValue);
  };

  return (
    <article className="mt-4.5">
      <div>
        <h3>{ACCOUNT_CREATION.TITLE}</h3>
      </div>
      <p className="mt-4">{ACCOUNT_CREATION.SUB_TITLE}</p>
      <Form.RadioSet
        name="display-account-type"
        onChange={handleChange}
        value={value || formData?.multipleFunds}
      >
        {
          Object.keys(ACCOUNT_CREATION.OPTIONS).map((key) => (
            <Form.Radio
              value={ACCOUNT_CREATION.OPTIONS[key]}
              type="radio"
              key={uuidv4()}
              data-testid={ACCOUNT_CREATION.OPTIONS[key]}
            >
              {ACCOUNT_CREATION.OPTIONS[key]}
            </Form.Radio>
          ))
        }
      </Form.RadioSet>
    </article>
  );
};

export default ProvisioningFormAccountType;
