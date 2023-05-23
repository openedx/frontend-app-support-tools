import React, { useState } from 'react';
import {
  Form,
} from '@edx/paragon';
import { v4 as uuidv4 } from 'uuid';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import useProvisioningContext from '../data/hooks';
import { selectProvisioningContext } from '../data/utils';

const ProvisioningFormSubsidy = () => {
  const { setSubsidyRevReq, setInvalidSubsidyFields } = useProvisioningContext();
  const { SUBSIDY_TYPE } = PROVISIONING_PAGE_TEXT.FORM;
  const [formData, showInvalidField] = selectProvisioningContext('formData', 'showInvalidField');
  const { subsidy } = showInvalidField;
  const [value, setValue] = useState(null);

  const handleChange = async (e) => {
    const newTabValue = e.target.value;
    setSubsidyRevReq(newTabValue);
    setValue(newTabValue);
    setInvalidSubsidyFields({ ...subsidy, subsidyRevReq: true });
  };

  return (
    <article className="mt-4.5">
      <div>
        <h3>{SUBSIDY_TYPE.TITLE}</h3>
      </div>
      <Form.Group className="mt-3.5">
        <Form.Label className="mb-2.5">{SUBSIDY_TYPE.SUB_TITLE}</Form.Label>
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
              isInvalid={subsidy?.subsidyRevReq === false}
            >
              {SUBSIDY_TYPE.OPTIONS[key]}
            </Form.Radio>
          ))
        }
        </Form.RadioSet>
        {subsidy?.subsidyRevReq === false && (
        <Form.Control.Feedback
          type="invalid"
        >
          {SUBSIDY_TYPE.ERROR}
        </Form.Control.Feedback>
        )}
      </Form.Group>
    </article>
  );
};

export default ProvisioningFormSubsidy;
