import React, { useCallback, useState } from 'react';
import { Form } from '@edx/paragon';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import useProvisioningContext from '../../data/hooks';
import { extractDefinedCatalogTitle, indexOnlyPropType, selectProvisioningContext } from '../../data/utils';
import { isWholeDollarAmount } from '../../../../utils';

const ProvisioningFormAccountDetails = ({ index }) => {
  const { ACCOUNT_DETAIL, ALERTS } = PROVISIONING_PAGE_TEXT.FORM;
  const { setAccountName, setAccountValue } = useProvisioningContext();
  const [multipleFunds, formData] = selectProvisioningContext('multipleFunds', 'formData');
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
      setAccountValueState(value);
    }
  }, [index, formData]);

  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <h3>{ACCOUNT_DETAIL.TITLE}</h3>
      </div>
      <Form.Group className="mt-3.5 mb-1">
        <Form.Control
          floatingLabel={ACCOUNT_DETAIL.OPTIONS.displayName}
          value={accountNameState}
          onChange={handleChange}
          data-testid="account-name"
        />
      </Form.Group>
      <Form.Group className="mt-3.5">
        <Form.Control
          floatingLabel={ACCOUNT_DETAIL.OPTIONS.totalAccountValue.title}
          value={accountValueState}
          onChange={handleChange}
          data-testid="account-value"
        />
        <Form.Control.Feedback>
          {formFeedbackText}
        </Form.Control.Feedback>
        {!isWholeDollar && (
          <Form.Control.Feedback
            type="invalid"
          >
            {ALERTS.incorrectDollarAmount}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </article>
  );
};

ProvisioningFormAccountDetails.propTypes = indexOnlyPropType;
export default ProvisioningFormAccountDetails;
