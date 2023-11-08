import ProvisioningFormDefineCustomCatalogHeader from './ProvisioningFormDefineCustomCatalogHeader';
import ProvisioningFormCustomCatalogDropdown from './ProvisioningFormCustomCatalogDropdown';
import { indexOnlyPropType } from '../../data/utils';

const ProvisioningFormCustomCatalog = ({ index }) => (
  <article className="mt-4.5">
    <ProvisioningFormDefineCustomCatalogHeader index={index} />
    <ProvisioningFormCustomCatalogDropdown />
  </article>
);

ProvisioningFormCustomCatalog.propTypes = indexOnlyPropType;

export default ProvisioningFormCustomCatalog;
