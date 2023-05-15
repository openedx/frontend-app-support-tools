import {
  Form,
} from '@edx/paragon';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import useProvisioningContext from '../data/hooks';

const ProvisioningFormTitle = () => {
  const { setSubsidyTitle } = useProvisioningContext();
  const { FORM: { PLAN_TITLE } } = PROVISIONING_PAGE_TEXT;
  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <h3>{PLAN_TITLE.HEADER}</h3>
      </div>
      <Form.Group className="mt-4.5">
        <Form.Control
          floatingLabel={PLAN_TITLE.TITLE}
          onChange={e => setSubsidyTitle(e.target.value)}
          data-testid="customer-plan-title"
        />
      </Form.Group>
    </article>
  );
};

export default ProvisioningFormTitle;
