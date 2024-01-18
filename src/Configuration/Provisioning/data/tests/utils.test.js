import { v4 as uuidv4 } from 'uuid';
import { camelCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import {
  createPolicy,
  createSubsidy,
  determineInvalidFields,
  filterByEnterpriseCustomerName,
  generateBudgetDisplayName,
  getCamelCasedConfigAttribute,
  getOrCreateCatalog,
  hasValidPolicyAndSubsidy,
  normalizeSubsidyDataTableData,
  patchPolicy,
  patchSubsidy,
  selectProvisioningContext,
  sortDataTableData,
  sortedCustomCatalogs,
  transformDataTableData,
  transformDatatableDate,
  transformPatchPolicyPayload,
  transformPolicyData,
  transformSubsidyData,
} from '../utils';
import {
  sampleCatalogs,
  sampleDataTableData,
  sampleMultiplePolicyFormData,
  sampleSinglePolicyCustomCatalogQueryFormData,
  sampleSinglePolicyPredefinedCatalogQueryFormData,
} from '../../../testData/constants';
import { PREDEFINED_QUERIES_ENUM, USES_LOCAL_TEST_DATA } from '../constants';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

describe('selectProvisioningContext', () => {
  it('throws an error when no arguments are passed', () => {
    expect(() => selectProvisioningContext()).toThrow();
  });
});

describe('sortedCustomCatalogs', () => {
  it('sorts catalogs by reverse modified date (newest first)', () => {
    const testObjectSorted = sortedCustomCatalogs(sampleCatalogs);
    for (let i = 0; i < testObjectSorted.length - 1; i++) {
      expect(testObjectSorted[i].modified > testObjectSorted[i + 1].modified).toBeTruthy();
    }
  });
  it('returns the object array in the same order with no modified date fields', () => {
    const testObject = [{
      id: 1,
    },
    {
      id: 2,
    }];
    const testObjectSorted = sortedCustomCatalogs(testObject);
    expect(testObjectSorted).toEqual(testObject);
  });
});

describe('hasValidPolicyAndSubsidy', () => {
  const formDataUseCases = [
    sampleMultiplePolicyFormData,
    sampleSinglePolicyCustomCatalogQueryFormData,
    sampleSinglePolicyPredefinedCatalogQueryFormData,
  ];
  it('returns true if all required fields are filled out', () => {
    formDataUseCases.forEach((formData) => {
      expect(hasValidPolicyAndSubsidy(formData)).toBeTruthy();
    });
  });
});

describe('getCamelCasedConfigAttribute', () => {
  const PREDEFINED_CATALOG_QUERIES = {
    everything: 1,
    open_courses: 2,
    executive_education: 3,
  };
  it('returns the correct camelCased attribute', () => {
    expect(getCamelCasedConfigAttribute('PREDEFINED_CATALOG_QUERIES')).toEqual(camelCaseObject(PREDEFINED_CATALOG_QUERIES));
  });
  it('returns null if no attribute is passed', () => {
    expect(getCamelCasedConfigAttribute()).toEqual(null);
  });
  it('returns null if attribute is passed but no configuration exist', () => {
    expect(getCamelCasedConfigAttribute('PIKACHU_FEATURE_FLAG')).toEqual(null);
  });
});

describe('generateBudgetDisplayName', () => {
  it('returns the correct display name when a predefined query is selected', () => {
    const actualDisplayName = generateBudgetDisplayName({
      predefinedQueryType: PREDEFINED_QUERIES_ENUM.openCourses,
      customCatalog: false,
      catalogUuid: undefined,
      catalogTitle: undefined,
    });
    expect(actualDisplayName).toEqual('Open Courses');
  });
  it('returns the correct display name when a custom catalog is selected', () => {
    const actualDisplayName = generateBudgetDisplayName({
      predefinedQueryType: undefined,
      customCatalog: true,
      catalogUuid: uuidv4(),
      catalogTitle: 'Foo Bar Custom Catalog',
    });
    expect(actualDisplayName).toEqual('Unique/Curated');
  });
  it('returns the correct display name when no catalog is selected', () => {
    const actualDisplayName = generateBudgetDisplayName({
      predefinedQueryType: undefined,
      customCatalog: false,
      catalogUuid: undefined,
      catalogTitle: undefined,
    });
    expect(actualDisplayName).toEqual(null);
  });
  it('returns the correct display name when no policy is passed', () => {
    const actualDisplayName = generateBudgetDisplayName({});
    expect(actualDisplayName).toEqual(null);
  });
});

describe('normalizeSubsidyDataTableData', () => {
  it('returns the correct data', () => {
    const fetchedSubsidyData = camelCaseObject(sampleDataTableData(10));
    const fetchedCustomerData = fetchedSubsidyData.results.map((item) => ({
      id: item.enterpriseCustomerUuid,
      name: item.customerName,
    }));
    const actionIcon = jest.fn();
    const normalizedData = normalizeSubsidyDataTableData({ fetchedSubsidyData, actionIcon, fetchedCustomerData });
    fetchedSubsidyData.results.forEach((item, index) => {
      expect(normalizedData.results[index].uuid).toEqual(item.uuid);
      expect(normalizedData.results[index].activeDatetime).toEqual(item.activeDatetime);
      expect(normalizedData.results[index].expirationDatetime).toEqual(item.expirationDatetime);
    });
  });
  it('returns empty array in testing flag false', () => {
    const emptySubsidy = sampleDataTableData(5, false);
    expect(emptySubsidy).toEqual([]);
  });
  it('returns empty array in testing flag false and count is zero', () => {
    const fetchedSubsidyData = camelCaseObject(sampleDataTableData(0));
    const fetchedCustomerData = fetchedSubsidyData.results.map((item) => ({
      id: item.enterpriseCustomerUuid,
      name: item.customerName,
    }));
    const actionIcon = jest.fn();
    const emptySubsidy = normalizeSubsidyDataTableData({ fetchedSubsidyData, actionIcon, fetchedCustomerData });
    expect(emptySubsidy).toEqual({
      count: 0,
      results: [],
    });
  });
});

describe('USES_LOCAL_TEST_DATA', () => {
  it('should be false so testing state does not get sent to prod', () => {
    expect(USES_LOCAL_TEST_DATA).toEqual(false);
  });
});

const sampleResponses = {
  data: {
    getOrCreateCatalog: {
      uuid: 'abf9f43b-1872-4c26-a2e6-1598fc57fbdd',
      title: 'test123',
      enterprise_customer: 'c6aaf182-bcae-4d14-84cd-d538b7ec08f0',
      enterprise_catalog_query: 10,
    },
    createSubsidy: {
      uuid: '205f11a4-0303-4407-a2e7-80261ef8fb8f',
      title: '321',
      enterprise_customer_uuid: 'a929e999-2487-4a53-9741-92e0d2022598',
      active_datetime: '2023-05-09T00:00:00Z',
      expiration_datetime: '2023-06-02T00:00:00Z',
      unit: 'usd_cents',
      reference_id: '112211',
      reference_type: 'salesforce_opportunity_line_item',
      current_balance: 1200,
      starting_balance: 1200,
      internal_only: true,
      revenue_category: 'partner-no-rev-prepay',
    },
    createPolicy: {
      uuid: '7a5e4882-16a6-4a5f-bfe1-eda91014aff4',
      policy_type: 'PerLearnerSpendCreditAccessPolicy',
      display_name: 'test-display-name',
      description: 'This policy created for subsidy 205f11a4-0303-4407-a2e7-80261ef8fb8f with 1 associated policies',
      active: true,
      enterprise_customer_uuid: 'a929e999-2487-4a53-9741-92e0d2022598',
      catalog_uuid: '2afb0a7f-103d-43c3-8b1a-db8c5b3ba1f4',
      subsidy_uuid: '205f11a4-0303-4407-a2e7-80261ef8fb8f',
      access_method: 'direct',
      per_learner_enrollment_limit: null,
      per_learner_spend_limit: null,
      spend_limit: 1200,
    },
  },
};

const samplePatchResponses = {
  data: {
    patchCatalog: {
      uuid: 'abcdefghijklmnopqrstuvwxyz',
      title: 'Awesome title',
      enterprise_customer: 'awesome-enterpri53-cu573m3r',
      enterprise_catalog_query: 24,
    },
    patchSubsidy: {
      uuid: '205f11a4-0303-4407-a2e7-80261ef8fb8f',
      title: 'awesome subsidy title',
      enterprise_customer_uuid: 'a929e999-2487-4a53-9741-92e0d2022598',
      active_datetime: '2023-05-09T00:00:00Z',
      expiration_datetime: '2023-06-02T00:00:00Z',
      unit: 'usd_cents',
      reference_id: '112211',
      reference_type: 'salesforce_opportunity_line_item',
      current_balance: 1200,
      starting_balance: 1200,
      internal_only: true,
      revenue_category: 'partner-no-rev-prepay',
    },
    patchPolicy: {
      uuid: '7a5e4882-16a6-4a5f-bfe1-eda91014aff4',
      policy_type: 'PerLearnerSpendCreditAccessPolicy',
      display_name: 'test-display-name',
      description: 'awesome description',
      active: true,
      enterprise_customer_uuid: 'a929e999-2487-4a53-9741-92e0d2022598',
      catalog_uuid: '2afb0a7f-103d-43c3-8b1a-db8c5b3ba1f4',
      subsidy_uuid: '205f11a4-0303-4407-a2e7-80261ef8fb8f',
      access_method: 'direct',
      per_learner_enrollment_limit: null,
      per_learner_spend_limit: 12,
      spend_limit: 1200,
    },
  },
};

describe('getOrCreateCatalog', () => {
  it('returns the correct data', async () => {
    getAuthenticatedHttpClient.mockImplementation(() => ({
      post: jest.fn().mockResolvedValue({ data: sampleResponses.data.getOrCreateCatalog }),
    }));
    const data = await getOrCreateCatalog({
      enterpriseCustomerUuid: 'c6aaf182-bcae-4d14-84cd-d538b7ec08f0',
      catalogQueryId: 10,
      title: 'c6aaf182-bcae-4d14-84cd-d538b7ec08f0 - test123',
    });
    expect(data).toEqual(sampleResponses.data.getOrCreateCatalog);
    // TODO: check that getAuthenticatedHttpClient.post was called with the correct payload.
  });
});

describe('createSubsidy', () => {
  it('returns the correct data', async () => {
    getAuthenticatedHttpClient.mockImplementation(() => ({
      post: jest.fn().mockResolvedValue({ data: sampleResponses.data.createSubsidy }),
    }));
    const data = await createSubsidy({
      reference_id: '112211',
      default_title: '321',
      default_enterprise_customer_uuid: 'a929e999-2487-4a53-9741-92e0d2022598',
      default_active_datetime: '2023-05-09T00:00:00.000Z',
      default_expiration_datetime: '2023-06-02T00:00:00.000Z',
      default_unit: 'usd_cents',
      default_starting_balance: 1200,
      default_revenue_category: 'partner-no-rev-prepay',
      default_internal_only: true,
    });
    expect(data).toEqual(sampleResponses.data.createSubsidy);
  });
});

describe('patchSubsidy', () => {
  it('returns the correct data', async () => {
    getAuthenticatedHttpClient.mockImplementation(() => ({
      patch: jest.fn().mockResolvedValue({ data: samplePatchResponses.data.patchSubsidy }),
    }));
    const { data } = await patchSubsidy({
      uuid: '205f11a4-0303-4407-a2e7-80261ef8fb8f',
      title: 'awesome subsidy title',
      active_datetime: '2023-05-09T00:00:00Z',
      expiration_datetime: '2023-06-02T00:00:00Z',
      internal_only: true,
      revenue_category: 'partner-no-rev-prepay',
    });
    expect(data).toEqual(samplePatchResponses.data.patchSubsidy);
  });
});

describe('createPolicies', () => {
  it('returns the correct data', async () => {
    getAuthenticatedHttpClient.mockImplementation(() => ({
      post: jest.fn().mockResolvedValue({ data: sampleResponses.data.createPolicy }),
    }));
    const { data } = await createPolicy({
      policy_type: 'PerLearnerSpendCreditAccessPolicy',
      display_name: 'test-display-name',
      description: 'This policy created for subsidy 205f11a4-0303-4407-a2e7-80261ef8fb8f with 1 associated policies',
      active: true,
      enterprise_customer_uuid: 'a929e999-2487-4a53-9741-92e0d2022598',
      catalog_uuid: '2afb0a7f-103d-43c3-8b1a-db8c5b3ba1f4',
      subsidy_uuid: '205f11a4-0303-4407-a2e7-80261ef8fb8f',
      access_method: 'direct',
      per_learner_spend_limit: null,
      per_learner_enrollment_limit: null,
      spend_limit: 1200,
    });
    expect(data).toEqual(sampleResponses.data.createPolicy);
  });
});

describe('patchPolicy', () => {
  it('returns the correct data', async () => {
    getAuthenticatedHttpClient.mockImplementation(() => ({
      patch: jest.fn().mockResolvedValue({ data: samplePatchResponses.data.patchPolicy }),
    }));
    const { data } = await patchPolicy({
      uuid: '7a5e4882-16a6-4a5f-bfe1-eda91014aff4',
      description: 'awesome description',
      catalog_uuid: '2afb0a7f-103d-43c3-8b1a-db8c5b3ba1f4',
      per_learner_spend_limit: 12,
      spend_limit: 1200,
    });
    expect(data).toEqual(samplePatchResponses.data.patchPolicy);
  });
});

const emptyDataSet = {
  policies: [],
  subsidyTitle: '',
  enterpriseUUID: 'abc',
  financialIdentifier: '',
  startDate: '',
  endDate: '',
  subsidyRevReq: '',
};
describe('determineInvalidFields', () => {
  it('returns false (invalid)for all subsidy fields', async () => {
    getAuthenticatedHttpClient.mockImplementation(() => ({
      get: jest.fn().mockResolvedValue({ data: [{ id: uuidv4() }] }),
    }));
    const expectedFailedSubsidyOutput = {
      subsidyTitle: false,
      enterpriseUUID: false,
      financialIdentifier: false,
      startDate: false,
      endDate: false,
      subsidyRevReq: false,
      multipleFunds: false,
    };
    const output = await determineInvalidFields(emptyDataSet);
    expect(output).toEqual([expectedFailedSubsidyOutput]);
  });
  it('returns false (invalid)for all policy fields', async () => {
    const expectedFailedPolicyOutput = [{
      subsidyTitle: false,
      enterpriseUUID: false,
      financialIdentifier: false,
      startDate: false,
      endDate: false,
      subsidyRevReq: false,
      multipleFunds: true,
    }, [{
      accountName: false,
      accountValue: false,
      catalogUuid: true, // This is true (i.e. valid) because catalogUuid is not required when customCatalog != true.
      predefinedQueryType: false,
      perLearnerCap: false,
      perLearnerCapAmount: false,
      policyType: false,
    }]];
    const emptyPolicyDataset = {
      ...emptyDataSet,
      multipleFunds: true,
      policies: [{
        accountName: '',
        accountValue: '',
        catalogTitle: undefined,
        catalogUuid: undefined,
        customCatalog: undefined,
        predefinedQueryType: undefined,
        perLearnerCap: undefined,
        perLearnerCapAmount: null,
      }],
    };
    const output = await determineInvalidFields(emptyPolicyDataset);
    expect(output).toEqual(expectedFailedPolicyOutput);
  });
});

describe('transformPolicyData', () => {
  it('returns an empty array when no policies are passed', async () => {
    const output = await transformPolicyData({ policies: [] }, [], []);
    expect(output).toEqual([]);
  });
});

describe('transformPatchPolicyData', () => {
  it('returns an empty array when no policies are passed', async () => {
    const output = await transformPatchPolicyPayload({ policies: [] }, []);
    expect(output).toEqual([]);
  });
  it('returns the correct data', async () => {
    const mockFormData = {
      policies: [{
        policyType: 'PerLearnerSpendCreditAccessPolicy',
        accountDescription: 'awesome policy description',
        customCatalog: true,
        catalogTitle: 'awesome custom catalog',
        catalogUuid: '2afb0a7f-103d-43c3-8b1a-db8c5b3ba1f4',
        perLearnerCap: true,
        perLearnerCapAmount: 200,
        uuid: '12324232',
        accountValue: 12000,
      }],
      subsidyUuid: '205f11a4-0303-4407-a2e7-80261ef8fb8f',
    };
    const output = await transformPatchPolicyPayload(mockFormData, [undefined]);
    expect(output).toEqual([{
      description: 'awesome policy description',
      catalogUuid: '2afb0a7f-103d-43c3-8b1a-db8c5b3ba1f4',
      subsidyUuid: '205f11a4-0303-4407-a2e7-80261ef8fb8f',
      perLearnerSpendLimit: 200,
      uuid: '12324232',
    }]);
  });
});

describe('transformDatatableDate', () => {
  it('returns the correct date', () => {
    const dateStrings = '2023-06-28T18:03:09.898Z';
    const output = '6-28-2023';
    expect(transformDatatableDate(dateStrings)).toEqual(output);
  });
  it('returns null if no date is passed', () => {
    const output = null;
    expect(transformDatatableDate()).toEqual(output);
  });
});

describe('filterDatatableData', () => {
  it('returns empty object if no data is passed', () => {
    const output = {};
    expect(transformDataTableData({ filters: {} })).toEqual(output);
  });
  it('returns empty object if no filters are passed', () => {
    const output = {
      enterpriseCustomerName: 'testName',
      enterpriseCustomerUuid: 'testUUID',
    };
    expect(transformDataTableData(
      {
        filters: [{
          id: 'enterpriseCustomerName',
          value: 'testName',
        },
        {
          id: 'enterpriseCustomerUuid',
          value: 'testUUID',
        },
        ],
      },
    )).toEqual(output);
  });
});

describe('sortDatatableData', () => {
  it('returns null if no data is passed', () => {
    const output = null;
    expect(sortDataTableData({ sortBy: {} })).toEqual(output);
  });
  it('returns a sort by expirationDateTime if isActive is passed as the id', () => {
    const output = 'expiration_datetime';

    // desc is true
    expect(sortDataTableData({
      sortBy:
        [{
          id: 'isActive',
          desc: true,
        }],
    })).toEqual(`-${output}`);

    // desc is false
    expect(sortDataTableData({
      sortBy:
        [{
          id: 'isActive',
          desc: false,
        }],
    })).toEqual(output);
  });
  it('returns a sort by title if title is passed as the id', () => {
    const output = 'title';

    // desc is true
    expect(sortDataTableData({
      sortBy:
        [{
          id: 'title',
          desc: true,
        }],
    })).toEqual(`-${output}`);

    // desc is false
    expect(sortDataTableData({
      sortBy:
        [{
          id: 'title',
          desc: false,
        }],
    })).toEqual(output);
  });
});

describe('filterByEnterpriseCustomerName', () => {
  const truefilterBy = {
    enterpriseCustomerName: 'Test Enterprise',
  };
  const falseFilterBy = {
    enterpriseCustomerName: 'Pikachu',
  };
  const fetchedCustomerData = [
    {
      id: 'a929e999-2487-4a53-9741-92e0d2022598',
      name: 'Test Enterprise',
    },
    {
      id: 'c6aaf182-bcae-4d14-84cd-d538b7ec08f0',
      name: 'You can do better',
    },
  ];
  it('returns the correct data', () => {
    const output = {
      enterpriseCustomerUuid: 'a929e999-2487-4a53-9741-92e0d2022598',
    };
    expect(filterByEnterpriseCustomerName({ filterBy: truefilterBy, fetchedCustomerData })).toEqual(output);
  });
  it('returns an empty object if no customer name matches', () => {
    const output = {};
    expect(filterByEnterpriseCustomerName({ filterBy: falseFilterBy, fetchedCustomerData })).toEqual(output);
  });
});

describe('transformSubsidyData', () => {
  const enterpriseUUID = uuidv4();
  const transformedSinglePolicyData = {
    enterpriseUUID,
    financialIdentifier: '00kc1230abc1234321',
    internalOnly: false,
    isoStartDate: '2023-04-18T00:00:00.000Z',
    isoEndDate: '2023-04-21T00:00:00.000Z',
    revenueCategory: 'partner-no-rev-prepay',
    startingBalance: 250000,
    subsidyTitle: 'Test Subsidy',
  };
  it('transform single subsidy form data', () => {
    const singlePolicyFormData = {
      ...sampleSinglePolicyPredefinedCatalogQueryFormData,
      enterpriseUUID,
    };
    const transformedSingleSubsidy = transformSubsidyData(singlePolicyFormData);
    expect(transformedSingleSubsidy).toEqual(transformedSinglePolicyData);
  });
});
