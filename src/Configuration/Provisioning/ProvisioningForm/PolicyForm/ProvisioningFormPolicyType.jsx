import {
  Form,
} from '@openedx/paragon';
import { v4 as uuidv4 } from 'uuid';
import { useContextSelector } from 'use-context-selector';
import React, { useState } from 'react';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import useProvisioningContext from '../../data/hooks';
import ProvisioningFormHelpText from '../ProvisioningFormHelpText';
import { indexOnlyPropType } from '../../data/utils';
import { ProvisioningContext } from '../../ProvisioningContext';

const ProvisioningFormPolicyType = ({ index }) => {
  const {
    perLearnerCap,
    setPolicyType,
    setInvalidPolicyFields,
  } = useProvisioningContext();
  const { POLICY_TYPE } = PROVISIONING_PAGE_TEXT.FORM;
  const contextData = useContextSelector(ProvisioningContext, v => v[0]);
  const {
    isEditMode,
    formData,
    showInvalidField: { policies },
  } = contextData;
  const isFormFieldInvalid = policies[index]?.policyType === false;

  let submittedFormPolicyType;
  if (isEditMode) {
    submittedFormPolicyType = formData.policies[index].policyType;
  }
  const [value, setValue] = useState(submittedFormPolicyType || null);

  const handleChange = (e) => {
    const policyTypeValue = e.target.value;
    if (isEditMode) {
      return; // Editing policy type is not supported.
    }
    if (policyTypeValue === POLICY_TYPE.OPTIONS.LEARNER_SELECTS.VALUE) {
      setPolicyType({
        policyType: POLICY_TYPE.OPTIONS.LEARNER_SELECTS.VALUE,
        accessMethod: POLICY_TYPE.OPTIONS.LEARNER_SELECTS.ACCESS_METHOD,
      }, index);
    } else if (policyTypeValue === POLICY_TYPE.OPTIONS.ADMIN_SELECTS.VALUE) {
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
        <Form.Label>{POLICY_TYPE.LABEL}</Form.Label>
        <p className="text-gray">
          {(submittedFormPolicyType === POLICY_TYPE.OPTIONS.ADMIN_SELECTS.VALUE)
            && POLICY_TYPE.OPTIONS.ADMIN_SELECTS.DESCRIPTION}
          {(submittedFormPolicyType === POLICY_TYPE.OPTIONS.LEARNER_SELECTS.VALUE)
            && POLICY_TYPE.OPTIONS.LEARNER_SELECTS.DESCRIPTION}
          <ProvisioningFormHelpText />
        </p>
        {!submittedFormPolicyType && (
        <Form.RadioSet
          name={`display-policy-type-${index}`}
          onChange={handleChange}
          value={value}
          className="mt-2.5"
        >
          {
            Object.values(POLICY_TYPE.OPTIONS).map(({ DESCRIPTION, VALUE }) => (
              <Form.Radio
                value={VALUE}
                type="radio"
                key={uuidv4()}
                data-testid={DESCRIPTION}
                data-description={DESCRIPTION}
                isInvalid={isFormFieldInvalid}
              >
                {DESCRIPTION}
              </Form.Radio>
            ))
          }
        </Form.RadioSet>
        )}
        {isFormFieldInvalid && (
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
