import { v4 as uuidv4 } from 'uuid';
import { titleCase } from '../../../utils';

// Set to true or false to enable local testing, populates DataTable with sample data
export const USES_LOCAL_TEST_DATA = false;

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
      ERROR: 'Field cannot be left blank.',
    },
    CUSTOMER: {
      TITLE: 'Customer',
      ENTERPRISE_UUID: {
        TITLE: 'Enterprise Customer / UUID',
        SUB_TITLE: 'Select an existing enterprise to provision',
        ERROR: {
          selected: 'Error, no selected value',
          invalid: 'Not a valid enterprise customer',
        },
        DROPDOWN_DEFAULT: 'No matching enterprise',
      },
      FINANCIAL_IDENTIFIER: {
        TITLE: 'Opportunity Product',
        ERROR: {
          validity: 'Invalid format. Must be 18 characters long, alphanumeric and start with a number.',
          emptyField: 'Field cannot be left blank or incomplete.',
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
        emptyField: 'Fields cannot be left blank or incomplete.',
      },
      TOOLTIP: 'Plan will activate and expire at 12:00AM local time baed on dates selected.',
    },
    INTERNAL_ONLY: {
      TITLE: 'Internal only',
      CHECKBOX: {
        label: 'Test Plan',
        description: 'Select if plan is intended for internal purposes only',
      },
    },
    SUBSIDY_TYPE: {
      TITLE: 'Subsidy Type',
      SUB_TITLE: 'Rev req through standard commercial process?',
      OPTIONS: {
        yes: 'Yes (bulk enrollment prepay)',
        no: 'No (partner no rev prepay)',
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
    ACCOUNT_TYPE: {
      OPTIONS: {
        openCourses: 'Open Courses budget',
        executiveEducation: 'Executive Education budget',
        default: 'Budget',
      },
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
        emptyField: 'Field cannot be left blank.',
      },
    },
    CATALOG: {
      TITLE: 'Catalog',
      SUB_TITLE: 'Associated Catalog',
      OPTIONS: {
        everything: 'Everything',
        openCourses: 'Open Courses',
        executiveEducation: 'Executive Education',
        custom: 'Custom',
      },
      ERROR: 'Please select a Catalog',
    },
    CUSTOM_CATALOG: {
      HEADER: {
        SOURCE: {
          TITLE: 'Custom catalog source',
          SUB_TITLE: 'Ensure the intended enterprise customer catalog has been created in Django before proceeding.',
        },
        DEFINE: {
          TITLE: 'Define custom catalog',
          SUB_TITLE: 'Ensure the intended custom catalog query has been created in Django before proceeding.',
        },
      },
      BUTTON: {
        viewCustomerCatalog: 'View Enterprise Customer Catalog list',
        createQuery: 'Create catalog query',
      },
      OPTIONS: {
        enterpriseCatalogQuery: {
          title: 'Enterprise Catalog Query',
          subtitle: 'Select an existing Enterprise Catalog Query to create the new Customer Catalog record from.',
          error: 'Error, no selected value',
        },
        catalogTitle: 'Catalog title',
        contentFilter: 'Content filter',
        includeExecEd2UCourses: 'Includes Executive Education courses',
        courseModes: 'Enabled course modes',
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
          subtitle: 'The maximum USD value a single learner may redeem from the budget.',
        },
      },
      ERROR: {
        incorrectDollarAmount: 'Please enter a whole dollar value',
        emptyField: 'Field cannot be left blank.',
      },
    },
    ALERTS: {
      MISSING_FIELD_MESSAGES: {
        TITLE: 'Missing required fields',
        SUB_TITLE: 'Please enter incomplete fields and try again.',
      },
      unselectedAccountType: "Please select an 'Account Creation' option to create new policies.",
      API_ERROR_MESSAGES: {
        ENTERPRISE_CATALOG_QUERY: {
          400: 'The enterprise catalog query could not be created.',
          401: 'Authentication failed.',
          403: 'Authentication recognized but incorrect credentials.',
          404: 'Enterprise Catalog Query failed to respond.',
          500: 'System failure',
        },
        ENTERPRISE_CUSTOMER_CATALOG: {
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
  },
};

export const splitStringBudget = ' budget';

export const toastText = {
  successfulPlanCreation: 'Plan successfully created',
};

export const CATALOG_QUERY_PATH = '/admin/enterprise/enterprisecatalogquery/';

// Used to create pre-populated catalog queries for the form. Catalog query ids added in ProvisioningForm.jsx component
export const INITIAL_CATALOG_QUERIES = {
  multipleQueries: [
    {
      uuid: uuidv4(),
      catalogQueryTitle: PROVISIONING_PAGE_TEXT.FORM.ACCOUNT_TYPE.OPTIONS.openCourses,
    },
    {
      uuid: uuidv4(),
      catalogQueryTitle: PROVISIONING_PAGE_TEXT.FORM.ACCOUNT_TYPE.OPTIONS.executiveEducation,
    },
  ],
  defaultQuery: [
    {
      uuid: uuidv4(),
      catalogQueryTitle: PROVISIONING_PAGE_TEXT.FORM.ACCOUNT_TYPE.OPTIONS.default,
    },
  ],
};

export default PROVISIONING_PAGE_TEXT;
