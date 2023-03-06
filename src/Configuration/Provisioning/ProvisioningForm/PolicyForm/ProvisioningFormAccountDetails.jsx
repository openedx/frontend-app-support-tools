import React from 'react';
import { Form } from '@edx/paragon';
import PropTypes from 'prop-types';
import { useContextSelector } from 'use-context-selector';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import { ProvisioningContext } from '../../ProvisioningContext';
import useProvisioningContext from '../../data/hooks';

const ProvisioningFormAccountDetails = ({ index }) => {
  const { ACCOUNT_DETAIL } = PROVISIONING_PAGE_TEXT.FORM;
  const { setAccountName, setAccountValue } = useProvisioningContext();
  const { multipleFunds, formData } = useContextSelector(ProvisioningContext, v => v[0]);

  const formFeedbackText = multipleFunds
    ? ACCOUNT_DETAIL.OPTIONS.totalAccountValue.dynamicSubtitle(formData.policies[index]?.catalogQueryTitle.split(' account')[0])
    : ACCOUNT_DETAIL.OPTIONS.totalAccountValue.subtitle;

  const handleChange = (e) => {
    const newEvent = e.target;
    const { value, dataset } = newEvent;
    if (dataset.testid === 'account-name') {
      setAccountName({ accountName: value }, index);
    } else if (dataset.testid === 'account-value') {
      setAccountValue({ accountValue: value }, index);
    }
  };

  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <h3>{ACCOUNT_DETAIL.TITLE}</h3>
      </div>
      <Form.Group className="mt-4.5 mb-1">
        <Form.Control
          floatingLabel={ACCOUNT_DETAIL.OPTIONS.displayName}
          value={formData.policies[index]?.accountName || null}
          onChange={handleChange}
          data-testid="account-name"
        />
      </Form.Group>
      <Form.Group className="mt-4.5">
        <Form.Control
          floatingLabel={ACCOUNT_DETAIL.OPTIONS.totalAccountValue.title}
          value={formData.policies[index]?.totalAccountValue || null}
          onChange={handleChange}
          data-testid="account-value"
        />
        <Form.Control.Feedback>
          {formFeedbackText}
        </Form.Control.Feedback>
      </Form.Group>
    </article>
  );
};

ProvisioningFormAccountDetails.propTypes = {
  index: PropTypes.number.isRequired,
};

export default ProvisioningFormAccountDetails;
