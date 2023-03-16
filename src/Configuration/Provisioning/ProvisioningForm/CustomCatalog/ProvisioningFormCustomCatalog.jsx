import { useContextSelector } from 'use-context-selector';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ProvisioningFormDefineCustomCatalogHeader from './ProvisioningFormDefineCustomCatalogHeader';
import ProvisioningFormCustomCatalogDropdown from './ProvisioningFormCustomCatalogDropdown';
import ProvisioningFormCustomCatalogTitle from './ProvisioningFormCustomCatalogTitle';
import ProvisioningFormCustomCatalogTextArea from './ProvisioningFormCustomCatalogTextArea';
import { ProvisioningContext } from '../../ProvisioningContext';
import ProvisioningFormEnterpriseCustomerCatalog from './ProvisioningFormEnterpriseCustomerCatalog';

const ProvisioningFormCustomCatalog = ({ index }) => {
  const { formData } = useContextSelector(ProvisioningContext, v => v[0]);
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
        <ProvisioningFormEnterpriseCustomerCatalog />
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
