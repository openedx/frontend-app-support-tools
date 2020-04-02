import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

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
  } catch (error) {
    // We don't have good error handling in the app for any errors that may have come back
    // from the API, so we log them to the console and tell the user to go look.  We would
    // never do this in a customer-facing app.
    console.log(JSON.parse(error.customAttributes.httpErrorResponseData));
    if (error.customAttributes.httpErrorStatus === 404) {
      error.userError = {
        code: null,
        dismissible: true,
        text: `We couldn't find a user with the username "${username}".`,
        type: 'error',
        topic: 'general',
      };
      throw error;
    }

    error.userError = {
      code: null,
      dismissible: true,
      text: 'There was an error loading this user\'s data. Check the JavaScript console for detailed errors.',
      type: 'danger',
      topic: 'general',
    };
    throw error;
  }
}

export async function getUserByEmail(userEmail) {
  try {
    const { data } = await getAuthenticatedHttpClient()
      .get(
        `${getConfig().LMS_BASE_URL}/api/user/v1/accounts?email=${userEmail}`,
      );
    return data;
  } catch (error) {
    // We don't have good error handling in the app for any errors that may have come back
    // from the API, so we log them to the console and tell the user to go look.  We would
    // never do this in a customer-facing app.
    console.log(JSON.parse(error.customAttributes.httpErrorResponseData));
    if (error.customAttributes.httpErrorStatus === 404) {
      error.userError = {
        code: null,
        dismissible: true,
        text: `We couldn't find a user with the email "${userEmail}".`,
        type: 'error',
        topic: 'general',
      };
      throw error;
    }

    error.userError = {
      code: null,
      dismissible: true,
      text: 'There was an error loading this user\'s data. Check the JavaScript console for detailed errors.',
      type: 'danger',
      topic: 'general',
    };
    throw error;
  }
}

export async function getUserVerificationStatus(username) {
  try {
    const { data } = await getAuthenticatedHttpClient().get(
        `${getConfig().LMS_BASE_URL}/api/user/v1/accounts/${username}/verification_status/`,
      );
      return data;
  } catch (error) {
    // We don't have good error handling in the app for any errors that may have come back
    // from the API, so we log them to the console and tell the user to go look.  We would
    // never do this in a customer-facing app.
    console.log(JSON.parse(error.customAttributes.httpErrorResponseData));
    if (error.customAttributes.httpErrorStatus === 404) {
      return {
        status: 'Not Available',
        expirationDatetime: '',
        isVerified: false,
      }
    }
  }
}

export async function getAllUserData(username) {
  const errors = [];
  let user = null;
  let entitlements = [];
  let enrollments = [];
  let verificationStatus = null;

  try {
    user = await getUser(username);
  } catch (error) {
    errors.push(error.userError);
  }
  if (user !== null) {
    entitlements = await getEntitlements(username);
    enrollments = await getEnrollments(username);
    verificationStatus = await getUserVerificationStatus(username);
  }

  return {
    errors,
    user,
    entitlements,
    enrollments,
    verificationStatus,
  };
}

export async function getAllUserDataByEmail(userEmail) {
  const errors = [];
  let user = null;
  let entitlements = [];
  let enrollments = [];
  let verificationStatus = null;

  try {
    const users = await getUserByEmail(userEmail);
    // The response should be an array of users - if it has an element, use it.
    user = Array.isArray(users) && users.length > 0 ? users[0] : null;
  } catch (error) {
    errors.push(error.userError);
  }
  if (user !== null) {
    entitlements = await getEntitlements(user.username);
    enrollments = await getEnrollments(user.username);
    verificationStatus = await getUserVerificationStatus(user.username);
  }

  return {
    errors,
    user,
    entitlements,
    enrollments,
    verificationStatus
  };
}

export async function patchEntitlement({
  uuid, action, unenrolledRun = null, comments = null,
}) {
  try {
    const { data } = await getAuthenticatedHttpClient().patch(
      `${getConfig().LMS_BASE_URL}/api/entitlements/v1/entitlements/${uuid}/`,
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
      // We don't have good error handling in the app for any errors that may have come back
      // from the API, so we log them to the console and tell the user to go look.  We would
      // never do this in a customer-facing app.
      console.log(JSON.parse(error.customAttributes.httpErrorResponseData));
    }
    return {
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'There was an error submitting this entitlement. Check the JavaScript console for detailed errors.',
          type: 'danger',
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
      // We don't have good error handling in the app for any errors that may have come back
      // from the API, so we log them to the console and tell the user to go look.  We would
      // never do this in a customer-facing app.
      console.log(JSON.parse(error.customAttributes.httpErrorResponseData));
    }
    return {
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'There was an error submitting this entitlement. Check the JavaScript console for detailed errors.',
          type: 'danger',
          topic: 'entitlements',
        },
      ],
    };
  }
}

export async function postEnrollmentChange({
  user, courseID, newMode, oldMode, reason,
}) {
  try {
    const { data } = await getAuthenticatedHttpClient().post(
      `${getConfig().LMS_BASE_URL}/support/enrollment/${user}`,
      {
        course_id: courseID,
        new_mode: newMode,
        old_mode: oldMode,
        reason,
      },
    );
    return data;
  } catch (error) {
    if (error.customAttributes.httpErrorStatus === 400) {
      // We don't have good error handling in the app for any errors that may have come back
      // from the API, so we log them to the console and tell the user to go look.  We would
      // never do this in a customer-facing app.
      console.log(JSON.parse(error.customAttributes.httpErrorResponseData));
    }
    return {
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'There was an error submitting this entitlement. Check the JavaScript console for detailed errors.',
          type: 'danger',
          topic: 'enrollments',
        },
      ],
    };
  }
}
