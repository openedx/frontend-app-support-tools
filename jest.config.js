const { createConfig } = require('@openedx/frontend-build');

module.exports = createConfig('jest', {
  setupFiles: ['<rootDir>/src/setupTest.js'],
  collectCoverage: false, // Temporarily disable coverage collection
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/setupTest.js',
    'src/i18n',
    'src/users/v2/UserPage.jsx',
    'src/supportHeader/ToggleVersion.jsx',
  ],
  verbose: true,
  detectOpenHandles: true,
});
