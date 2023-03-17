import PropTypes from 'prop-types';
import ProvisioningFormCustomCatalog from '../CustomCatalog';
import ProvisioningFormCatalog from './ProvisioningFormCatalog';
import selectProvisioningContext from '../../data/utils';

const ProvisioningFormCatalogContainer = ({ index }) => {
  const [customCatalog] = selectProvisioningContext('customCatalog');
  return (
    <>
      <ProvisioningFormCatalog index={index} />
      {customCatalog && <ProvisioningFormCustomCatalog />}
    </>
  );
};

ProvisioningFormCatalogContainer.propTypes = {
  index: PropTypes.number.isRequired,
};

export default ProvisioningFormCatalogContainer;
