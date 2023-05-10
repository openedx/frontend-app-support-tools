import ProvisioningFormCustomCatalog from '../CustomCatalog';
import ProvisioningFormCatalog from './ProvisioningFormCatalog';
import { indexOnlyPropType, selectProvisioningContext } from '../../data/utils';

const ProvisioningFormCatalogContainer = ({ index }) => {
  const [customCatalog] = selectProvisioningContext('customCatalog');
  return (
    <>
      <ProvisioningFormCatalog index={index} />
      {customCatalog && <ProvisioningFormCustomCatalog index={index} />}
    </>
  );
};

ProvisioningFormCatalogContainer.propTypes = indexOnlyPropType;

export default ProvisioningFormCatalogContainer;
