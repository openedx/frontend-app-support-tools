import { indexOnlyPropType } from '../../data/utils';
import ProvisioningFormSourceCustomCatalogHeader from './ProvisioningFormSourceCustomCatalogHeader';
import ProvisioningFormSourceCustomCatalogRadio from './ProvisioningFormSourceCustomCatalogRadio';

const ProvisioningFormSourceCustomCatalogContainer = ({ index }) => (
  <article className="mt-4.5">
    <ProvisioningFormSourceCustomCatalogHeader />
    <ProvisioningFormSourceCustomCatalogRadio index={index} />
  </article>
);

ProvisioningFormSourceCustomCatalogContainer.propTypes = indexOnlyPropType;

export default ProvisioningFormSourceCustomCatalogContainer;
