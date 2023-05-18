import { camelCaseObject } from '@edx/frontend-platform';
import {
  createCatalogs,
  lmsCustomerCatalog,
  selectProvisioningContext,
  sortedCatalogQueries,
  hasValidPolicyAndSubidy,
  getCamelCasedConfigAttribute,
  extractDefinedCatalogTitle,
  filterIndexOfCatalogQueryTitle,
  createSubsidy,
  createPolicy,
} from '../utils';
import {
  sampleCatalogQueries,
  sampleMultiplePolicyFormData,
  sampleSinglePolicyCustomCatalogQueryFormData,
  sampleSinglePolicyPredefinedCatalogQueryFormData,
} from '../../../testData/constants';

describe('selectProvisioningContext', () => {
  it('throws an error when no arguments are passed', () => {
    expect(() => selectProvisioningContext()).toThrow();
  });
});

describe('sortedCatalogQueries', () => {
  it('sorts catalog queries by last modified date (newest first)', () => {
    const sortedQueries = sortedCatalogQueries(sampleCatalogQueries.data);
    for (let i = 0; i < sortedQueries.length - 1; i++) {
      expect(sortedQueries[i].title).toEqual(`TestQ${sortedQueries.length - i}`);
      expect(sortedQueries[i].modified < sortedQueries[i + 1]).toBeTruthy();
    }
  });
  it('returns the object array in the same order if no modified date fields', () => {
    const testObject = [{
      id: 1,
    },
    {
      id: 2,
    }];

    const testObjectSort = sortedCatalogQueries(testObject);
    expect(testObjectSort).toEqual(testObject);
  });
});

describe('lmsCustomerCatalog', () => {
  it('queryBy returns the correct url', () => {
    expect(lmsCustomerCatalog.queryBy('testtest')).toEqual('/admin/enterprise/enterprisecustomercatalog/?q=testtes');
  });
  it('queryBy returns the correct url', () => {
    expect(lmsCustomerCatalog.queryBy()).toEqual('/admin/enterprise/enterprisecustomercatalog/');
  });
});

describe('hasValidPolicyAndSubidy', () => {
  const formDataUseCases = [
    sampleMultiplePolicyFormData,
    sampleSinglePolicyCustomCatalogQueryFormData,
    sampleSinglePolicyPredefinedCatalogQueryFormData,
  ];
  it('returns true if all required fields are filled out', () => {
    formDataUseCases.forEach((formData) => {
      expect(hasValidPolicyAndSubidy(formData)).toBeTruthy();
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

describe('extractDefinedCatalogTitle', () => {
  it('returns the correct title', () => {
    expect(extractDefinedCatalogTitle({ catalogQueryTitle: 'The Bestests budget' })).toEqual('The Bestests');
  });
  it('returns null if policy does not container ` budget`', () => {
    expect(extractDefinedCatalogTitle({ catalogQueryTitle: 'The Bestests' })).toEqual(null);
  });
  it('returns null if no policy is passed', () => {
    expect(extractDefinedCatalogTitle({})).toEqual(null);
  });
});

describe('filterIndexOfCatalogQuery', () => {
  it('filters correctly', () => {
    const sampleFilterBy = '[SPLIT][HERE]';
    const modifedSampleCatalogQueries = sampleCatalogQueries.data.map((query, index) => ({
      ...query,
      title: index % 2 ? `${sampleFilterBy} ${query.title}` : query.title,
    }));
    const modifiedFilteredByResponse = sampleCatalogQueries.data
      .map((query, index) => (!(index % 2) ? query : false))
      .filter((query) => query !== false);
    expect(filterIndexOfCatalogQueryTitle(
      modifedSampleCatalogQueries,
      sampleFilterBy,
    )).toEqual(modifiedFilteredByResponse);
  });
  it('returns the original array if no filter is passed', () => {
    expect(filterIndexOfCatalogQueryTitle(sampleCatalogQueries.data)).toEqual(sampleCatalogQueries.data);
  });
});

const sampleResponses = {
  data: {
    createCatalog: {
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

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: () => ({
    post: () => Promise.resolve(sampleResponses),
  }),
}));

describe('createCatalogs', () => {
  it('returns the correct data', async () => {
    const data = await createCatalogs([
      'abf9f43b-1872-4c26-a2e6-1598fc57fbdd',
      10,
      'abf9f43b-1872-4c26-a2e6-1598fc57fbdd - test123',
    ]);
    expect(data.createCatalog).toEqual(sampleResponses.data.createCatalog);
  });
});

describe('createSubsidy', () => {
  it('returns the correct data', async () => {
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
    expect(data.createSubsidy).toEqual(sampleResponses.data.createSubsidy);
  });
});

describe('createPolicies', () => {
  it('returns the correct data', async () => {
    const { data } = await createPolicy({
      policy_type: 'PerLearnerSpendCreditAccessPolicy',
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
    expect(data.createPolicy).toEqual(sampleResponses.data.createPolicy);
  });
});
