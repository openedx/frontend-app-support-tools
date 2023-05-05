import React, { useState } from 'react';
import {
  Form,
  Container,
} from '@edx/paragon';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import useProvisioningContext from '../data/hooks';

const ProvisioningFormInternalOnly = () => {
  const { setInternalOnly } = useProvisioningContext();
  const { INTERNAL_ONLY } = PROVISIONING_PAGE_TEXT.FORM;
  const [value, setValue] = useState(false);

  const handleChange = async (e) => {
    const checkedState = e.target.checked;
    setInternalOnly(checkedState);
    setValue(checkedState);
  };
  return (
    <article className="mt-4.5">
      <div>
        <h3>{INTERNAL_ONLY.TITLE}</h3>
      </div>
      <Container className="mt-4">
        <Form.Checkbox
          description={INTERNAL_ONLY.CHECKBOX.description}
          onChange={handleChange}
          checked={value}
          data-testid="internal-only-checkbox"
        >
          {INTERNAL_ONLY.CHECKBOX.label}
        </Form.Checkbox>
      </Container>
    </article>
  );
};

export default ProvisioningFormInternalOnly;
