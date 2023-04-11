/* eslint-disable import/prefer-default-export */
/* START LOCAL TESTING CONSTANTS */
export const TEST_FLAG = true;
// Test entepriseId for Content Highlights to display card selections and confirmation

export const testCatalogQueryUUID = 'fac3ecd6-1ecb-431e-b056-c17c36bb5b03';

// function that passes through catalogQueryUUID if TEST_FLAG is false, otherwise returns local testing catalogQueryUUID
export const ENABLE_TESTING = (catalogQueryUUID, enableTest = TEST_FLAG) => {
  if (enableTest) {
    return testCatalogQueryUUID;
  }
  return catalogQueryUUID;
};
/* END LOCAL TESTING CONSTANTS */

// Max items returned per page
export const MAX_PAGE_SIZE = 24;
