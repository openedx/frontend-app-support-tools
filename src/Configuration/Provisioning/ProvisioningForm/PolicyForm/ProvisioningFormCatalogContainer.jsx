import { useContextSelector } from 'use-context-selector';
import PropTypes from 'prop-types';
import { ProvisioningContext } from '../../ProvisioningContext';
import ProvisioningFormCustomCatalog from '../CustomCatalog';
import ProvisioningFormCatalog from './ProvisioningFormCatalog';

const ProvisioningFormCatalogContainer = ({ index }) => {
  const { customCatalog } = useContextSelector(ProvisioningContext, v => v[0]);
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
