import {
  Form,
} from '@edx/paragon';
import { useCallback, useState } from 'react';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import useProvisioningContext from '../data/hooks';
import { selectProvisioningContext } from '../data/utils';
import { isValidOpportunityProduct } from '../../../utils';
import ProvisioningFormCustomerDropdown from './ProvisioningFormCustomerDropdown';

const ProvisioningFormCustomer = () => {
  const { CUSTOMER } = PROVISIONING_PAGE_TEXT.FORM;
  const [formData] = selectProvisioningContext('formData');
  const { setFinancialIdentifier } = useProvisioningContext();
  const [isOpportunityProduct, setIsOpportunityProduct] = useState(true);

  const handleChange = useCallback((e) => {
    const newEvent = e.target;
    const { value, dataset } = newEvent;
    if (dataset.testid === 'customer-financial-identifier') {
      if (value !== '' && !isValidOpportunityProduct(value)) {
        setIsOpportunityProduct(false);
        return;
      }
      setFinancialIdentifier(value);
      setIsOpportunityProduct(true);
    }
  }, [formData.financialIdentifier]);

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
          onChange={handleChange}
          data-testid="customer-financial-identifier"
        />
        {!isOpportunityProduct && (
          <Form.Control.Feedback
            type="invalid"
          >
            Invalid format. Must be 18 characters long, alphanumeric and contain start with a number.
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </article>
  );
};

export default ProvisioningFormCustomer;
