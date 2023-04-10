import {
  Container,
} from '@edx/paragon';
import CatalogCurationSearch from './CatalogCurationSearch';
import CatalogCurationContextProvider from './CatalogCurationContext';

const CatalogCurationPage = () => (
  <CatalogCurationContextProvider>
    <Container className="mt-5">
      <h1>Catalog Curation</h1>
      <CatalogCurationSearch />
    </Container>
  </CatalogCurationContextProvider>
);

export default CatalogCurationPage;
