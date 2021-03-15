import MockAdapter from 'axios-mock-adapter';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import enrollmentsData from './test/enrollments';
import * as api from './api';

describe('API', () => {
  const testUsername = 'username';
  const testEmail = 'email@example.com';
  const ssoRecordsApiUrl = `${getConfig().LMS_BASE_URL}/support/sso_records/${testUsername}`;
  const enrollmentsApiUrl = `${getConfig().LMS_BASE_URL}/support/enrollment/${testUsername}`;
  const entitlementsApiBaseUrl = `${getConfig().LMS_BASE_URL}/api/entitlements/v1/entitlements/?user=${testUsername}`;
  const passwordStatusApiUrl = `${getConfig().LMS_BASE_URL}/support/manage_user/${testUsername}`;
  const verificationDetailsApiUrl = `${getConfig().LMS_BASE_URL}/api/user/v1/accounts/${testUsername}/verifications/`;
  const verificationStatusApiUrl = `${getConfig().LMS_BASE_URL}/api/user/v1/accounts/${testUsername}/verification_status/`;

  let mockAdapter;

  const throwError = (errorCode, dataString) => {
    const error = new Error();
    error.customAttributes = {
      httpErrorStatus: errorCode,
      httpErrorResponseData: JSON.stringify(dataString),
    };
    throw error;
  };

  beforeEach(() => {
    mockAdapter = new MockAdapter(getAuthenticatedHttpClient());
  });

  afterEach(() => {
    mockAdapter.reset();
  });

  describe('SSO Records Fetch', () => {
    it('No SSO data is Returned', async () => {
      mockAdapter.onGet(ssoRecordsApiUrl).reply(200, []);
      const response = await api.getSsoRecords(testUsername);
      expect(response).toEqual([]);
    });

    it('Valid SSO data is Returned', async () => {
      const apiResponseData = [
        {
          provider: 'edX',
          uid: 'uid',
          modified: null,
          extraData: '{}',
        },
        {
          provider: 'Google',
          uid: 'gid',
          modified: null,
          extraData: '{"auth": "sso"}',
        }];
      const expectedData = apiResponseData.map(item => ({
        ...item,
        extraData: JSON.parse(item.extraData),
      }));
      mockAdapter.onGet(ssoRecordsApiUrl).reply(200, apiResponseData);
      const response = await api.getSsoRecords(testUsername);
      expect(response).toEqual(expectedData);
    });
  });

  describe('Enrollments Fetch', () => {
    it('Enrollments Response', async () => {
      mockAdapter.onGet(enrollmentsApiUrl).reply(200, enrollmentsData);
      const expectedData = { ...enrollmentsData };
      delete expectedData.changeHandler;

      const response = await api.getEnrollments(testUsername);
      expect(response).toEqual(expectedData);
    });
  });

  describe('User Password Status Fetch', () => {
    it('Password Status Data', async () => {
      const expectedData = {
        username: testUsername,
        date_joined: Date().toLocaleString(),
        is_active: true,
        status: 'Usable',
        password_toggle_history: [],
        email: testEmail,
      };
      mockAdapter.onGet(passwordStatusApiUrl).reply(200, expectedData);

      const response = await api.getUserPasswordStatus(testUsername);
      expect(response).toEqual(expectedData);
    });
  });

  describe('User Verification Details Fetch', () => {
    const defaultResponse = {
      sso_verification: [],
      ss_photo_verification: [],
      manual_verification: [],
    };

    it('default response is returned if error is raised', async () => {
      mockAdapter.onGet(verificationDetailsApiUrl).reply(() => throwError(500, ''));
      const response = await api.getUserVerificationDetail(testUsername);
      expect(response).toEqual(defaultResponse);
    });

    it('default response is returned if 404 is raised', async () => {
      mockAdapter.onGet(verificationDetailsApiUrl).reply(() => throwError(404, ''));
      const response = await api.getUserVerificationDetail(testUsername);
      expect(response).toEqual(defaultResponse);
    });

    it('Successfully fetched data is returned', async () => {
      const expectedData = [
        {
          type: 'Manual',
          status: 'Approved',
          expiration_datetime: Date().toLocaleString(),
          updated_at: Date().toLocaleString(),
          message: '',
          receipt_id: 'receipt_id',
        },
      ];
      mockAdapter.onGet(verificationDetailsApiUrl).reply(200, expectedData);
      const response = await api.getUserVerificationDetail(testUsername);
      expect(response).toEqual(expectedData);
    });
  });

  describe('User Verification Status Fetch', () => {
    const defaultResponseTemplate = {
      status: 'Not Available',
      expirationDatetime: '',
      isVerified: false,
      extraData: null,
    };

    it('404 error response', async () => {
      mockAdapter.onGet(verificationStatusApiUrl).reply(() => throwError(404, ''));
      const expectedData = { ...defaultResponseTemplate };
      const response = await api.getUserVerificationStatus(testUsername);
      expect(response).toEqual(expectedData);
    });

    it('default error response', async () => {
      mockAdapter.onGet(verificationStatusApiUrl).reply(() => throwError(500, ''));
      const expectedData = { ...defaultResponseTemplate, status: 'Error, status unknown' };
      const response = await api.getUserVerificationStatus(testUsername);
      expect(response).toEqual(expectedData);
    });

    it('Successful Status Fetch', async () => {
      const apiResponseData = {
        status: 'approved',
        is_verified: false,
        expiration_datetime: Date().toLocaleString(),
      };
      const expectedData = { ...apiResponseData, extraData: {} };
      mockAdapter.onGet(verificationDetailsApiUrl).reply(200, {});
      mockAdapter.onGet(verificationStatusApiUrl).reply(200, apiResponseData);

      const response = await api.getUserVerificationStatus(testUsername);
      expect(response).toEqual(expectedData);
    });
  });

  describe('Entitlements Fetch', () => {
    const defaultResult = {
      course_uuid: 'test_uuid',
      created: Date.toLocaleString(),
      expired_at: null,
      mode: 'no-id-professional',
      modified: Date.toLocaleString(),
      order_number: null,
      refund_locked: true,
      support_details: [],
      user: testUsername,
      uuid: 'uuid',
    };
    it('Single page result', async () => {
      const expectedData = {
        count: 1,
        current_page: 1,
        next: null,
        results: [
          defaultResult,
        ],
      };
      mockAdapter.onGet(`${entitlementsApiBaseUrl}&page=1`).reply(200, expectedData);

      const response = await api.getEntitlements(testUsername);
      expect(response).toEqual(expectedData);
    });

    it('Multi page result', async () => {
      const firstPageResult = {
        count: 2,
        current_page: 1,
        next: 2,
        results: [
          defaultResult,
        ],
      };
      const secondPageResult = {
        count: 2,
        current_page: 2,
        next: null,
        results: [
          defaultResult,
        ],
      };

      const expectedData = {
        count: 2,
        current_page: 1,
        next: 2,
        results: [
          defaultResult,
          defaultResult,
        ],
      };
      mockAdapter.onGet(`${entitlementsApiBaseUrl}&page=1`).reply(200, firstPageResult);
      mockAdapter.onGet(`${entitlementsApiBaseUrl}&page=2`).reply(200, secondPageResult);

      const response = await api.getEntitlements(testUsername);
      expect(response).toEqual(expectedData);
    });
  });
});
