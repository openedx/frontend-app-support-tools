import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

// eslint-disable-next-line import/prefer-default-export
export async function getEntitlements(username) {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getConfig().LMS_BASE_URL}/api/entitlements/v1/entitlements/?user=${username}`,
  );
  return data;
}
