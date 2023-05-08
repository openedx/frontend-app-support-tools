import {
  Form,
} from '@edx/paragon';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import useProvisioningContext from '../data/hooks';
import { selectProvisioningContext } from '../data/utils';
import ProvisioningFormCustomerDropdown from './ProvisioningFormCustomerDropdown';

const ProvisioningFormCustomer = () => {
  const { CUSTOMER } = PROVISIONING_PAGE_TEXT.FORM;
  const [formData] = selectProvisioningContext('formData');
  const { setFinancialIdentifier } = useProvisioningContext();
  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <h3>{CUSTOMER.TITLE}</h3>
      </div>
      <Form.Group className="mt-4.5 mb-1">
        <ProvisioningFormCustomerDropdown />
      </Form.Group>
      <Form.Group className="mt-4.5">
        <Form.Control
          floatingLabel={CUSTOMER.FINANCIAL_IDENTIFIER.TITLE}
          defaultValue={formData.financialIdentifier || undefined}
          onChange={e => setFinancialIdentifier(e.target.value)}
          data-testid="customer-financial-identifier"
        />
      </Form.Group>
    </article>
  );
};

export default ProvisioningFormCustomer;
