import React, { useEffect, useState } from 'react';
import {
  Form,
} from '@edx/paragon';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import useProvisioningContext from '../data/hooks';
import { selectProvisioningContext } from '../data/utils';

const ProvisioningFormInternalOnly = () => {
  const { setInternalOnly } = useProvisioningContext();
  const { INTERNAL_ONLY } = PROVISIONING_PAGE_TEXT.FORM;
  const [formData, isEditMode] = selectProvisioningContext('formData', 'isEditMode');

  let submittedFormInternalOnly;
  if (isEditMode) {
    submittedFormInternalOnly = formData.internalOnly;
  }
  const [value, setValue] = useState(submittedFormInternalOnly || false);

  const handleChange = async (e) => {
    const checkedState = e.target.checked;
    setInternalOnly(checkedState);
    setValue(checkedState);
  };

  useEffect(() => {
    if (!value) {
      setInternalOnly(value);
    }
  }, [value]);

  return (
    <article className="mt-4.5">
      <div>
        <h3>{INTERNAL_ONLY.TITLE}</h3>
      </div>
      <Form.Group
        className="mt-3.5"
      >
        <Form.Checkbox
          description={INTERNAL_ONLY.CHECKBOX.description}
          onChange={handleChange}
          checked={value}
          data-testid="internal-only-checkbox"
        >
          {INTERNAL_ONLY.CHECKBOX.label}
        </Form.Checkbox>
      </Form.Group>
    </article>
  );
};

export default ProvisioningFormInternalOnly;
