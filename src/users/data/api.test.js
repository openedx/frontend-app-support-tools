import MockAdapter from 'axios-mock-adapter';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

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

  describe('SSO', () => {
    const ssoRecordsApiUrl = `${getConfig().LMS_BASE_URL}/support/sso_records/${testUsername}`;

    it('No SSO data', async () => {
      mockAdapter.onGet(ssoRecordsApiUrl).reply(200, []);
      const response = await api.getSsoRecords(testUsername);
      expect(response).toEqual([]);
    });

    it('Valid SSO data', async () => {
      const expectedData = [{
        provider: 'edX',
        uid: 'uid',
        modified: null,
        extraData: '{}',
      }];
      mockAdapter.onGet(ssoRecordsApiUrl).reply(200, expectedData);
      const response = await api.getSsoRecords(testUsername);
      expect(response).toEqual(expectedData);
    });
  });
});
