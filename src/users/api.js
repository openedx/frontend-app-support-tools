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

export async function patchEntitlement({
  uuid, action, unenrolledRun = null, comments = null,
}) {
  try {
    const { data } = await getAuthenticatedHttpClient().patch(
      `${getConfig().LMS_BASE_URL}/api/entitlements/v1/entitlements/${uuid}`,
      {
        expired_at: null,
        support_details: [{
          unenrolled_run: unenrolledRun,
          action,
          comments,
        }],
      },
    );
    return data;
  } catch (error) {
    if (error.customAttributes.httpErrorStatus === 400) {
      console.log(JSON.parse(error.customAttributes.httpErrorResponseData));
    }
    return {
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'There was an error submitting this entitlement.  Check the JavaScript console for detailed errors.',
          type: 'error',
          topic: 'entitlements',
        },
      ],
    };
  }
}

export async function postEntitlement({
  user, courseUuid, mode, action, comments = null,
}) {
  try {
    const { data } = await getAuthenticatedHttpClient().post(
      `${getConfig().LMS_BASE_URL}/api/entitlements/v1/entitlements/`,
      {
        course_uuid: courseUuid,
        user,
        mode,
        refund_locked: true,
        support_details: [{
          action,
          comments,
        }],
      },
    );
    return data;
  } catch (error) {
    if (error.customAttributes.httpErrorStatus === 400) {
      console.log(JSON.parse(error.customAttributes.httpErrorResponseData));
    }
    return {
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'There was an error submitting this entitlement.  Check the JavaScript console for detailed errors.',
          type: 'danger',
          topic: 'entitlements',
        },
      ],
    };
  }
}
