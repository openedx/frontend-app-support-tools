import algoliasearch from 'algoliasearch/lite';
import { useState } from 'react';
import { createContext } from 'use-context-selector';
import PropTypes from 'prop-types';
import { configuration } from './data/config';

export const CatalogCurationContext = createContext(null);

const searchClient = algoliasearch(
  configuration.ALGOLIA.APP_ID,
  configuration.ALGOLIA.SEARCH_API_KEY,
);

const CatalogCurationContextProvider = ({
  children,
}) => {
  const contextValue = useState({
    searchClient,
    currentSelectedRowIds: {},
  });

  return (<CatalogCurationContext.Provider value={contextValue}> {children} </CatalogCurationContext.Provider>);
};

CatalogCurationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CatalogCurationContextProvider;
