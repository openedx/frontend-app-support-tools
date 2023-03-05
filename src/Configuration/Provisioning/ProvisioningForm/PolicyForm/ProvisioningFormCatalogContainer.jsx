import { useContextSelector } from 'use-context-selector';
import { ProvisioningContext } from '../../ProvisioningContext';
import ProvisioningFormCustomCatalog from '../CustomCatalog';
import ProvisioningFormCatalog from '../ProvisioningFormCatalog';

const ProvisioningFormCatalogContainer = () => {
  const { customCatalog } = useContextSelector(ProvisioningContext, v => v[0]);
  return (
    <>
      <ProvisioningFormCatalog />
      {customCatalog && <ProvisioningFormCustomCatalog />}
    </>
  );
};

export default ProvisioningFormCatalogContainer;
