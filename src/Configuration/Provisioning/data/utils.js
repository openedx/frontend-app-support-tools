// Takes an array of catalog queries and sorted them by last modified date (newest first)
export default function sortedCatalogQueries(catalogQueries) {
  return catalogQueries.sort((b, a) => {
    if (a.modified < b.modified) {
      return -1;
    }
    if (a.modified > b.modified) {
      return 1;
    }
    return 0;
  });
}
