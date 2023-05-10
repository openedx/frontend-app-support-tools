import { camelCaseObject } from '@edx/frontend-platform';
import {
  createCatalogs,
  lmsCustomerCatalog,
  selectProvisioningContext,
  sortedCatalogQueries,
  hasValidPolicyAndSubidy,
  getCamelCasedConfigAttribute,
  extractDefinedCatalogTitle,
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

const sampleCreateCatalogResponse = {
  data:
      {
        uuid: 'abf9f43b-1872-4c26-a2e6-1598fc57fbdd',
        title: 'test123',
        enterprise_customer: 'c6aaf182-bcae-4d14-84cd-d538b7ec08f0',
        enterprise_catalog_query: 10,
      },
};
jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: () => ({
    post: () => Promise.resolve(sampleCreateCatalogResponse),
  }),
}));
describe('createCatalogs', () => {
  it('returns the correct data', async () => {
    const data = await createCatalogs([
      'abf9f43b-1872-4c26-a2e6-1598fc57fbdd',
      10,
      'abf9f43b-1872-4c26-a2e6-1598fc57fbdd - test123',
    ]);
    expect(data).toEqual(sampleCreateCatalogResponse.data);
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
    expect(extractDefinedCatalogTitle({ catalogQueryTitle: 'The Bestests account' })).toEqual('The Bestests');
  });
  it('returns null if policy does not container ` account`', () => {
    expect(extractDefinedCatalogTitle({ catalogQueryTitle: 'The Bestests' })).toEqual(null);
  });
  it('returns null if no policy is passed', () => {
    expect(extractDefinedCatalogTitle({})).toEqual(null);
  });
});
