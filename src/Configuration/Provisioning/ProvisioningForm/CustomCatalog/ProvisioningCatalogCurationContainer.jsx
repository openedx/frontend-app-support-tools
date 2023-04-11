import CatalogCurationContextProvider from '../CatalogCuration/CatalogCurationContext';
import CatalogCurationSearch from '../CatalogCuration/CatalogCurationSearch';

const ProvisioningCatalogCurationContainer = () => (
  <CatalogCurationContextProvider>
    <CatalogCurationSearch />
  </CatalogCurationContextProvider>
);

export default ProvisioningCatalogCurationContainer;
