import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import {
  getEnterpriseOffers,
  getCouponOrders,
  getCustomerSubscriptions,
  getSubsidies,
  getEnterpriseCustomer,
  formatDate,
} from './utils';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  ...jest.requireActual('@edx/frontend-platform/logging'),
  logError: jest.fn(),
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

describe('getSubsidies', () => {
  it('returns the correct data', async () => {
    const subsidiesResults = {
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [{
          title: 'testing subsidy 2',
          isActive: true,
          uuid: 'test-uuid',
          activeDatetime: '2022-03-16T00:00:00Z',
          expirationDatetime: '2022-03-31T00:00:00Z',
          created: '',
        }],
      },
    };
    getAuthenticatedHttpClient.mockImplementation(() => ({
      get: jest.fn().mockResolvedValue(subsidiesResults),
    }));
    const results = await getSubsidies(TEST_ENTERPRISE_UUID);
    expect(results).toEqual(subsidiesResults.data.results);
  });

  it('returns error', async () => {
    getAuthenticatedHttpClient.mockImplementation(() => ({
      get: jest.fn(() => Promise.reject(new Error('Error fetching data'))),
    }));
    const results = await getSubsidies(TEST_ENTERPRISE_UUID);
    expect(results).toEqual([]);
    expect(logError).toHaveBeenCalled();
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
    const expectedFormattedDate = 'Jul 23, 2024';
    expect(expectedFormattedDate).toEqual(formattedDate);
  });
});
