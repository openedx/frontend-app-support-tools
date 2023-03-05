import {
  Form,
} from '@edx/paragon';
import PROVISIONING_PAGE_TEXT from '../../data/constants';

const ProvisioningFormPerLearnerCapAmount = () => {
  const { LEARNER_CAP_DETAIL } = PROVISIONING_PAGE_TEXT.FORM;
  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <h4>{LEARNER_CAP_DETAIL.TITLE}</h4>
      </div>
      <Form.Group className="mt-4.5">
        <Form.Control
          floatingLabel={LEARNER_CAP_DETAIL.OPTIONS.perLearnerSpendCap.title}
        />
        <Form.Control.Feedback>
          {LEARNER_CAP_DETAIL.OPTIONS.perLearnerSpendCap.subtitle}
        </Form.Control.Feedback>
      </Form.Group>
    </article>
  );
};

export default ProvisioningFormPerLearnerCapAmount;
