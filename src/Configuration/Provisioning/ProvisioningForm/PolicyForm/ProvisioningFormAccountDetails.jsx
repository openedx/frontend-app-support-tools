import React, { useCallback, useEffect, useState } from 'react';
import { Form } from '@edx/paragon';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import useProvisioningContext from '../../data/hooks';
import {
  extractDefinedCatalogTitle, generatePolicyName, indexOnlyPropType, selectProvisioningContext,
} from '../../data/utils';
import { isWholeDollarAmount } from '../../../../utils';

const ProvisioningFormAccountDetails = ({ index }) => {
  const { ACCOUNT_DETAIL } = PROVISIONING_PAGE_TEXT.FORM;
  const { setAccountName, setAccountValue, setInvalidPolicyFields } = useProvisioningContext();
  const [multipleFunds, formData, showInvalidField] = selectProvisioningContext('multipleFunds', 'formData', 'showInvalidField');

  const { policies } = showInvalidField;
  const isAccountNameDefinedAndFalse = policies[index]?.accountName === false;
  const isAccountValueDefinedAndFalse = policies[index]?.accountValue === false;

  const formFeedbackText = multipleFunds
    ? ACCOUNT_DETAIL.OPTIONS.totalAccountValue.dynamicSubtitle(extractDefinedCatalogTitle(formData.policies[index]))
    : ACCOUNT_DETAIL.OPTIONS.totalAccountValue.subtitle;

  const [accountValueState, setAccountValueState] = useState('');
  const [accountNameState, setAccountNameState] = useState('');
  const [isWholeDollar, setIsWholeDollar] = useState(true);

  const handleChange = useCallback((e) => {
    const newEvent = e.target;
    const { value, dataset } = newEvent;
    if (dataset.testid === 'account-name') {
      setAccountName({ accountName: value }, index);
      setInvalidPolicyFields({ accountName: true }, index);
      setAccountNameState(value);
      return;
    }
    if (dataset.testid === 'account-value') {
      if (value !== '' && !isWholeDollarAmount(value)) {
        setIsWholeDollar(false);
        return;
      }
      setIsWholeDollar(true);
      setAccountValue({ accountValue: value }, index);
      setInvalidPolicyFields({ accountValue: true }, index);
      setAccountValueState(value);
    }
  }, [index, formData]);

  useEffect(() => {
    if (formData.subsidyTitle) {
      setAccountName({ accountName: generatePolicyName(formData, index) }, index);
      setAccountNameState(generatePolicyName(formData, index));
    }
  }, [formData.subsidyTitle, formData.policies[index]?.catalogQueryMetadata, index]);

  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <h3>{ACCOUNT_DETAIL.TITLE}</h3>
      </div>
      <Form.Group
        className="mt-3.5 mb-1"
        isInvalid={isAccountNameDefinedAndFalse}
        disabled
      >
        <Form.Control
          floatingLabel={ACCOUNT_DETAIL.OPTIONS.displayName}
          value={accountNameState}
          onChange={handleChange}
          data-testid="account-name"
          disabled
        />
        {isAccountNameDefinedAndFalse && (
          <Form.Control.Feedback
            type="invalid"
          >
            {ACCOUNT_DETAIL.ERROR.emptyField}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Form.Group
        className="mt-3.5"
      >
        <Form.Control
          floatingLabel={ACCOUNT_DETAIL.OPTIONS.totalAccountValue.title}
          value={accountValueState}
          onChange={handleChange}
          data-testid="account-value"
          isInvalid={isAccountValueDefinedAndFalse || !isWholeDollar}
        />
        <Form.Control.Feedback>
          {formFeedbackText}
        </Form.Control.Feedback>
        {!isWholeDollar && (
          <Form.Control.Feedback
            type="invalid"
          >
            {ACCOUNT_DETAIL.ERROR.incorrectDollarAmount}
          </Form.Control.Feedback>
        )}
        {isAccountValueDefinedAndFalse && (
          <Form.Control.Feedback
            type="invalid"
          >
            {ACCOUNT_DETAIL.ERROR.emptyField}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </article>
  );
};

ProvisioningFormAccountDetails.propTypes = indexOnlyPropType;
export default ProvisioningFormAccountDetails;
