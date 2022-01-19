import MockAdapter from 'axios-mock-adapter';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { programInspectorSuccessResponse } from './test/programInspector';
import * as api from './api';
import samlProvidersResponseValues from './test/samlProviders';

describe('Program Inspector API', () => {
  let mockAdapter;

  const params = {
    org_key: 'testX',
    external_user_key: 'testuser',
    edx_user: 'verified',
  };

  const programInspectorApiUrl = `${getConfig().LMS_BASE_URL
  }/support/program_enrollments_inspector_details?`
    + `edx_user=${params.edx_user}&org_key=${params.org_key}&external_user_key=${params.external_user_key}`;

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
    mockAdapter
      .onGet(programInspectorApiUrl)
      .reply(200, programInspectorSuccessResponse);

    const response = await api.getProgramEnrollmentsInspector({
      params: `?edx_user=${params.edx_user}&org_key=${params.org_key}&external_user_key=${params.external_user_key}`,
    });
    expect(response).toEqual(programInspectorSuccessResponse);
  });

  it('Unsuccessful api fetch', async () => {
    const expectedErrors = [
      {
        code: null,
        dismissible: true,
        text: 'Unexpected error while fetching Program Inspector Data',
        type: 'error',
        topic: 'programInspectorData',
      },
    ];

    mockAdapter
      .onGet(programInspectorApiUrl)
      .reply(() => throwError(500, 'Server Error'));

    const response = await api.getProgramEnrollmentsInspector({
      params: `?edx_user=${params.edx_user}&org_key=${params.org_key}&external_user_key=${params.external_user_key}`,
    });
    expect(response.error).toEqual(expectedErrors);
  });
});

describe('Get SAML Providers API', () => {
  let mockAdapter;

  const samlProvidersApiUrl = `${getConfig().LMS_BASE_URL
  }/support/get_saml_providers/`;

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
    mockAdapter
      .onGet(samlProvidersApiUrl)
      .reply(200, samlProvidersResponseValues);

    const response = await api.getSAMLProviderList();
    expect(response).toEqual(samlProvidersResponseValues);
  });

  it('Unsuccessful api fetch', async () => {
    const expectedErrors = [
      {
        code: null,
        dismissible: true,
        text: 'Unexpected error while fetching SAML Providers',
        type: 'error',
        topic: 'programInspectorSAMLProviders',
      },
    ];

    mockAdapter
      .onGet(samlProvidersApiUrl)
      .reply(() => throwError(500, 'Server Error'));

    const response = await api.getSAMLProviderList();
    expect(response.error).toEqual(expectedErrors);
  });
});
