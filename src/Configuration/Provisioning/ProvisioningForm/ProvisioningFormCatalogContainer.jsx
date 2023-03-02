import ProvisioningFormCustomCatalog from './CustomCatalog';
import ProvisioningFormCatalog from './ProvisioningFormCatalog';

const ProvisioningFormCatalogContainer = () => {
  console.log('ccCont');
  return (
    <>
      <ProvisioningFormCatalog />
      <ProvisioningFormCustomCatalog />
    </>
  );
};

export default ProvisioningFormCatalogContainer;
