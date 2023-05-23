// Routes within the app
const ROUTES = {
  SUPPORT_TOOLS_TABS: {
    HOME: '/',
    SUB_DIRECTORY: {
      LEARNER_INFORMATION: '/learner-information',
      FEATURE_BASED_ENROLLMENTS: '/feature-based-enrollments',
      PROGRAM_ENROLLMENTS: '/program-enrollments',
    },
  },
  CONFIGURATION: {
    HOME: '/enterprise-configuration',
    SUB_DIRECTORY: {
      PROVISIONING: {
        HOME: '/enterprise-configuration/learner-credit',
        SUB_DIRECTORY: {
          NEW: '/enterprise-configuration/learner-credit/new',
          EDIT: '/enterprise-configuration/learner-credit/:id/edit',
        },
      },
    },
  },
};

export default ROUTES;
