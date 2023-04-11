import algoliasearch from 'algoliasearch/lite';
import { useState } from 'react';
import { createContext } from 'use-context-selector';
import PropTypes from 'prop-types';
import { configuration } from './data/config';
import { ENABLE_TESTING } from './data/constants';

export const CatalogCurationContext = createContext(null);

const searchClient = algoliasearch(
  configuration.ALGOLIA.APP_ID,
  configuration.ALGOLIA.SEARCH_API_KEY,
);

const catalogQueryId = 'some-dummy-id-123';

const defaultCurrentSearchFilter = `enterprise_catalog_query_uuids:${ENABLE_TESTING(catalogQueryId)}`;

const CatalogCurationContextProvider = ({
  children,
}) => {
  const contextValue = useState({
    currentSelectedRowIds: {},
    defaultSearchFilter: defaultCurrentSearchFilter,
    currentSearchFilter: [],
    searchClient,
    startDate: '',
    endDate: '',
  });

  return (<CatalogCurationContext.Provider value={contextValue}> {children} </CatalogCurationContext.Provider>);
};

CatalogCurationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CatalogCurationContextProvider;
