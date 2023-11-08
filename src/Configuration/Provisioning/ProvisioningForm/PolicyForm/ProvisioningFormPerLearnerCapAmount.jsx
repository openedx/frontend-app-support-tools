import {
  Form,
} from '@edx/paragon';
import { useState } from 'react';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import useProvisioningContext from '../../data/hooks';
import { indexOnlyPropType, selectProvisioningContext } from '../../data/utils';
import { isWholeDollarAmount } from '../../../../utils';

const ProvisioningFormPerLearnerCapAmount = ({ index }) => {
  const { LEARNER_CAP_DETAIL } = PROVISIONING_PAGE_TEXT.FORM;
  const { setPerLearnerCap, setInvalidPolicyFields, setHasEdits } = useProvisioningContext();
  const [formData, showInvalidField, isEditMode, hasEdits] = selectProvisioningContext('formData', 'showInvalidField', 'isEditMode', 'hasEdits');
  const { policies } = showInvalidField;
  const isPerLearnerCapAmountDefinedAndFalse = policies[index]?.perLearnerCapAmount === false;
  const [isWholeDollar, setIsWholeDollar] = useState(true);

  let submittedFormPerLearnerCapAmount;
  if (isEditMode) {
    // Currency in formData is ALWAYS in cents, so we must convert to dollars to use for component-local state.
    submittedFormPerLearnerCapAmount = formData.policies[index].perLearnerCapAmount / 100;
  }

  // Currency in component-local state is ALWAYS in dollars.
  const [perLearnerCapValue, setPerLearnerCapValue] = useState(submittedFormPerLearnerCapAmount || '');
  const handleChange = (e) => {
    if (isEditMode && !hasEdits) {
      setHasEdits(true);
    }
    const newEventValue = e.target.value;
    if (newEventValue !== '' && !isWholeDollarAmount(newEventValue)) {
      setIsWholeDollar(false);
      setInvalidPolicyFields({ perLearnerCapAmount: false }, index);
      return;
    }
    setIsWholeDollar(true);
    // Currency in formData is ALWAYS in cents.
    setPerLearnerCap({ perLearnerCapAmount: parseInt(newEventValue, 10) * 100 }, index);
    setInvalidPolicyFields({ perLearnerCapAmount: true }, index);
    // Currency in component-local state is ALWAYS in dollars.
    setPerLearnerCapValue(newEventValue);
  };
  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <h4>{LEARNER_CAP_DETAIL.TITLE}</h4>
      </div>
      <Form.Group
        className="mt-3.5"
      >
        <Form.Control
          floatingLabel={LEARNER_CAP_DETAIL.OPTIONS.perLearnerSpendCap.title}
          onChange={handleChange}
          data-testid="per-learner-spend-cap-amount"
          value={perLearnerCapValue}
          isInvalid={!isWholeDollar || isPerLearnerCapAmountDefinedAndFalse}
        />
        <Form.Control.Feedback>
          {LEARNER_CAP_DETAIL.OPTIONS.perLearnerSpendCap.subtitle}
        </Form.Control.Feedback>
        {!isWholeDollar && (
          <Form.Control.Feedback
            type="invalid"
          >
            {LEARNER_CAP_DETAIL.ERROR.incorrectDollarAmount}
          </Form.Control.Feedback>
        )}
        {isPerLearnerCapAmountDefinedAndFalse && (
          <Form.Control.Feedback
            type="invalid"
          >
            {LEARNER_CAP_DETAIL.ERROR.emptyField}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </article>
  );
};

ProvisioningFormPerLearnerCapAmount.propTypes = indexOnlyPropType;

export default ProvisioningFormPerLearnerCapAmount;
