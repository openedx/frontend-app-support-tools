import MockAdapter from 'axios-mock-adapter';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { fbeEnabledResponse } from './test/featureBasedEnrollment';
import * as api from './api';

describe('Feature Based Enrollment API', () => {
  let mockAdapter;

  const testCourseId = 'course-v1:testX+test123+2030';
  const fbeDetailsApiUrl = `${getConfig().LMS_BASE_URL}/support/feature_based_enrollment_details/${testCourseId}`;

  const throwError = (errorCode, dataString) => {
    const error = new Error();
    error.customAttributes = {
      httpErrorStatus: errorCode,
      httpErrorResponseData: JSON.stringify(dataString),
    };
    throw error;
  };

  beforeEach(() => {
    mockAdapter = new MockAdapter(getAuthenticatedHttpClient(), { onNoMatch: 'throwException' });
  });
  afterEach(() => {
    mockAdapter.reset();
  });

  it('Successful api fetch', async () => {
    mockAdapter.onGet(fbeDetailsApiUrl).reply(200, fbeEnabledResponse);

    const response = await api.default(testCourseId);
    expect(response).toEqual(fbeEnabledResponse);
  });

  it('Unsuccessful api fetch', async () => {
    const expectedErrors = [
      {
        code: null,
        dismissible: true,
        text: 'Unexpected error while fetching gating information for Course course-v1:testX+test123+2030',
        type: 'error',
        topic: 'featureBasedEnrollment',
      },
    ];

    mockAdapter.onGet(fbeDetailsApiUrl).reply(() => throwError(500, 'Server Error'));

    const response = await api.default(testCourseId);
    expect(response.errors).toEqual(expectedErrors);
  });
});
