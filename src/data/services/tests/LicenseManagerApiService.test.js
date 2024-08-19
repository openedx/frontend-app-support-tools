/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

import LicenseManagerApiService from '../LicenseManagerApiService';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

const axiosMock = new MockAdapter(axios);
getAuthenticatedHttpClient.mockReturnValue(axios);

axiosMock.onAny().reply(200);
axios.get = jest.fn();

describe('LicenseManagerApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetchCustomerSubscriptions calls the API to fetch subscriptions by enterprise customer UUID', () => {
    const mockCustomerUUID = 'test-customer-uuid';
    const expectedUrl = `${getConfig().LICENSE_MANAGER_URL}/api/v1/customer-agreement/?enterprise_customer_uuid=${mockCustomerUUID}`;
    LicenseManagerApiService.fetchCustomerSubscriptions(mockCustomerUUID);
    expect(axios.get).toBeCalledWith(expectedUrl);
  });
});
