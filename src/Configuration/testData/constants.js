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
      uuid: '0b2cb3f8-d697-487c-bdc6-24e470878e30',
      includeExecEd2UCourses: false,
    },
    {
      id: 6,
      contentFilter: {},
      created: '2023-03-13T19:09:24.841448Z',
      modified: '2023-03-13T19:09:24.841448Z',
      title: 'TestQ6',
      uuid: '20cb6503-424f-4877-a606-b054808e6174',
      includeExecEd2UCourses: false,
    },
    {
      id: 5,
      contentFilter: {},
      created: '2023-03-12T21:59:28.014016Z',
      modified: '2023-03-12T21:59:28.014016Z',
      title: 'TestQ5',
      uuid: 'df85c9ea-f29d-430a-8e83-a3c37aeaf6ce',
      includeExecEd2UCourses: false,
    },
    {
      id: 3,
      contentFilter: {},
      created: '2023-03-10T16:31:57.251750Z',
      modified: '2023-03-10T16:31:57.251750Z',
      title: 'TestQ3',
      uuid: 'd8c0f20e-55fd-41a6-8b3e-41682720281b',
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
      uuid: '312af8b3-8999-475f-b8df-c1522170a5ce',
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
      uuid: 'd9b5d92b-e5c6-4cca-812c-57bb536e7c9b',
      includeExecEd2UCourses: false,
    },
  ],
  isLoading: false,
};

export const sampleDataTableData = (count) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      uuid: uuidv4(),
      enterprise_customer_uuid: uuidv4(),
      customerName: `Catalog Query ${i + 1}`,
      active_datetime: '2021-03-10T16:31:57.251750Z',
      expiration_datetime: '2021-12-31T16:31:57.251750Z',
    });
  }
  return data;
};

const testTime = '2021-03-10T16:31:57.251750Z';
export const testTimeLocal = new Date(testTime).toLocaleDateString().replace(/\//g, '-');
