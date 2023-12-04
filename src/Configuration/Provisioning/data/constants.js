import { titleCase } from '../../../utils';

// Set to true or false to enable local testing, populates DataTable with sample data
export const USES_LOCAL_TEST_DATA = false;

// The following object keys must match keys in the PREDEFINED_CATALOG_QUERIES mapping in config.  Note that they are
// camelCase here, but must be snake_case in config.
export const PREDEFINED_QUERY_DISPLAY_NAMES = {
  everything: 'Everything',
  openCourses: 'Open Courses',
  executiveEducation: 'Executive Education',
};
// For convenience, create an enum to map internal predefined query keys to themselves.
export const PREDEFINED_QUERIES_ENUM = Object.fromEntries(
  Object.keys(PREDEFINED_QUERY_DISPLAY_NAMES).map(e => [e, e]),
);

const PROVISIONING_PAGE_TEXT = {
  DASHBOARD: {
    TITLE: 'Learner Credit Plans',
    BUTTON: {
      new: 'New',
    },
  },
  FORM: {
    TITLE: (pathName) => `${titleCase(pathName.split('/').reverse()[0])} Learner Credit Plan`,
    SUB_TITLE: 'Plan Details',
    BUTTON: {
      submit: 'Create learner credit plan',
      pending: 'Creating...',
      success: 'Plan successfully created',
      error: 'Failed to create plan. Please try again.',
      cancel: 'Cancel',
    },
    PLAN_TITLE: {
      HEADER: 'Title',
      TITLE: 'Plan title',
      ERROR: 'Please enter a plan title.',
    },
    CUSTOMER: {
      TITLE: 'Customer',
      ENTERPRISE_UUID: {
        TITLE: 'Enterprise Customer / UUID',
        SUB_TITLE: 'Select an existing enterprise to provision',
        ERROR: {
          selected: 'Please select an enterprise customer.',
          invalid: 'Please select a valid enterprise customer.',
        },
        DROPDOWN_DEFAULT: 'No matching enterprise',
      },
      FINANCIAL_IDENTIFIER: {
        TITLE: 'Opportunity Product',
        MAX_LENGTH: 18,
        ERROR: {
          validity: 'Invalid format. Must be 18 characters long, alphanumeric and start with \'00k\'.',
          emptyField: 'Please enter a valid opportunity product.',
        },
      },
    },
    TERM: {
      TITLE: 'Term',
      OPTIONS: {
        startDate: 'Start Date',
        endDate: 'End Date',
      },
      ERROR: {
        validity: 'Please choose an end date later than the start date',
        emptyField: 'Please select or enter a valid date range.',
      },
      TOOLTIP: 'Plan will activate and expire at 12:00AM local time based on dates selected.',
    },
    INTERNAL_ONLY: {
      TITLE: 'Internal only',
      CHECKBOX: {
        label: 'Test Plan',
        description: 'Select if plan is intended for internal purposes only',
      },
    },
    SUBSIDY_TYPE: {
      TITLE: 'Subsidy type',
      SUB_TITLE: 'Rev req through standard commercial process?',
      OPTIONS: {
        'partner-no-rev-prepay': 'No (partner-no-rev-prepay)',
        'bulk-enrollment-prepay': 'Yes (bulk-enrollment-prepay)',
      },
      ERROR: 'Please select an option.',
    },
    ACCOUNT_CREATION: {
      TITLE: 'Budget by product',
      SUB_TITLE: 'Divide Learner Credit purchase value by product?',
      OPTIONS: {
        multiple: 'Yes, create separate Open Courses and Executive Education Learner Credit budgets',
        single: 'No, create one Learner Credit budget',
      },
      ERROR: 'Please select a product configuration.',
    },
    ACCOUNT_DETAIL: {
      TITLE: 'Budget details',
      OPTIONS: {
        displayName: 'Display name',
        totalAccountValue: {
          title: 'Budget starting balance ($)',
          subtitle: 'The contracted USD value available through the budget.',
          dynamicSubtitle: (budgetType) => `The contracted USD value available through the budget redeemable for ${budgetType} enrollment.`,
        },
      },
      ERROR: {
        incorrectDollarAmount: 'Please enter a whole dollar value',
        emptyField: 'Please enter a valid starting balance.',
      },
    },
    ACCOUNT_DESCRIPTION: {
      TITLE: 'Budget description',
      SUB_TITLE: 'Provide a description for the budget product',
      MAX_LENGTH: 255,
    },
    // Constants and radio options used within ProvisioningFormCatalog.
    CATALOG: {
      TITLE: 'Catalog',
      SUB_TITLE: 'Associated catalog',
      OPTIONS: {
        // Start with providing the default options corresponding to predefined catalog queries.
        ...PREDEFINED_QUERY_DISPLAY_NAMES,
        // The following special option triggers the app to display a custom catalog selection.
        custom: 'Unique/Curated',
      },
      ERROR: 'Please select a catalog.',
    },
    CUSTOM_CATALOG: {
      HEADER: {
        TITLE: 'Select existing unique/curated enterprise catalog',
        WARN_SUB_TITLE: 'Ensure the intended enterprise catalog has been created in Django Admin before proceeding.',
      },
      DETAIL_HEADER: {
        TITLE: 'Select existing unique/curated enterprise catalog',
        TITLE_FIELD: 'Catalog Title',
        UUID_FIELD: 'Catalog UUID',
      },
      BUTTON: {
        createCatalog: 'Create catalog',
      },
      OPTIONS: {
        // Dropdown helper text configuration.
        enterpriseCatalog: {
          title: 'Enterprise Catalog',
          subtitle: 'Select an existing enterprise catalog for this enterprise customer.',
          error: 'Error, no selected catalog',
        },
      },
    },
    LEARNER_CAP: {
      TITLE: 'Limits',
      SUB_TITLE: 'Create learner spend limits?',
      OPTIONS: {
        yes: 'Yes',
        no: 'No, first come first serve',
      },
      ERROR: 'Please select an option.',
    },
    LEARNER_CAP_DETAIL: {
      TITLE: 'Define limits',
      OPTIONS: {
        perLearnerSpendCap: {
          title: 'Per learner spend limit ($)',
          subtitle: 'The maximum USD value a single learner may redeem from the budget. This value should be less than the budget starting balance.',
        },
      },
      ERROR: {
        incorrectDollarAmount: 'Please enter a whole dollar value',
        emptyField: 'Please enter a valid value.',
      },
    },
    ALERTS: {
      MISSING_FIELD_MESSAGES: {
        TITLE: 'Missing required fields',
        SUB_TITLE: 'Please enter incomplete fields and try again.',
      },
      unselectedAccountType: "Please select an 'Account Creation' option to create new policies.",
      API_ERROR_MESSAGES: {
        ENTERPRISE_CUSTOMER_CATALOG_LISTING: {
          400: 'The enterprise catalogs could not be fetched.',
          401: 'Authentication failed.',
          403: 'Authentication recognized but incorrect credentials enterprise customer catalog listing.',
          404: 'Enterprise catalogs not found.',
          500: 'System failure',
        },
        ENTERPRISE_CUSTOMER_CATALOG_CREATION: {
          400: 'The enterprise catalog could not be created.',
          401: 'Authentication failed.',
          403: 'Authentication recognized but incorrect credentials enterprise customer catalog creation.',
          404: 'Enterprise Catalog failed to respond.',
          405: 'The enterprise catalog could not be created.',
          500: 'System failure',
        },
        SUBSIDY_CREATION: {
          400: 'The subsidy could not be created.',
          401: 'Authentication failed.',
          403: 'Authentication recognized but incorrect credentials for subsidy creation.',
          404: 'Subsidy creation endpoint failed to respond',
          405: 'The subsidy could not be created.',
          500: 'System failure',
        },
        POLICY_CREATION: {
          400: 'The policy could not be created.',
          401: 'Authentication failed.',
          403: 'Authentication recognized but incorrect credentials for subsidy access policy creation.',
          404: 'Policy creation endpoint failed to respond',
          405: 'The policy could not be created.',
          500: 'System failure',
        },
        DEFAULT: 'System failure',
      },
      incorrectDollarAmount: 'Please enter a whole dollar value',
    },
    EDIT_BUTTON: {
      description: 'Edit plan',
    },
    SAVE_BUTTON: {
      submit: 'Save Edits',
      pending: 'Updating...',
      success: 'Plan successfully updated',
      error: 'Failed to update plan. Please try again.',
      cancel: 'Cancel',
    },
    CANCEL: {
      description: 'Cancel',
      MODAL: {
        TITLE: 'Leave page without saving?',
        BODY: 'The edits you made will not be saved.',
        FOOTER: {
          options: {
            leave: 'Leave without saving',
            stay: 'Keep editing',
          },
        },
      },
    },
    POLICY_TYPE: {
      TITLE: 'Budget distribution mode',
      LABEL: 'How is content selected?',
      OPTIONS: {
        LEARNER_SELECTS: {
          DESCRIPTION: 'Learner selects content or LMS',
          VALUE: 'PerLearnerSpendCreditAccessPolicy',
          ACCESS_METHOD: 'direct',
        },
        ADMIN_SELECTS: {
          DESCRIPTION: 'Admin selects content',
          VALUE: 'AssignedLearnerCreditAccessPolicy',
          ACCESS_METHOD: 'assigned',
        },
      },
      ERROR: 'Please select an option.',
    },
  },
};

export const toastText = {
  successfulPlanCreation: 'Plan successfully created',
  successfulPlanSaved: 'Plan successfully saved',
};

export const DJANGO_ADMIN_ADD_CATALOG_PATH = '/admin/enterprise/enterprisecustomercatalog/add/';
export const DJANGO_ADMIN_RETRIEVE_CATALOG_PATH = (uuid) => (
  `/admin/enterprise/enterprisecustomercatalog/${uuid}/change/`
);
export const DJANGO_ADMIN_RETRIEVE_SUBSIDY_PATH = (uuid) => `/admin/subsidy/subsidy/${uuid}/change/`;

// For the purposes of new plan creation, INITIAL_POLICIES defines different sets of default configurations for the
// formData.policies list in the global ProvisioningContext.  Keys should correspond to different selections under
// PROVISIONING_PAGE_TEXT.OPTIONS.
export const INITIAL_POLICIES = {
  // Corresponds to PROVISIONING_PAGE_TEXT.OPTIONS.multiple
  multiplePolicies: [
    {
      predefinedQueryType: PREDEFINED_QUERIES_ENUM.openCourses,
      customCatalog: false,
      catalogUuid: undefined,
      catalogTitle: undefined,
    },
    {
      predefinedQueryType: PREDEFINED_QUERIES_ENUM.executiveEducation,
      customCatalog: false,
      catalogUuid: undefined,
      catalogTitle: undefined,
    },
  ],
  // Corresponds to PROVISIONING_PAGE_TEXT.OPTIONS.single
  singlePolicy: [
    {
      // The default budget/policy makes no assumption about what is desired, so both the Catalog radio selection and
      // custom catalog dropdown start empty (by setting all the following to undefined).
      predefinedQueryType: undefined,
      customCatalog: undefined,
      catalogUuid: undefined,
      catalogTitle: undefined,
    },
  ],
};

export const MAX_PAGE_SIZE = 12;

export default PROVISIONING_PAGE_TEXT;
