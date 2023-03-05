import {
  Form,
} from '@edx/paragon';
import { useContextSelector } from 'use-context-selector';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import useProvisioningContext from '../data/hooks';
import { ProvisioningContext } from '../ProvisioningContext';

const ProvisioningFormCustomer = () => {
  const { CUSTOMER } = PROVISIONING_PAGE_TEXT.FORM;
  const { formData } = useContextSelector(ProvisioningContext, v => v[0]);
  const { setCustomerUUID, setFinancialIdentifier } = useProvisioningContext();
  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <h3>{CUSTOMER.TITLE}</h3>
      </div>
      <Form.Group className="mt-4.5 mb-1">
        <Form.Control
          floatingLabel={CUSTOMER.OPTIONS.enterpriseUUID}
          defaultValue={formData.customerUUID || undefined}
          onChange={e => setCustomerUUID(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mt-4.5">
        <Form.Control
          floatingLabel={CUSTOMER.OPTIONS.financialIdentifier}
          defaultValue={formData.financialIdentifier || undefined}
          onChange={e => setFinancialIdentifier(e.target.value)}
        />
      </Form.Group>
    </article>
  );
};

export default ProvisioningFormCustomer;
