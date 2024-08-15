/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

import EnterpriseAccessApiService from '../EnterpriseAccessApiService';

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

  test('fetchSubsidyAccessPolicies calls the API to fetch subsides by enterprise customer UUID', () => {
    const mockCustomerUUID = 'test-customer-uuid';
    const expectedUrl = `${getConfig().ENTERPRISE_ACCESS_BASE_URL}/api/v1/subsidy-access-policies/?enterprise_customer_uuid=${mockCustomerUUID}`;
    EnterpriseAccessApiService.fetchSubsidyAccessPolicies(mockCustomerUUID);
    expect(axios.get).toBeCalledWith(expectedUrl);
  });
});
