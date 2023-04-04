import {
  Form,
} from '@edx/paragon';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import useProvisioningContext from '../../data/hooks';
import { indexOnlyPropType } from '../../data/utils';

const ProvisioningFormEnterpriseCustomerCatalog = ({ index }) => {
  const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  const { setCustomerCatalogUUID } = useProvisioningContext();
  return (
    <article className="mt-4.5">
      <Form.Group className="mb-1">
        <Form.Control
          floatingLabel={CUSTOM_CATALOG.OPTIONS.enterpriseCustomerCatalogUUID}
          onChange={e => setCustomerCatalogUUID({
            customerCatalogUUID: e.target.value,
          }, index)}
          data-testid="enterprise-customer-catalog-uuid"
        />
      </Form.Group>
    </article>
  );
};

ProvisioningFormEnterpriseCustomerCatalog.propTypes = indexOnlyPropType;

export default ProvisioningFormEnterpriseCustomerCatalog;
