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
  // const { data } = await getAuthenticatedHttpClient().get(
  //   `${getConfig().LMS_BASE_URL}/api/entitlements/v1/entitlements/?user=${username}`,
  // );

  // I'm guessing it'll look similar to the entitlements response, but this is just a guess/can be changed.
  return {
    start: 0,
    results: [],
    currentPage: 1,
    numPages: 1,
    previous: null,
    count: 0,
    next: null,
  };
}

export async function getUser(username) {
  // const { data } = await getAuthenticatedHttpClient().get(
  //   `${getConfig().LMS_BASE_URL}/api/entitlements/v1/entitlements/?user=${username}`,
  // );
  return {
    username,
  };
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
