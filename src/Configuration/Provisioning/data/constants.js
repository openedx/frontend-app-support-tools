import { titleCase } from '../../../utils';

const PROVISIONING_PAGE_TEXT = {
  DASHBOARD: {
    HEADER: 'Learner Credit Plans',
    BUTTON: {
      new: 'New',
    },
  },
  FORM: {
    TITLE: (pathName) => `${titleCase(pathName.split('/').reverse()[0])} Learner Credit Plan`,
    SUB_TITLE: 'Plan Details',
    CUSTOMER: {
      TITLE: 'Customer',
      OPTIONS: {
        enterpriseUUID: 'Enterprise Customer UUID',
        financialIdentifier: 'Financial Linkage Identifer',
      },
    },
    TERM: {
      TITLE: 'Term',
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
    ACCOUNT_DETAIL: {
      TITLE: 'Account details',
      OPTIONS: {
        displayName: 'Display Name',
        totalFundValue: 'Total Fund Value',
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
  },
};

export default PROVISIONING_PAGE_TEXT;
