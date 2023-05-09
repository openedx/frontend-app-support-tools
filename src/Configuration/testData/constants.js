import { v4 as uuidv4 } from 'uuid';

export const singlePolicy = [
  {
    catalogQueryMetadata: {
      catalogQuery: '',
    },
    catalogQueryTitle: 'Account',
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
      catalogQueryTitle: 'Open Courses account',
      catalogQueryMetadata: {
        catalogQuery: {
          id: 9,
          title: 'Open Courses account',
        },
      },
      accountName: 'Super Awesome Open Courses',
      accountValue: '250000',
      perLearnerCap: false,
    },
    {
      uuid: uuidv4(),
      catalogQueryTitle: 'Executive Education account',
      catalogQueryMetadata: {
        catalogQuery: {
          id: 10,
          title: 'Executive Education account',
        },
      },
      accountName: 'Ever Expanding Executive Education',
      accountValue: '750000',
      perLearnerCap: true,
      perLearnerCapAmount: '2500',
    },
  ],
  enterpriseUUID: uuidv4(),
  financialIdentifier: 'abc123',
  startDate: '2023-04-18',
  endDate: '2023-04-21',
  internalOnly: 'Yes',
  subsidyRevReq: 'No (partner no rev prepay)',
};

export const sampleSinglePolicyPredefinedCatalogQueryFormData = {
  policies: [
    {
      uuid: uuidv4(),
      catalogQueryTitle: 'Balance',
      catalogQueryMetadata: {
        catalogQuery: {
          id: '10',
          title: 'Executive Education',
        },
      },
      accountName: 'I love Executive Education Only',
      accountValue: '250000',
      perLearnerCap: true,
      perLearnerCapAmount: '2000',
    },
  ],
  enterpriseUUID: uuidv4(),
  financialIdentifier: 'abc123',
  startDate: '2023-04-18',
  endDate: '2023-04-21',
  internalOnly: 'No',
  subsidyRevReq: 'No (partner no rev prepay)',
};

export const sampleSinglePolicyCustomCatalogQueryFormData = {
  policies: [
    {
      uuid: uuidv4(),
      catalogQueryTitle: 'Balance',
      catalogQueryMetadata: {
        catalogQuery: {
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
      },
      accountName: 'Super Cool Awesome',
      customerCatalog: false,
      accountValue: '250000',
      perLearnerCap: false,
    },
  ],
  enterpriseUUID: 'abc',
  financialIdentifier: 'abc',
  startDate: '2023-04-06',
  endDate: '2023-04-27',
  internalOnly: 'Yes',
  subsidyRevReq: 'No (partner no rev prepay)',
};
