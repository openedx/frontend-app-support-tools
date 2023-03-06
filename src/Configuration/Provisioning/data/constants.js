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
      submit: 'Create Learner Credit Plan',
      cancel: 'Cancel',
    },
    CUSTOMER: {
      TITLE: 'Customer',
      OPTIONS: {
        enterpriseUUID: 'Enterprise Customer UUID',
        financialIdentifier: 'Financial Linkage Identifer',
      },
    },
    TERM: {
      TITLE: 'Term',
      OPTIONS: {
        startDate: 'Start Date',
        endDate: 'End Date',
      },
    },
    SUBSIDY_TYPE: {
      TITLE: 'Subsidy Type',
      SUB_TITLE: 'Rev req through standard commercial process?',
      OPTIONS: {
        yes: 'Yes (bulk enrollment prepay)',
        no: 'No (partner no rev prepay)',
      },
    },
    ACCOUNT_CREATION: {
      TITLE: 'Account creation',
      SUB_TITLE: 'Split Learner Credit value into accounts by products?',
      OPTIONS: {
        multiple: 'Yes, create separate Open Courses and Executive Education Learner Credit accounts',
        single: 'No, create one Learner Credit account',
      },
    },
    ACCOUNT_TYPE: {
      OPTIONS: {
        openCourses: 'Open Courses account',
        executiveEducation: 'Executive Education account',
        default: 'Account',
      },
    },
    ACCOUNT_DETAIL: {
      TITLE: 'Account details',
      OPTIONS: {
        displayName: 'Display Name',
        totalAccountValue: {
          title: 'Total account value',
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
      TITLE: 'Define custom catalog',
      SUB_TITLE: 'Ensure the intended custom catalog query has been created in Django before proceeding.',
      BUTTON: {
        create: 'Create catalog query',
      },
      OPTIONS: {
        enterpriseCatalogQuery: {
          title: 'Enterprise Catalog Query',
          subtitle: 'Select enterprise catalog query',
        },
        catalogTitle: 'Catalog title',
        contentFilter: 'Content filter',
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
          title: 'Per learner spend cap',
          subtitle: 'The maximum USD value a single learner may redeem from the account.',
        },
      },
    },
  },
};

export const CATALOG_QUERY_PATH = '/admin/enterprise/enterprisecatalogquery/';

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
