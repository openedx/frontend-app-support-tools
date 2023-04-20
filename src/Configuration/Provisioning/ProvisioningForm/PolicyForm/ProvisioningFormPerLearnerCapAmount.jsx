import {
  Form,
} from '@edx/paragon';
import { useState } from 'react';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import useProvisioningContext from '../../data/hooks';
import { indexOnlyPropType } from '../../data/utils';
import { isWholeDollarAmount } from '../../../../utils';

const ProvisioningFormPerLearnerCapAmount = ({ index }) => {
  const { LEARNER_CAP_DETAIL, ALERTS } = PROVISIONING_PAGE_TEXT.FORM;
  const { setPerLearnerCap } = useProvisioningContext();
  const [isWholeDollar, setIsWholeDollar] = useState(true);
  const [perLearnerCapValue, setPerLearnerCapValue] = useState('');

  const handleChange = (e) => {
    const newEventValue = e.target.value;
    if (newEventValue !== '' && !isWholeDollarAmount(newEventValue)) {
      setIsWholeDollar(false);
      return;
    }
    setIsWholeDollar(true);
    setPerLearnerCap({
      perLearnerCapAmount: newEventValue,
    }, index);
    setPerLearnerCapValue(newEventValue);
  };

  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <h4>{LEARNER_CAP_DETAIL.TITLE}</h4>
      </div>
      <Form.Group className="mt-4.5">
        <Form.Control
          floatingLabel={LEARNER_CAP_DETAIL.OPTIONS.perLearnerSpendCap.title}
          onChange={handleChange}
          data-testid="per-learner-spend-cap-amount"
          value={perLearnerCapValue}
        />
        <Form.Control.Feedback>
          {LEARNER_CAP_DETAIL.OPTIONS.perLearnerSpendCap.subtitle}
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

ProvisioningFormPerLearnerCapAmount.propTypes = indexOnlyPropType;

export default ProvisioningFormPerLearnerCapAmount;
