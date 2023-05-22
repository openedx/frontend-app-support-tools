import {
  Form,
} from '@edx/paragon';
import { v4 as uuidv4 } from 'uuid';
import React, { useState } from 'react';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import useProvisioningContext from '../../data/hooks';
import { indexOnlyPropType, selectProvisioningContext } from '../../data/utils';

const ProvisioningFormPerLearnerCap = ({ index }) => {
  const { perLearnerCap } = useProvisioningContext();
  const { LEARNER_CAP } = PROVISIONING_PAGE_TEXT.FORM;
  const [formData] = selectProvisioningContext('formData');
  const [value, setValue] = useState(null);

  const handleChange = (e) => {
    const newTabValue = e.target.value;
    if (newTabValue === LEARNER_CAP.OPTIONS.yes) {
      perLearnerCap({
        perLearnerCap: true,
      }, index);
    } else if (newTabValue === LEARNER_CAP.OPTIONS.no) {
      perLearnerCap({
        perLearnerCap: false,
      }, index);
    }
    setValue(newTabValue);
  };
  return (
    <article className="mt-4.5">
      <div>
        <h3>{LEARNER_CAP.TITLE}</h3>
      </div>
      <Form.Group className="mt-3.5">
        <Form.Label className="mb-2.5">{LEARNER_CAP.SUB_TITLE}</Form.Label>
        <Form.RadioSet
          name={`display-per-learner-cap-${index}`}
          onChange={handleChange}
          value={value || formData.policies[index]?.perLearnerCap}
        >
          {
          Object.keys(LEARNER_CAP.OPTIONS).map((key) => (
            <Form.Radio
              value={LEARNER_CAP.OPTIONS[key]}
              type="radio"
              key={uuidv4()}
              data-testid={LEARNER_CAP.OPTIONS[key]}
            >
              {LEARNER_CAP.OPTIONS[key]}
            </Form.Radio>
          ))
        }
        </Form.RadioSet>
        <Form.Control.Feedback>{LEARNER_CAP.ERROR}</Form.Control.Feedback>
      </Form.Group>
    </article>
  );
};

ProvisioningFormPerLearnerCap.propTypes = indexOnlyPropType;

export default ProvisioningFormPerLearnerCap;
