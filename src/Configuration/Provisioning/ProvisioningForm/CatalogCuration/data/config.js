/* eslint-disable import/prefer-default-export */
export const configuration = {
  ENTERPRISE_LEARNER_PORTAL_URL: process.env.ENTERPRISE_LEARNER_PORTAL_URL,
  ALGOLIA: {
    APP_ID: process.env.ALGOLIA_APP_ID,
    SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
    INDEX_NAME: process.env.ALGOLIA_INDEX_NAME,
  },
};
