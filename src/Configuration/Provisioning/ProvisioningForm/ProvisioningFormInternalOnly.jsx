import React, { useState } from 'react';
import {
  Form,
} from '@openedx/paragon';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import useProvisioningContext from '../data/hooks';
import { selectProvisioningContext } from '../data/utils';

const ProvisioningFormInternalOnly = () => {
  const { setInternalOnly, setHasEdits } = useProvisioningContext();
  const { INTERNAL_ONLY } = PROVISIONING_PAGE_TEXT.FORM;
  const [formData, isEditMode, hasEdits] = selectProvisioningContext('formData', 'isEditMode', 'hasEdits');

  // formData.internalOnly is always defined, whether it's hydrated from an API call (isEditMode = true) or not
  // (isEditMode = false) in which case ProvisioningContextProvider supplies a default.
  const [value, setValue] = useState(formData.internalOnly || false);

  const handleChange = (e) => {
    const checkedState = e.target.checked;
    if (isEditMode && !hasEdits) {
      setHasEdits(true);
    }
    setInternalOnly(checkedState);
    setValue(checkedState);
  };

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
