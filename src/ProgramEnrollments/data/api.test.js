import MockAdapter from 'axios-mock-adapter';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { lpeSuccessResponse } from './test/linkProgramEnrollment';
import * as api from './api';

describe('Link Program Enrollments API', () => {
  let mockAdapter;

  const data = {
    programID: '8bee627e-d85e-4a76-be41-d58921da666e',
    usernamePairText: 'testuser,verified',
  };
  const lpeDetailsApiUrl = `${
    getConfig().LMS_BASE_URL
  }/support/link_program_enrollments_details/`;

  const throwError = (errorCode, dataString) => {
    const error = new Error();
    error.customAttributes = {
      httpErrorStatus: errorCode,
      httpErrorResponseData: JSON.stringify(dataString),
    };
    throw error;
  };

  beforeEach(() => {
    mockAdapter = new MockAdapter(getAuthenticatedHttpClient(), {
      onNoMatch: 'throwException',
    });
  });

  afterEach(() => {
    mockAdapter.reset();
  });

  it('Successful api fetch', async () => {
    mockAdapter.onPost(lpeDetailsApiUrl).reply(200, lpeSuccessResponse);

    const response = await api.default(data);
    expect(response).toEqual(lpeSuccessResponse);
  });

  it('Unsuccessful api fetch', async () => {
    const expectedErrors = [
      {
        code: null,
        dismissible: true,
        text: 'Unexpected error while linking program enrollments for Program 8bee627e-d85e-4a76-be41-d58921da666e',
        type: 'error',
        topic: 'linkProgramEnrollment',
      },
    ];

    mockAdapter
      .onPost(lpeDetailsApiUrl)
      .reply(() => throwError(500, 'Server Error'));

    const response = await api.default(data);
    expect(response.error).toEqual(expectedErrors);
  });
});
