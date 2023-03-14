import React, { useState } from 'react';
import {
  Form,
} from '@edx/paragon';
import { v4 as uuidv4 } from 'uuid';
import { useContextSelector } from 'use-context-selector';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import { ProvisioningContext } from '../ProvisioningContext';
import useProvisioningContext from '../data/hooks';

const ProvisioningFormSubsidy = () => {
  const { setSubsidyRevReq } = useProvisioningContext();
  const { SUBSIDY_TYPE } = PROVISIONING_PAGE_TEXT.FORM;
  const { formData } = useContextSelector(ProvisioningContext, v => v[0]);
  const [value, setValue] = useState(null);

  const handleChange = async (e) => {
    const newTabValue = e.target.value;
    setSubsidyRevReq(newTabValue);
    setValue(newTabValue);
  };

  return (
    <article className="mt-4.5">
      <div>
        <h3>{SUBSIDY_TYPE.TITLE}</h3>
      </div>
      <p className="mt-4">{SUBSIDY_TYPE.SUB_TITLE}</p>
      <Form.RadioSet
        name="display-subsidy"
        onChange={handleChange}
        value={value || formData.subsidyRevReq}
      >
        {
          Object.keys(SUBSIDY_TYPE.OPTIONS).map((key) => (
            <Form.Radio
              value={SUBSIDY_TYPE.OPTIONS[key]}
              type="radio"
              key={uuidv4()}
              data-testid={SUBSIDY_TYPE.OPTIONS[key]}
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
