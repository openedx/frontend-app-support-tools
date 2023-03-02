import React, { useState } from 'react';
import {
  Form,
} from '@edx/paragon';
import { v4 as uuidv4 } from 'uuid';
import PROVISIONING_PAGE_TEXT from '../data/constants';

const ProvisioningFormSubsidy = () => {
  const { SUBSIDY_TYPE } = PROVISIONING_PAGE_TEXT.FORM;
  const [value, setValue] = useState(null);

  const handleChange = async (e) => {
    const newTabValue = e.target.value;
    setValue(newTabValue);
  };

  return (
    <article className="mt-4.5">
      <div>
        <h3>{SUBSIDY_TYPE.TITLE}</h3>
      </div>
      <p className="mt-4">{SUBSIDY_TYPE.SUB_TITLE}</p>
      <Form.RadioSet
        name="display-content"
        onChange={handleChange}
        value={value}
      >
        {
          Object.keys(SUBSIDY_TYPE.OPTIONS).map((key) => (
            <Form.Radio
              value={SUBSIDY_TYPE.OPTIONS[key]}
              type="radio"
              key={uuidv4()}
            >
              {SUBSIDY_TYPE.OPTIONS[key]}
            </Form.Radio>
          ))
        }
      </Form.RadioSet>
    </article>
  );
};

export default ProvisioningFormSubsidy;
