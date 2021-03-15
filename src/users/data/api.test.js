import MockAdapter from 'axios-mock-adapter';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import enrollmentsData from './test/enrollments';
import * as api from './api';

describe('API', () => {
  const testUsername = 'username';
  let mockAdapter;

  beforeEach(() => {
    mockAdapter = new MockAdapter(getAuthenticatedHttpClient());
  });

  afterEach(() => {
    mockAdapter.reset();
  });

  describe('SSO Records Fetch', () => {
    const ssoRecordsApiUrl = `${getConfig().LMS_BASE_URL}/support/sso_records/${testUsername}`;

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
      const enrollmentsApiUrl = `${getConfig().LMS_BASE_URL}/support/enrollment/${testUsername}`;
      mockAdapter.onGet(enrollmentsApiUrl).reply(200, enrollmentsData);
      const expectedData = { ...enrollmentsData };
      delete expectedData.changeHandler;

      const response = await api.getEnrollments(testUsername);
      expect(response).toEqual(expectedData);
    });
  });
});
