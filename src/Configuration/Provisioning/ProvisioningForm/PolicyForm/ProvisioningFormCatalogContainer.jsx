import ProvisioningFormCustomCatalog from '../CustomCatalog';
import ProvisioningFormCatalog from './ProvisioningFormCatalog';
import { indexOnlyPropType, selectProvisioningContext } from '../../data/utils';

const ProvisioningFormCatalogContainer = ({ index }) => {
  const [formData] = selectProvisioningContext('formData');
  return (
    <>
      <ProvisioningFormCatalog index={index} />
      {formData.policies[index]?.customCatalog && <ProvisioningFormCustomCatalog index={index} />}
    </>
  );
};

ProvisioningFormCatalogContainer.propTypes = indexOnlyPropType;

export default ProvisioningFormCatalogContainer;
