import {
  Form,
} from '@edx/paragon';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import useProvisioningContext from '../data/hooks';

const ProvisioningFormCustomer = () => {
  const { CUSTOMER } = PROVISIONING_PAGE_TEXT.FORM;
  const { setCustomerUUID, setFinancialIdentifier } = useProvisioningContext();
  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <h3>{CUSTOMER.TITLE}</h3>
      </div>
      <Form.Group className="mt-4.5 mb-1">
        <Form.Control
          floatingLabel={CUSTOMER.OPTIONS.enterpriseUUID}
          onChange={e => setCustomerUUID(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mt-4.5">
        <Form.Control
          floatingLabel={CUSTOMER.OPTIONS.financialIdentifier}
          onChange={e => setFinancialIdentifier(e.target.value)}
        />
      </Form.Group>
    </article>
  );
};

export default ProvisioningFormCustomer;
