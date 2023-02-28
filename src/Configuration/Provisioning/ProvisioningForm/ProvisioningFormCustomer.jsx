import {
  Form,
} from '@edx/paragon';

const ProvisioningFormCustomer = () => (
  <article className="mt-4.5">
    <div className="mb-1">
      <h3>Customer</h3>
    </div>
    <Form.Group className="mt-4.5 mb-1">
      <Form.Control
        floatingLabel="Enterprise Customer UUID"
      />
    </Form.Group>
    <Form.Group className="mt-4.5">
      <Form.Control
        floatingLabel="Financial Linkage Identifier"
      />
    </Form.Group>
  </article>
);

export default ProvisioningFormCustomer;
