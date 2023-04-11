import { Configure, InstantSearch } from 'react-instantsearch-dom';
import { SearchData, SearchHeader } from '@edx/frontend-enterprise-catalog-search';
import { useContextSelector } from 'use-context-selector';
import { Button } from '@edx/paragon';
import { useEffect, useState } from 'react';
import { configuration } from './data/config';
import { CatalogCurationContext } from './CatalogCurationContext';
import { MAX_PAGE_SIZE } from './data/constants';
import CatalogCurationSelectContentDataTable from './CatalogCurationSelectContentDataTable';
import useCatalogCurationContext from './data/hooks';

const CatalogCurationSearch = () => {
  const {
    searchClient,
    defaultSearchFilter,
    currentSearchFilter,
    currentSelectedRowIds,
  } = useContextSelector(CatalogCurationContext, v => v[0]);
  const { setCurrentSelectedRowIds, setCurrentSearchFilter } = useCatalogCurationContext();
  const [currentSearchFilterValue, setCurrentSearchFilterValue] = useState(defaultSearchFilter);
  // example of working query
  const appendStuff = () => {
    setCurrentSearchFilter(' AND content_type:course');
  };

  useEffect(() => {
    setCurrentSearchFilterValue(defaultSearchFilter + currentSearchFilter.join(''));
    console.log(currentSearchFilterValue);
  });

  return (
    <SearchData>
      <InstantSearch
        indexName={configuration.ALGOLIA.INDEX_NAME}
        searchClient={searchClient}
      >
        <Configure
          filters={currentSearchFilterValue}
          hitsPerPage={MAX_PAGE_SIZE}
        />
        <SearchHeader variant="default" />
        <Button onClick={appendStuff} variant="primary" className="mb-3">Test Button</Button>
        <CatalogCurationSelectContentDataTable
          selectedRowIds={currentSelectedRowIds}
          onSelectedRowsChanged={setCurrentSelectedRowIds}
        />
      </InstantSearch>
    </SearchData>
  );
};

export default CatalogCurationSearch;
