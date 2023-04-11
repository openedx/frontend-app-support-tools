import CatalogCurationContextProvider from '../CatalogCuration/CatalogCurationContext';
import CatalogCurationSearch from '../CatalogCuration/CatalogCurationSearch';
import { Button } from '@edx/paragon';

import EnterpriseCatalogApiService from '../../../../data/services/EnterpriseCatalogApiService';
import { selectProvisioningContext } from '../../data/utils';
import { logError } from '@edx/frontend-platform/logging';


const ProvisioningCatalogCurationContainer = () => {
  const [formData] = selectProvisioningContext('formData');
  const handleClick = () => {
    EnterpriseCatalogApiService.generateNewCustomerCatalog(
      formData.enterpriseUUID,
      { 'data': 'foobar' },
    )
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log("sad");
      });
    console.log("wassup");
  };

  return (<CatalogCurationContextProvider>
    <CatalogCurationSearch />
    <Button
      onClick={handleClick}
    >
      Submit Catalog
    </Button>
  </CatalogCurationContextProvider>)
};

export default ProvisioningCatalogCurationContainer;
