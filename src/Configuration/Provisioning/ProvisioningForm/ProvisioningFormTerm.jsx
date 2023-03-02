import {
  Form,
} from '@edx/paragon';
import PROVISIONING_PAGE_TEXT from '../data/constants';

const ProvisioningFormTerm = () => {
  const { TERM } = PROVISIONING_PAGE_TEXT.FORM;
  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <h3>{TERM.TITLE}</h3>
      </div>
      <Form.Group className="mt-4.5 mb-1">
        <Form.Control
          type="date"
          floatingLabel="Start Date"
        />
      </Form.Group>
      <Form.Group className="mt-4.5">
        <Form.Control
          type="date"
          floatingLabel="End Date"
        />
      </Form.Group>
    </article>
  );
};

export default ProvisioningFormTerm;
