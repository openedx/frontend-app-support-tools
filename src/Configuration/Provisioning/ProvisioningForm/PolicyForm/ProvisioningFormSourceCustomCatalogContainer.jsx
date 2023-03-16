import PropTypes from 'prop-types';
import ProvisioningFormSourceCustomCatalogHeader from './ProvisioningFormSourceCustomCatalogHeader';
import ProvisioningFormSourceCustomCatalogRadio from './ProvisioningFormSourceCustomCatalogRadio';

const ProvisioningFormSourceCustomCatalogContainer = ({ index }) => (
  <article className="mt-4.5">
    <ProvisioningFormSourceCustomCatalogHeader />
    <ProvisioningFormSourceCustomCatalogRadio index={index} />
  </article>
);

ProvisioningFormSourceCustomCatalogContainer.propTypes = {
  index: PropTypes.number.isRequired,
};

export default ProvisioningFormSourceCustomCatalogContainer;
