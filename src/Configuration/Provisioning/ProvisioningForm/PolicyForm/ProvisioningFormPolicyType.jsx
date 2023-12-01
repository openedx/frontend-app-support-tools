import {
  Form,
} from '@edx/paragon';
import { v4 as uuidv4 } from 'uuid';
import React, { useState } from 'react';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import useProvisioningContext from '../../data/hooks';
import { indexOnlyPropType, selectProvisioningContext } from '../../data/utils';

const ProvisioningFormPolicyType = ({ index }) => {
  const { perLearnerCap, setPolicyType, setInvalidPolicyFields } = useProvisioningContext();
  const { POLICY_TYPE } = PROVISIONING_PAGE_TEXT.FORM;
  const [formData, showInvalidField] = selectProvisioningContext('formData', 'showInvalidField');
  const { policies } = showInvalidField;
  const isPolicyTypeDefinedAndFalse = policies[index]?.policyType === false;

  const [value, setValue] = useState(null);

  const handleChange = (e) => {
    const policyTypeValue = e.target.value;
    if (policyTypeValue === POLICY_TYPE.OPTIONS.LEARNER_SELECTS.DESCRIPTION) {
      setPolicyType({
        policyType: POLICY_TYPE.OPTIONS.LEARNER_SELECTS.VALUE,
        accessMethod: POLICY_TYPE.OPTIONS.LEARNER_SELECTS.ACCESS_METHOD,
      }, index);
    } else if (policyTypeValue === POLICY_TYPE.OPTIONS.ADMIN_SELECTS.DESCRIPTION) {
      setPolicyType({
        policyType: POLICY_TYPE.OPTIONS.ADMIN_SELECTS.VALUE,
        accessMethod: POLICY_TYPE.OPTIONS.ADMIN_SELECTS.ACCESS_METHOD,
      }, index);
      perLearnerCap({
        perLearnerCap: false,
      }, index);
      setInvalidPolicyFields({ perLearnerCap: true }, index);
    }
    setValue(policyTypeValue);
    setInvalidPolicyFields({ policyType: true }, index);
  };

  return (
    <article className="mt-4.5">
      <div>
        <h3>{POLICY_TYPE.TITLE}</h3>
      </div>
      <Form.Group
        className="mt-3.5"
      >
        <Form.Label className="mb-2.5">{POLICY_TYPE.LABEL}</Form.Label>
        <Form.RadioSet
          name={`display-policy-type-${index}`}
          onChange={handleChange}
          value={value || formData.policies[index]?.policyType}
        >
          {
            Object.values(POLICY_TYPE.OPTIONS).map(({ DESCRIPTION }) => (
              <Form.Radio
                value={DESCRIPTION}
                type="radio"
                key={uuidv4()}
                data-testid={DESCRIPTION}
                isInvalid={isPolicyTypeDefinedAndFalse}
              >
                {DESCRIPTION}
              </Form.Radio>
            ))
          }
        </Form.RadioSet>
        {isPolicyTypeDefinedAndFalse && (
          <Form.Control.Feedback
            type="invalid"
          >
            {POLICY_TYPE.ERROR}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </article>
  );
};

ProvisioningFormPolicyType.propTypes = indexOnlyPropType;

export default ProvisioningFormPolicyType;
