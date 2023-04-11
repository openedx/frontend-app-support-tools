import { Configure, InstantSearch } from 'react-instantsearch-dom';
import { SearchData, SearchHeader } from '@edx/frontend-enterprise-catalog-search';
import { useContextSelector } from 'use-context-selector';
import { configuration } from './data/config';
import { CatalogCurationContext } from './CatalogCurationContext';
import { ENABLE_TESTING, MAX_PAGE_SIZE } from './data/constants';
import CatalogCurationSelectContentDataTable from './CatalogCurationSelectContentDataTable';
import useCatalogCurationContext from './data/hooks';

const CatalogCurationSearch = () => {
  const catalogQueryId = 'some-dummy-id-123';
  const { searchClient } = useContextSelector(CatalogCurationContext, v => v[0]);
  const searchFilters = `enterprise_catalog_query_uuids:${ENABLE_TESTING(catalogQueryId)}`;

  const { setCurrentSelectedRowIds } = useCatalogCurationContext();
  const currentSelectedRowIds = useContextSelector(CatalogCurationContext, v => v[0].currentSelectedRowIds);

  return (
    <SearchData>
      <InstantSearch
        indexName={configuration.ALGOLIA.INDEX_NAME}
        searchClient={searchClient}
      >
        <Configure
          filters={searchFilters}
          hitsPerPage={MAX_PAGE_SIZE}
        />
        <SearchHeader variant="default" />
        <CatalogCurationSelectContentDataTable
          selectedRowIds={currentSelectedRowIds}
          onSelectedRowsChanged={setCurrentSelectedRowIds}
        />
      </InstantSearch>
    </SearchData>
  );
};

export default CatalogCurationSearch;
