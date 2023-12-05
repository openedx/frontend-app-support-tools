import { v4 as uuidv4 } from 'uuid';

// Dummy values for the PREDEFINED_CATALOG_QUERIES Config attribute.
export const MOCK_PREDEFINED_CATALOG_QUERIES = {
  everything: 2,
  open_courses: 3,
  executive_education: 1,
};

export const singlePolicy = [
  {
    catalogTitle: 'Account',
    catalogUuid: '',
    customCatalog: undefined,
    predefinedQueryType: undefined,
    uuid: uuidv4(),
    customerCatalog: false,
  },
];

export const sampleCatalogQueries = {
  data: [
    {
      id: 4,
      contentFilter: {},
      created: '2023-03-10T17:24:51.545054Z',
      modified: '2023-03-10T17:24:51.545054Z',
      title: 'TestQ4',
      uuid: uuidv4(),
      includeExecEd2UCourses: false,
    },
    {
      id: 6,
      contentFilter: {},
      created: '2023-03-13T19:09:24.841448Z',
      modified: '2023-03-13T19:09:24.841448Z',
      title: 'TestQ6',
      uuid: uuidv4(),
      includeExecEd2UCourses: false,
    },
    {
      id: 5,
      contentFilter: {},
      created: '2023-03-12T21:59:28.014016Z',
      modified: '2023-03-12T21:59:28.014016Z',
      title: 'TestQ5',
      uuid: uuidv4(),
      includeExecEd2UCourses: false,
    },
    {
      id: 3,
      contentFilter: {},
      created: '2023-03-10T16:31:57.251750Z',
      modified: '2023-03-10T16:31:57.251750Z',
      title: 'TestQ3',
      uuid: uuidv4(),
      includeExecEd2UCourses: true,
    },
    {
      id: 2,
      contentFilter: {
        contentType: 'courses',
      },
      created: '2023-02-22T19:30:19.611766Z',
      modified: '2023-02-22T19:30:19.611766Z',
      title: 'TestQ2',
      uuid: uuidv4(),
      includeExecEd2UCourses: false,
    },
    {
      id: 1,
      contentFilter: {
        contentType: 'learnerpathway',
      },
      created: '2023-02-22T19:26:42.920525Z',
      modified: '2023-02-22T19:26:42.920525Z',
      title: 'TestQ1',
      uuid: uuidv4(),
      includeExecEd2UCourses: false,
    },
  ],
  isLoading: false,
};

export const sampleEnterpriseUuid = uuidv4();

// List of catalog objects as returned by the list catalogs API endpoint (converted to camelCase).
export const sampleCatalogs = [
  {
    uuid: uuidv4(),
    title: `${sampleEnterpriseUuid} --- Open Courses`,
    enterpriseCustomer: sampleEnterpriseUuid,
    enterpriseCatalogQuery: MOCK_PREDEFINED_CATALOG_QUERIES.open_courses,
    created: '2023-03-10T17:24:51.545054Z',
    modified: '2023-03-10T17:24:51.545054Z',
  },
  {
    uuid: uuidv4(),
    title: `${sampleEnterpriseUuid} --- Executive Education`,
    enterpriseCustomer: sampleEnterpriseUuid,
    enterpriseCatalogQuery: MOCK_PREDEFINED_CATALOG_QUERIES.executive_education,
    created: '2023-03-13T19:09:24.841448Z',
    modified: '2023-03-13T19:09:24.841448Z',
  },
  {
    uuid: uuidv4(),
    title: `${sampleEnterpriseUuid} --- Everything`,
    enterpriseCustomer: sampleEnterpriseUuid,
    enterpriseCatalogQuery: MOCK_PREDEFINED_CATALOG_QUERIES.everything,
    created: '2023-03-12T21:59:28.014016Z',
    modified: '2023-03-12T21:59:28.014016Z',
  },
  {
    uuid: uuidv4(),
    title: 'Foo Bar Custom Catalog 1',
    enterpriseCustomer: sampleEnterpriseUuid,
    enterpriseCatalogQuery: 101,
    created: '2024-03-12T21:59:28.014016Z',
    modified: '2024-03-12T21:59:28.014016Z',
  },
  {
    uuid: uuidv4(),
    title: 'Foo Bar Custom Catalog 2',
    enterpriseCustomer: sampleEnterpriseUuid,
    enterpriseCatalogQuery: 102,
    created: '2025-03-12T21:59:28.014016Z',
    modified: '2025-03-12T21:59:28.014016Z',
  },
];

export const sampleDataTableData = (count, testing = true) => {
  if (!testing) {
    return [];
  }
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      uuid: uuidv4(),
      title: `Subidy Title ${i + 1}`,
      enterprise_customer_uuid: uuidv4(),
      customerName: `Enterprise Customer ${i + 1}`,
      active_datetime: '2021-03-10T16:31:57.251750Z',
      expiration_datetime: '2021-12-31T16:31:57.251750Z',
    });
  }
  return {
    count: data.length,
    results: data,
  };
};

export function getSampleCustomers(count = 10) {
  const sampleCustomers = [];
  for (let i = 0; i < count; i++) {
    sampleCustomers.push({
      id: uuidv4(),
      name: `Customer ${i + 1}`,
    });
  }
  return sampleCustomers;
}

export const sampleMultiplePolicyFormData = {
  policies: [
    {
      uuid: uuidv4(),
      catalogTitle: 'Open Courses account',
      catalogUuid: undefined,
      customCatalog: undefined,
      predefinedQueryType: 'openCourses',
      accountName: 'Super Awesome Open Courses',
      accountValue: '250000',
      perLearnerCap: false,
    },
    {
      uuid: uuidv4(),
      catalogTitle: 'Executive Education account',
      catalogUuid: undefined,
      customCatalog: undefined,
      predefinedQueryType: 'executiveEducation',
      accountName: 'Ever Expanding Executive Education',
      accountValue: '750000',
      perLearnerCap: true,
      perLearnerCapAmount: '2500',
    },
  ],
  enterpriseUUID: uuidv4(),
  financialIdentifier: '00kc1230abc1234321',
  startDate: '2023-04-18',
  endDate: '2023-04-21',
  internalOnly: 'Yes',
  subsidyRevReq: 'partner-no-rev-prepay',
  subsidyUuid: '123testSubsidyUuid',
  subsidyTitle: 'Test Subsidy',
};

export const sampleSinglePolicyPredefinedCatalogQueryFormData = {
  policies: [
    {
      uuid: uuidv4(),
      catalogTitle: 'Balance',
      catalogUuid: undefined,
      customCatalog: undefined,
      predefinedQueryType: 'executiveEducation',
      accountName: 'I love Executive Education Only',
      accountValue: '250000',
      perLearnerCap: true,
      perLearnerCapAmount: '2000',
    },
  ],
  enterpriseUUID: uuidv4(),
  financialIdentifier: '00kc1230abc1234321',
  startDate: '2023-04-18',
  endDate: '2023-04-21',
  internalOnly: 'No',
  subsidyRevReq: 'partner-no-rev-prepay',
  subsidyTitle: 'Test Subsidy',
};

export const sampleSinglePolicyCustomCatalogQueryFormData = {
  policies: [
    {
      uuid: uuidv4(),
      catalogTitle: 'Sample Custom Catalog',
      catalogUuid: uuidv4(),
      customCatalog: true,
      predefinedQueryType: undefined,
      accountName: 'Super Cool Awesome',
      customerCatalog: false,
      accountValue: '250000',
      perLearnerCap: false,
    },
  ],
  enterpriseUUID: 'abc',
  financialIdentifier: '00kc1230abc1234321',
  startDate: '2023-04-06',
  endDate: '2023-04-27',
  internalOnly: 'Yes',
  subsidyRevReq: 'partner-no-rev-prepay',
  subsidyTitle: 'Test Subsidy',
};

export const sampleSingleEmptyData = {
  policies: [
    {
      uuid: uuidv4(),
      catalogTitle: '',
      catalogUuid: undefined,
      customCatalog: false,
      predefinedQueryType: undefined,
      accountName: '',
      customerCatalog: false,
      accountValue: '',
      perLearnerCap: false,
    },
  ],
  enterpriseUUID: 'abc',
  financialIdentifier: '00kc1230abc1234321',
  startDate: '2023-04-06',
  endDate: '2023-04-27',
  internalOnly: 'Yes',
  subsidyRevReq: 'partner-no-rev-prepay',
  subsidyTitle: 'Test Subsidy',
};

export const samplePolicyResponse = {
  data: {
    results: [{
      uuid: '1fedab07-8872-4795-8f8c-e4035b1f41b7',
      policy_type: 'PerLearnerSpendCreditAccessPolicy',
      description: 'Mariana-Test --- Executive Education budget, Initial Policy Value: $5000, Initial Subsidy Value: $9000',
      active: true,
      enterprise_customer_uuid: '4a67c952-8eb1-44ba-9ab3-2faa5d0905de',
      catalog_uuid: '69035754-fa48-4519-92d8-a723ae0f6e58',
      subsidy_uuid: '0196e5c3-ba08-4798-8bf1-019d747c27bf',
      access_method: 'direct',
      per_learner_enrollment_limit: null,
      per_learner_spend_limit: 5000,
      spend_limit: 500000,
      subsidy_active_datetime: '2023-06-20T00:00:00Z',
      subsidy_expiration_datetime: '2023-06-22T00:00:00Z',
      is_subsidy_active: false,
    }],
  },
};
