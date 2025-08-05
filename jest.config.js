const { createConfig } = require('@openedx/frontend-build');
const { TestEnvironment } = require('jest-environment-jsdom');



module.exports = createConfig('jest', {
  setupFiles: ['<rootDir>/src/setupTest.js'],
  testEnvironment: 'jsdom',
  
  
  
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
 

 
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/setupTest.js',
    'src/i18n',
    'src/users/v2/UserPage.jsx',
    'src/supportHeader/ToggleVersion.jsx',
  ],
});
