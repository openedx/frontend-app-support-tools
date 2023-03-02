import ProvisioningFormCustomCatalogHeader from './ProvisioningFormCustomCatalogHeader';
import ProvisioningFormCustomCatalogDropdown from './ProvisioningFormCustomCatalogDropdown';
import ProvisioningFormCustomCatalogTitle from './ProvisioningFormCustomCatalogTitle';
import ProvisioningFormCustomCatalogTextArea from './ProvisioningFormCustomCatalogTextArea';

const ProvisioningFormCustomCatalog = () => {
  console.log('hi custum');
  return (
    <>
      <ProvisioningFormCustomCatalogHeader />
      <ProvisioningFormCustomCatalogDropdown />
      <ProvisioningFormCustomCatalogTitle />
      <ProvisioningFormCustomCatalogTextArea />
    </>
  );
};

export default ProvisioningFormCustomCatalog;
