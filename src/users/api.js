import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';


// eslint-disable-next-line import/prefer-default-export
export async function getEntitlements(username) {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getConfig().LMS_BASE_URL}/api/entitlements/v1/entitlements/?user=${username}`,
  );
  return data;
}

export async function getEnrollments(username) {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getConfig().LMS_BASE_URL}/support/enrollment/${username}`,
  );
  return data;
}

export async function getUser(username) {
  try {
    const { data } = await getAuthenticatedHttpClient()
      .get(
        `${getConfig().LMS_BASE_URL}/api/user/v1/accounts/${username}`,
      );
    return data;
  } catch (e) {
    return null;
  }
}

export async function getAllUserData(username) {
  const user = await getUser(username);
  const entitlements = await getEntitlements(username);
  const enrollments = await getEnrollments(username);

  return {
    user,
    entitlements,
    enrollments,
  };
}
