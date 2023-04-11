import { useEffect, useState } from 'react';
import ProvisioningFormDefineCustomCatalogHeader from './ProvisioningFormDefineCustomCatalogHeader';
import ProvisioningFormCustomCatalogDropdown from './ProvisioningFormCustomCatalogDropdown';
import ProvisioningFormCustomCatalogTitle from './ProvisioningFormCustomCatalogTitle';
import ProvisioningFormCustomCatalogTextArea from './ProvisioningFormCustomCatalogTextArea';
import ProvisioningFormEnterpriseCustomerCatalog from './ProvisioningFormEnterpriseCustomerCatalog';
import { indexOnlyPropType, selectProvisioningContext } from '../../data/utils';
import ProvisioningFormCustomCatalogExecEdBoolean from './ProvisioningFormCustomCatalogExecEdBoolean';
import ProvisioningCatalogCurationContainer from './ProvisioningCatalogCurationContainer';

const ProvisioningFormCustomCatalog = ({ index }) => {
  const [formData] = selectProvisioningContext('formData');
  const [policyData, setPolicyData] = useState(formData.policies[0].catalogQueryMetadata);
  const [customerCatalogBoolean, setCustomerCatalogBoolean] = useState(formData.policies[0].customerCatalog);
  const [showCatalogCuration, setShowCatalogCuration] = useState();

  const handleShowCatalogCurationButton = () => {
    setShowCatalogCuration(!showCatalogCuration);
  };

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
        <ProvisioningFormDefineCustomCatalogHeader
          index={index}
          handleShowCatalogCurationButton={handleShowCatalogCurationButton}
          showCatalogCuration={showCatalogCuration}
        />
        {showCatalogCuration && <ProvisioningCatalogCurationContainer />}
        <ProvisioningFormCustomCatalogDropdown />
        {policyData.catalogQuery.title && <ProvisioningFormCustomCatalogTitle />}
        {policyData.catalogQuery.contentFilter && <ProvisioningFormCustomCatalogTextArea />}
        {(policyData.catalogQuery.includeExecEd2UCourses !== undefined)
        && <ProvisioningFormCustomCatalogExecEdBoolean />}
      </article>
    );
  }
  return null;
};

ProvisioningFormCustomCatalog.propTypes = indexOnlyPropType;

export default ProvisioningFormCustomCatalog;
