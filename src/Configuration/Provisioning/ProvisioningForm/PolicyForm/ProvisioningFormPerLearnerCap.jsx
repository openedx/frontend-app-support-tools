import { useContextSelector } from 'use-context-selector';
import {
  Form,
} from '@edx/paragon';
import { v4 as uuidv4 } from 'uuid';
import React, { useState } from 'react';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import { ProvisioningContext } from '../../ProvisioningContext';
import useProvisioningContext from '../../data/hooks';

const ProvisioningFormPerLearnerCap = () => {
  const { perLearnerCap } = useProvisioningContext();
  const { LEARNER_CAP } = PROVISIONING_PAGE_TEXT.FORM;
  const { formData } = useContextSelector(ProvisioningContext, v => v[0]);
  const [value, setValue] = useState(null);

  const handleChange = (e) => {
    const newTabValue = e.target.value;
    if (newTabValue === LEARNER_CAP.OPTIONS.yes) {
      perLearnerCap(true);
    } else if (newTabValue === LEARNER_CAP.OPTIONS.no) {
      perLearnerCap(false);
    }
    setValue(newTabValue);
  };

  return (
    <article className="mt-4.5">
      <div>
        <h3>{LEARNER_CAP.TITLE}</h3>
      </div>
      <p className="mt-4">{LEARNER_CAP.SUB_TITLE}</p>
      <Form.RadioSet
        name="display-learner-cap"
        onChange={handleChange}
        value={value || formData.perLearnerCap}
      >
        {
          Object.keys(LEARNER_CAP.OPTIONS).map((key) => (
            <Form.Radio
              value={LEARNER_CAP.OPTIONS[key]}
              type="radio"
              key={uuidv4()}
            >
              {LEARNER_CAP.OPTIONS[key]}
            </Form.Radio>
          ))
        }
      </Form.RadioSet>
    </article>
  );
};

export default ProvisioningFormPerLearnerCap;
