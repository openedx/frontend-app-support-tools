/* eslint-disable import/prefer-default-export */
/* START LOCAL TESTING CONSTANTS */
export const TEST_FLAG = true;
// Test entepriseId for Content Highlights to display card selections and confirmation

export const testCatalogQueryUUID = 'fac3ecd6-1ecb-431e-b056-c17c36bb5b03';

// function that passes through enterpriseId if TEST_FLAG is false, otherwise returns local testing enterpriseId
export const ENABLE_TESTING = (enterpriseId, enableTest = TEST_FLAG) => {
  if (enableTest) {
    return testCatalogQueryUUID;
  }
  return enterpriseId;
};
/* END LOCAL TESTING CONSTANTS */

// Max items returned per page
export const MAX_PAGE_SIZE = 12;
