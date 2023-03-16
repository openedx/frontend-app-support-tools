import { useContextSelector } from 'use-context-selector';
import PropTypes from 'prop-types';
import { ProvisioningContext } from '../../ProvisioningContext';
import ProvisioningFormCustomCatalog from '../CustomCatalog';
import ProvisioningFormCatalog from './ProvisioningFormCatalog';
import ProvisioningFormSourceCustomCatalogContainer from './ProvisioningFormSourceCustomCatalogContainer';

const ProvisioningFormCatalogContainer = ({ index }) => {
  const { customCatalog } = useContextSelector(ProvisioningContext, v => v[0]);
  return (
    <>
      <ProvisioningFormCatalog index={index} />
      {customCatalog && <ProvisioningFormSourceCustomCatalogContainer index={index} />}
      {customCatalog && <ProvisioningFormCustomCatalog index={index} />}
    </>
  );
};

ProvisioningFormCatalogContainer.propTypes = {
  index: PropTypes.number.isRequired,
};

export default ProvisioningFormCatalogContainer;
