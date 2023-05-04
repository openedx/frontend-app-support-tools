import { useEffect, useState } from 'react';
import ProvisioningFormDefineCustomCatalogHeader from './ProvisioningFormDefineCustomCatalogHeader';
import ProvisioningFormCustomCatalogDropdown from './ProvisioningFormCustomCatalogDropdown';
import ProvisioningFormCustomCatalogTitle from './ProvisioningFormCustomCatalogTitle';
import ProvisioningFormCustomCatalogTextArea from './ProvisioningFormCustomCatalogTextArea';
import { indexOnlyPropType, selectProvisioningContext } from '../../data/utils';
import ProvisioningFormCustomCatalogExecEdBoolean from './ProvisioningFormCustomCatalogExecEdBoolean';

const ProvisioningFormCustomCatalog = ({ index }) => {
  const [formData] = selectProvisioningContext('formData');
  const [policyData, setPolicyData] = useState(formData.policies[0].catalogQueryMetadata);

  useEffect(() => {
    setPolicyData(formData.policies[index].catalogQueryMetadata);
  }, [formData.policies[index].catalogQueryMetadata, formData.policies[index].customerCatalog]);

  return (
    <article className="mt-4.5">
      <ProvisioningFormDefineCustomCatalogHeader index={index} />
      <ProvisioningFormCustomCatalogDropdown />
      {policyData.catalogQuery.title && <ProvisioningFormCustomCatalogTitle />}
      {policyData.catalogQuery.contentFilter && <ProvisioningFormCustomCatalogTextArea />}
      {(policyData.catalogQuery.includeExecEd2UCourses !== undefined)
        && <ProvisioningFormCustomCatalogExecEdBoolean />}
    </article>
  );
};

ProvisioningFormCustomCatalog.propTypes = indexOnlyPropType;

export default ProvisioningFormCustomCatalog;
