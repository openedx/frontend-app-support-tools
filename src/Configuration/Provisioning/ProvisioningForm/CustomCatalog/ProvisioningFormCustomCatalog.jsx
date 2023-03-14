import ProvisioningFormCustomCatalogHeader from './ProvisioningFormCustomCatalogHeader';
import ProvisioningFormCustomCatalogDropdown from './ProvisioningFormCustomCatalogDropdown';
import ProvisioningFormCustomCatalogTitle from './ProvisioningFormCustomCatalogTitle';
import ProvisioningFormCustomCatalogTextArea from './ProvisioningFormCustomCatalogTextArea';

const ProvisioningFormCustomCatalog = () => (
  <div className="mt-4.5">
    <ProvisioningFormCustomCatalogHeader />
    <ProvisioningFormCustomCatalogDropdown />
    <ProvisioningFormCustomCatalogTitle />
    <ProvisioningFormCustomCatalogTextArea />
  </div>
);

export default ProvisioningFormCustomCatalog;
