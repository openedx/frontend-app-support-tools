import { useContextSelector } from 'use-context-selector';
import {
  Container,
  Form,
} from '@edx/paragon';
import { v4 as uuidv4 } from 'uuid';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import { ProvisioningContext } from '../../ProvisioningContext';
import useProvisioningContext from '../../data/hooks';

const ProvisioningFormPerLearnerCap = ({ index }) => {
  const { perLearnerCap } = useProvisioningContext();
  const { LEARNER_CAP } = PROVISIONING_PAGE_TEXT.FORM;
  const { formData } = useContextSelector(ProvisioningContext, v => v[0]);
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
      <p className="mt-4">{LEARNER_CAP.SUB_TITLE}</p>
      <Container>
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
      </Container>
    </article>
  );
};

ProvisioningFormPerLearnerCap.propTypes = {
  index: PropTypes.number.isRequired,
};

export default ProvisioningFormPerLearnerCap;
