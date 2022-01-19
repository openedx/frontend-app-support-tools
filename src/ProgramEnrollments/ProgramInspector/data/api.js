import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

const { LMS_BASE_URL } = getConfig();

export async function getProgramEnrollmentsInspector({ params }) {
  const apiUrl = `${LMS_BASE_URL}/support/program_enrollments_inspector_details${params}`;
  try {
    const { data } = await getAuthenticatedHttpClient().get(apiUrl);
    return data;
  } catch (error) {
    return {
      error: [
        {
          code: null,
          dismissible: true,
          text: 'Unexpected error while fetching Program Inspector Data',
          type: 'error',
          topic: 'programInspectorData',
        },
      ],
    };
  }
}

export async function getSAMLProviderList() {
  const apiUrl = `${LMS_BASE_URL}/support/get_saml_providers/`;
  try {
    const { data } = await getAuthenticatedHttpClient().get(apiUrl);
    return data;
  } catch (error) {
    return {
      error: [
        {
          code: null,
          dismissible: true,
          text: 'Unexpected error while fetching SAML Providers',
          type: 'error',
          topic: 'programInspectorSAMLProviders',
        },
      ],
    };
  }
}
