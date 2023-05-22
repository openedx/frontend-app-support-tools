import {
  Form,
} from '@edx/paragon';
import { useCallback, useState } from 'react';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import useProvisioningContext from '../data/hooks';
import { selectProvisioningContext } from '../data/utils';
import ProvisioningFormCustomerDropdown from './ProvisioningFormCustomerDropdown';
import { isValidOpportunityProduct } from '../../../utils';

const ProvisioningFormCustomer = () => {
  const { CUSTOMER } = PROVISIONING_PAGE_TEXT.FORM;
  const [formData, showInvalidField] = selectProvisioningContext('formData', 'showInvalidField');
  const { setFinancialIdentifier, setInvalidSubsidyFields } = useProvisioningContext();
  const [financialIdentifier, setFinancialIdentifierState] = useState('');
  const [isOpportunityProduct, setIsOpportunityProduct] = useState(true);
  const { subsidy } = showInvalidField;

  const handleChange = useCallback((e) => {
    const newEvent = e.target;
    const { value, dataset } = newEvent;
    console.log(value);
    if (dataset.testid === 'customer-financial-identifier') {
      if (value !== '' && !isValidOpportunityProduct(value)) {
        setIsOpportunityProduct(false);
        return;
      }
      setIsOpportunityProduct(true);
      setFinancialIdentifier(value);
      setFinancialIdentifierState(value);
      setInvalidSubsidyFields({ ...subsidy, financialIdentifier: true });
    }
  }, [formData.financialIdentifier]);

  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <h3>{CUSTOMER.TITLE}</h3>
      </div>
      <Form.Group className="mt-3.5 mb-1">
        <ProvisioningFormCustomerDropdown />
      </Form.Group>
      <Form.Group
        className="mt-3.5"
        isInvalid={(!isOpportunityProduct || subsidy.financialIdentifier === false)}
      >
        <Form.Control
          floatingLabel={CUSTOMER.FINANCIAL_IDENTIFIER.TITLE}
          value={financialIdentifier}
          onChange={handleChange}
          data-testid="customer-financial-identifier"
        />
        {!isOpportunityProduct && (
        <Form.Control.Feedback
          type="invalid"
        >
          {CUSTOMER.FINANCIAL_IDENTIFIER.ERROR.validity}
        </Form.Control.Feedback>
        )}
        {subsidy.financialIdentifier === false && (
        <Form.Control.Feedback
          type="invalid"
        >
          {CUSTOMER.FINANCIAL_IDENTIFIER.ERROR.emptyField}
        </Form.Control.Feedback>
        )}
      </Form.Group>
    </article>
  );
};

export default ProvisioningFormCustomer;
