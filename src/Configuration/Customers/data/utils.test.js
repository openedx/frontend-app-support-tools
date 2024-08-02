import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import {
  getEnterpriseOffers,
  getCouponOrders,
  getCustomerAgreements,
  getSubsidyAccessPolicies,
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

describe('getCustomerAgreements', () => {
  it('returns the correct data', async () => {
    const agreementsResults = {
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [{
          subscriptions: {
            isActive: true,
          },
        }],
      },
    };
    getAuthenticatedHttpClient.mockImplementation(() => ({
      get: jest.fn().mockResolvedValue(agreementsResults),
    }));
    const results = await getCustomerAgreements(TEST_ENTERPRISE_UUID);
    expect(results).toEqual(agreementsResults.data);
  });
});
