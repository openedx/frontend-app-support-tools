import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { getDataToUpdateForPutRequest, extractErrorsFromUpdateResponse } from '../utils';
import messages from '../messages';

const { LMS_BASE_URL } = getConfig();

export async function fetchUserRoleBasedCourses(userEmail, intl) {
  const queryParams = new URLSearchParams({
    email: userEmail,
  });
  const apiUrl = `${LMS_BASE_URL}/api/support/v1/manage_course_team/?${queryParams.toString()}`;
  try {
    const { data } = await getAuthenticatedHttpClient().get(apiUrl);
    return data;
  } catch (error) {
    return {
      error: [
        {
          code: null,
          dismissible: true,
          text: intl.formatMessage(messages.courseTeamGetApiError),
          type: 'danger',
          topic: 'courseTeamManagementApiErrors',
        },
      ],
      isGetAppError: true,
    };
  }
}

export async function updateUserRolesInCourses({
  userEmail,
  changedCourses,
  intl,
}) {
  const coursesToUpdate = getDataToUpdateForPutRequest(changedCourses);
  const apiUrl = `${LMS_BASE_URL}/api/support/v1/manage_course_team/`;
  try {
    const { data } = await getAuthenticatedHttpClient().put(apiUrl, {
      email: userEmail,
      bulk_role_operations: coursesToUpdate,
    });
    return extractErrorsFromUpdateResponse(changedCourses, data);
  } catch (error) {
    return {
      error: [
        {
          code: null,
          dismissible: true,
          text: intl.formatMessage(messages.courseTeamUpdateApiError),
          type: 'danger',
          topic: 'courseTeamManagementApiErrors',
        },
      ],
    };
  }
}
