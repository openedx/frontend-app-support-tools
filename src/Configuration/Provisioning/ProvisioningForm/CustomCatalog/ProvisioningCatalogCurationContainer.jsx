import CatalogCurationContextProvider from '../CatalogCuration/CatalogCurationContext';
import CatalogCurationDateSelection from '../CatalogCuration/CatalogCurationDateSelection';
import CatalogCurationSearch from '../CatalogCuration/CatalogCurationSearch';

const ProvisioningCatalogCurationContainer = () => (
  <CatalogCurationContextProvider>
    <CatalogCurationSearch />
    <CatalogCurationDateSelection />
  </CatalogCurationContextProvider>
);

export default ProvisioningCatalogCurationContainer;
