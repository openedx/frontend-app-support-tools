import {
  Form,
} from '@edx/paragon';

const ProvisioningFormTerm = () => (
  <article className="mt-4.5">
    <div className="mb-1">
      <h3>Term</h3>
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

export default ProvisioningFormTerm;
