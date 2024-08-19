import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import {
  getEnterpriseOffers,
  getCouponOrders,
  getCustomerSubscriptions,
  getSubsidyAccessPolicies,
  getEnterpriseCustomer,
  formatDate,
} from './utils';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

const TEST_ENTERPRISE_UUID = 'test-uuid';

describe('getEnterpriseOffers', () => {
  it('returns the correct data', async () => {
    const offersResults = {
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [{
          isCurrent: true,
          uuid: 'uuid',
        }],
      },
    };
    getAuthenticatedHttpClient.mockImplementation(() => ({
      get: jest.fn().mockResolvedValue(offersResults),
    }));
    const results = await getEnterpriseOffers(TEST_ENTERPRISE_UUID);
    expect(results).toEqual(offersResults.data);
  });
});

describe('getSubsidyAccessPolicies', () => {
  it('returns the correct data', async () => {
    const policiesResults = {
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [{
          displayName: null,
          description: 'testing policy 2',
          active: true,
        }],
      },
    };
    getAuthenticatedHttpClient.mockImplementation(() => ({
      get: jest.fn().mockResolvedValue(policiesResults),
    }));
    const results = await getSubsidyAccessPolicies(TEST_ENTERPRISE_UUID);
    expect(results).toEqual(policiesResults.data);
  });
});

describe('getCouponOrders', () => {
  it('returns the correct data', async () => {
    const couponsResults = {
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [{
          id: 1,
          title: 'Enterprise Coupon',
          startDate: '2022-03-16T00:00:00Z',
          endDate: '2022-03-31T00:00:00Z',
          available: false,
        }],
      },
    };
    getAuthenticatedHttpClient.mockImplementation(() => ({
      get: jest.fn().mockResolvedValue(couponsResults),
    }));
    const results = await getCouponOrders(TEST_ENTERPRISE_UUID);
    expect(results).toEqual(couponsResults.data);
  });
});

describe('getCustomerSubscriptions', () => {
  it('returns the correct data', async () => {
    const agreementsResults = {
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [{
          isActive: true,
        }],
      },
    };
    getAuthenticatedHttpClient.mockImplementation(() => ({
      get: jest.fn().mockResolvedValue(agreementsResults),
    }));
    const results = await getCustomerSubscriptions(TEST_ENTERPRISE_UUID);
    expect(results).toEqual(agreementsResults.data);
  });
});

describe('getEnterpriseCustomer', () => {
  it('returns the correct data', async () => {
    const enterpriseCustomer = {
      data: [{
        uuid: '0b466242-75ff-4c27-8237-680dac3737f7',
        name: 'customer-6',
        slug: 'customer-6',
        active: true,
      }],
    };
    getAuthenticatedHttpClient.mockImplementation(() => ({
      get: jest.fn().mockResolvedValue(enterpriseCustomer),
    }));
    const results = await getEnterpriseCustomer(TEST_ENTERPRISE_UUID);
    expect(results).toEqual(enterpriseCustomer.data);
  });
});

describe('formatDate', () => {
  it('returns the formatted date', async () => {
    const date = '2024-07-23T20:02:57.651943Z';
    const formattedDate = formatDate(date);
    const expectedFormattedDate = 'July 23, 2024';
    expect(expectedFormattedDate).toEqual(formattedDate);
  });
});
