/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

import EcommerceApiService from '../EcommerceApiService';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

const axiosMock = new MockAdapter(axios);
getAuthenticatedHttpClient.mockReturnValue(axios);

axiosMock.onAny().reply(200);
axios.get = jest.fn();

describe('EnterpriseAccessApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetchCouponOrders calls the API to fetch coupons by enterprise customer UUID', () => {
    const mockCustomerUUID = 'test-customer-uuid';
    const expectedUrl = `${getConfig().ECOMMERCE_BASE_URL}/api/v2/enterprise/coupons/${mockCustomerUUID}/overview/?page=1&page_size=50`;
    EcommerceApiService.fetchCouponOrders(mockCustomerUUID);
    expect(axios.get).toBeCalledWith(expectedUrl);
  });

  test('fetchEnterpriseOffers calls the API to fetch coupons by enterprise customer UUID', () => {
    const mockCustomerUUID = 'test-customer-uuid';
    const expectedUrl = `${getConfig().ECOMMERCE_BASE_URL}/api/v2/enterprise/${mockCustomerUUID}/enterprise-admin-offers/`;
    EcommerceApiService.fetchEnterpriseOffers(mockCustomerUUID);
    expect(axios.get).toBeCalledWith(expectedUrl);
  });
});
