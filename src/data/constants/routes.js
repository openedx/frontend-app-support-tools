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
    HOME: '/configuration',
    SUB_DIRECTORY: {
      PROVISIONING: {
        HOME: '/configuration/provisioning',
        SUB_DIRECTORY: {
          NEW: '/configuration/provisioning/new',
          EDIT: '/configuration/provisioning/edit',
        },
      },
    },
  },
};

export default ROUTES;
