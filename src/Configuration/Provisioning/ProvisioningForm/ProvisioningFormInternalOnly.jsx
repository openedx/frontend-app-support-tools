import React, { useState } from 'react';
import {
  Form,
  Container,
} from '@edx/paragon';
import { v4 as uuidv4 } from 'uuid';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import useProvisioningContext from '../data/hooks';
import { selectProvisioningContext } from '../data/utils';

const ProvisioningFormInternalOnly = () => {
  const { setInternalOnly } = useProvisioningContext();
  const { INTERNAL_ONLY } = PROVISIONING_PAGE_TEXT.FORM;
  const [formData] = selectProvisioningContext('formData');
  const [value, setValue] = useState(null);

  const handleChange = async (e) => {
    const newTabValue = e.target.value;
    setInternalOnly(newTabValue);
    setValue(newTabValue);
  };

  return (
    <article className="mt-4.5">
      <div>
        <h3>{INTERNAL_ONLY.TITLE}</h3>
      </div>
      <p className="mt-4">{INTERNAL_ONLY.SUB_TITLE}</p>
      <Container>
        <Form.RadioSet
          name="display-internally-only"
          onChange={handleChange}
          value={value || formData.subsidyRevReq}
        >
          {
          Object.keys(INTERNAL_ONLY.OPTIONS).map((key) => (
            <Form.Radio
              value={INTERNAL_ONLY.OPTIONS[key]}
              type="radio"
              key={uuidv4()}
              data-testid={INTERNAL_ONLY.OPTIONS[key]}
            >
              {INTERNAL_ONLY.OPTIONS[key]}
            </Form.Radio>
          ))
        }
        </Form.RadioSet>
      </Container>
    </article>
  );
};

export default ProvisioningFormInternalOnly;
