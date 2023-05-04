import { v4 as uuidv4 } from 'uuid';
import { titleCase } from '../../../utils';

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
    CUSTOMER: {
      TITLE: 'Customer',
      OPTIONS: {
        enterpriseUUID: 'Enterprise Customer UUID',
        financialIdentifier: 'Opportunity Product',
      },
    },
    TERM: {
      TITLE: 'Term',
      OPTIONS: {
        startDate: 'Start Date',
        endDate: 'End Date',
      },
      VALIDITY: 'Please choose an end date later than the start date',
      TOOLTIP: 'Plan will activate and expire at 12:00AM local time baed on dates selected.',
    },
    SUBSIDY_TYPE: {
      TITLE: 'Subsidy Type',
      SUB_TITLE: 'Rev req through standard commercial process?',
      OPTIONS: {
        yes: 'Yes (bulk enrollment prepay)',
        no: 'No (partner no rev prepay)',
      },
    },
    INTERNAL_ONLY: {
      TITLE: 'Internal only',
      OPTIONS: {
        yes: 'Yes',
        no: 'No',
      },
    },
    ACCOUNT_CREATION: {
      TITLE: 'Balance by product',
      SUB_TITLE: 'Divide Learner Credit purchase value by product?',
      OPTIONS: {
        multiple: 'Yes, create separate Open Courses and Executive Education Learner Credit accounts',
        single: 'No, create one Learner Credit account',
      },
    },
    ACCOUNT_TYPE: {
      OPTIONS: {
        openCourses: 'Open Courses account',
        executiveEducation: 'Executive Education account',
        default: 'Balance',
      },
    },
    ACCOUNT_DETAIL: {
      TITLE: 'Balance details',
      OPTIONS: {
        displayName: 'Display Name',
        totalAccountValue: {
          title: 'Total account value ($)',
          subtitle: 'The contracted USD value available through the account.',
          dynamicSubtitle: (accountType) => `The contracted USD value available through the account redeemable for ${accountType} enrollment.`,
        },
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
        },
        catalogTitle: 'Catalog title',
        contentFilter: 'Content filter',
        includeExecEd2UCourses: 'Includes Executive Education courses',
        courseModes: 'Enabled course modes',
      },
    },
    LEARNER_CAP: {
      TITLE: 'Restrictions',
      SUB_TITLE: 'Create learner spend restrictions?',
      OPTIONS: {
        yes: 'Yes',
        no: 'No, first come first serve',
      },
    },
    LEARNER_CAP_DETAIL: {
      TITLE: 'Define Restrictions',
      OPTIONS: {
        perLearnerSpendCap: {
          title: 'Per learner spend cap ($)',
          subtitle: 'The maximum USD value a single learner may redeem from the account.',
        },
      },
    },
    ALERTS: {
      unselectedAccountType: "Please select an 'Account Creation' option to create new policies.",
      API_ERROR_MESSAGES: {
        ENTERPRISE_CATALOG_QUERY: {
          400: 'The enterprise catalog query could not be created.',
          401: 'Authentication failed.',
          403: 'Authentication recognized but incorrect credentials.',
          404: 'Enterprise Catalog Query failed to respond.',
        },
        ENTERPRISE_CUSTOMER_CATALOG: {
          400: 'The enterprise catalog could not be created.',
          401: 'Authentication failed.',
          403: 'Authentication recognized but incorrect credentials.',
          404: 'Enterprise Catalog failed to respond.',
          405: 'The enterprise catalog could not be created.',
        },
      },
      incorrectDollarAmount: 'Please enter a whole dollar value',
    },
  },
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
