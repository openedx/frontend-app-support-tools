import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

const { LMS_BASE_URL } = getConfig();

export default async function fetchUserRoleBasedCourses(userEmail) {
  const queryParams = new URLSearchParams({
    email: userEmail,
  });
  const apiUrl = `${LMS_BASE_URL}/api/support/v1/manage_course_team/?${queryParams.toString()}`;
  try {
    const { data } = await getAuthenticatedHttpClient().get(apiUrl);
    return data;
  } catch (error) {
    // TODO
  }
  return [];
}
