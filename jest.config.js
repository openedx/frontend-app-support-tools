const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('jest', {
  setupFiles: ['<rootDir>/src/setupTest.js'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/setupTest.js',
    'src/i18n',
    'src/users/v2/UserPage.jsx'
  ],
});
