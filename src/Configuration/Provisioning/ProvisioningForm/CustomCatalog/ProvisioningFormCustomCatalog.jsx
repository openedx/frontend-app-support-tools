import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ProvisioningFormDefineCustomCatalogHeader from './ProvisioningFormDefineCustomCatalogHeader';
import ProvisioningFormCustomCatalogDropdown from './ProvisioningFormCustomCatalogDropdown';
import ProvisioningFormCustomCatalogTitle from './ProvisioningFormCustomCatalogTitle';
import ProvisioningFormCustomCatalogTextArea from './ProvisioningFormCustomCatalogTextArea';
import ProvisioningFormEnterpriseCustomerCatalog from './ProvisioningFormEnterpriseCustomerCatalog';
import { selectProvisioningContext } from '../../data/utils';

const ProvisioningFormCustomCatalog = ({ index }) => {
  const [formData] = selectProvisioningContext('formData');
  const [policyData, setPolicyData] = useState(formData.policies[0].catalogQueryMetadata);
  const [customerCatalogBoolean, setCustomerCatalogBoolean] = useState(formData.policies[0].customerCatalog);

  useEffect(() => {
    setPolicyData(formData.policies[index].catalogQueryMetadata);
    setCustomerCatalogBoolean(formData.policies[index].customerCatalog);
  }, [formData.policies[index].catalogQueryMetadata, formData.policies[index].customerCatalog]);

  if (customerCatalogBoolean) {
    return (
      <article className="mt-4.5">
        <ProvisioningFormDefineCustomCatalogHeader index={index} />
        <ProvisioningFormEnterpriseCustomerCatalog index={index} />
      </article>
    );
  }
  if (customerCatalogBoolean === false) {
    return (
      <article className="mt-4.5">
        <ProvisioningFormDefineCustomCatalogHeader index={index} />
        <ProvisioningFormCustomCatalogDropdown />
        {policyData.catalogQuery.title && <ProvisioningFormCustomCatalogTitle />}
        {policyData.catalogQuery.contentFilter && <ProvisioningFormCustomCatalogTextArea />}
      </article>
    );
  }
  return null;
};

ProvisioningFormCustomCatalog.propTypes = {
  index: PropTypes.number.isRequired,
};

export default ProvisioningFormCustomCatalog;
