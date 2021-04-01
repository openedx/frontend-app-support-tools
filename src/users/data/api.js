import { getConfig, ensureConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import * as messages from '../../user-messages/messages';
import { isEmail, isValidUsername } from '../../utils/index';

export async function getEntitlements(username, page = 1) {
  const baseURL = `${
    getConfig().LMS_BASE_URL
  }/api/entitlements/v1/entitlements/`;
  const queryString = `user=${username}&page=${page}`;
  const { data } = await getAuthenticatedHttpClient().get(
    `${baseURL}?${queryString}`,
  );
  if (data.next !== null) {
    const nextPageData = await getEntitlements(username, data.current_page + 1);
    data.results = data.results.concat(nextPageData.results);
    return data;
  }
  return data;
}

export async function getEnrollments(username) {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getConfig().LMS_BASE_URL}/support/enrollment/${username}`,
  );
  return data;
}

export async function getSsoRecords(username) {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getConfig().LMS_BASE_URL}/support/sso_records/${username}`,
  );
  let parsedData = [];
  if (data.length > 0) {
    parsedData = data.map((entry) => ({
      ...entry,
      extraData: JSON.parse(entry.extraData),
    }));
  }
  return parsedData;
}

export async function getUser(userIdentifier) {
  let url = `${getConfig().LMS_BASE_URL}/api/user/v1/accounts`;
  const identifierIsEmail = isEmail(userIdentifier);
  const identifierIsUsername = isValidUsername(userIdentifier);

  // todo: we have already validated the input to fall into one of these cases.
  // The following `if` is not required.
  if (!(identifierIsEmail || identifierIsUsername)) {
    throw new Error('Invalid Argument!');
  }
  url = identifierIsEmail
    ? (url += `?email=${userIdentifier}`)
    : (url += `/${userIdentifier}`);

  try {
    const { data } = await getAuthenticatedHttpClient().get(url);
    return Array.isArray(data) && data.length > 0 ? data[0] : data;
  } catch (error) {
    // We don't have good error handling in the app for any errors that may have come back
    // from the API, so we log them to the console and tell the user to go look.  We would
    // never do this in a customer-facing app.
    // eslint-disable-next-line no-console
    console.log(JSON.parse(error.customAttributes.httpErrorResponseData));
    const notFoundErrorText = (identifierIsEmail
      ? messages.USER_EMAIL_IDENTIFIER_NOT_FOUND_ERROR
      : messages.USERNAME_IDENTIFIER_NOT_FOUND_ERROR
    ).replace('{identifier}', userIdentifier);

    if (error.customAttributes.httpErrorStatus === 404) {
      error.userError = {
        code: null,
        dismissible: true,
        text: notFoundErrorText,
        type: 'error',
        topic: 'general',
      };
      throw error;
    }

    error.userError = {
      code: null,
      dismissible: true,
      text: messages.UNKNOWN_API_ERROR,
      type: 'danger',
      topic: 'general',
    };
    throw error;
  }
}

export async function getUserVerificationDetail(username) {
  const defaultResponse = {
    sso_verification: [],
    ss_photo_verification: [],
    manual_verification: [],
  };
  try {
    const { data } = await getAuthenticatedHttpClient().get(
      `${
        getConfig().LMS_BASE_URL
      }/api/user/v1/accounts/${username}/verifications/`,
    );
    return data;
  } catch (error) {
    // We don't have good error handling in the app for any errors that may have come back
    // from the API, so we log them to the console and tell the user to go look.  We would
    // never do this in a customer-facing app.
    // eslint-disable-next-line no-console
    console.log(JSON.parse(error.customAttributes.httpErrorResponseData));
    if (error.customAttributes.httpErrorStatus === 404) {
      return defaultResponse;
    }
    return defaultResponse;
  }
}

export async function getUserVerificationStatus(username) {
  try {
    const { data } = await getAuthenticatedHttpClient().get(
      `${
        getConfig().LMS_BASE_URL
      }/api/user/v1/accounts/${username}/verification_status/`,
    );
    const extraData = await getUserVerificationDetail(username);
    data.extraData = extraData;
    return data;
  } catch (error) {
    // We don't have good error handling in the app for any errors that may have come back
    // from the API, so we log them to the console and tell the user to go look.  We would
    // never do this in a customer-facing app.
    // eslint-disable-next-line no-console
    console.log(JSON.parse(error.customAttributes.httpErrorResponseData));
    if (error.customAttributes.httpErrorStatus === 404) {
      return {
        status: 'Not Available',
        expirationDatetime: '',
        isVerified: false,
        extraData: null,
      };
    }
    return {
      status: 'Error, status unknown',
      expirationDatetime: '',
      isVerified: false,
      extraData: null,
    };
  }
}

export async function getUserPasswordStatus(userIdentifier) {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getConfig().LMS_BASE_URL}/support/manage_user/${userIdentifier}`,
  );
  return data;
}

ensureConfig([
  'LICENSE_MANAGER_URL',
], 'getLicense');

export async function getLicense(userEmail) {
  const defaultResponse = {
    status: '',
    results: [],
  };
  try {
    const { data } = await getAuthenticatedHttpClient().post(
      `${getConfig().LICENSE_MANAGER_URL}/api/v1/staff_lookup_licenses/`,
      { user_email: userEmail },
    );
    defaultResponse.results = data;
    return defaultResponse;
  } catch (error) {
    let errorStatus = -1;

    if ('customAttributes' in error) {
      errorStatus = error.customAttributes.httpErrorStatus;
    }

    if (errorStatus === 404) {
      defaultResponse.status = 'No record found';
    } else if (errorStatus === 400) {
      defaultResponse.status = 'User email is not provided';
    } else if (errorStatus === 403) {
      defaultResponse.status = 'Forbidden: User does not have permission to view this data';
    } else if (errorStatus === 401) {
      defaultResponse.status = 'Unauthenticated: Could not autheticate user to view this data';
    } else {
      defaultResponse.status = 'Unable to connect to the service';
    }
    return defaultResponse;
  }
}

export async function getAllUserData(userIdentifier) {
  const errors = [];
  let user = null;
  let entitlements = [];
  let enrollments = [];
  let verificationStatus = null;
  let ssoRecords = null;
  let licenses = [];
  try {
    user = await getUser(userIdentifier);
  } catch (error) {
    if (error.userError) {
      errors.push(error.userError);
    } else {
      throw error;
    }
  }
  if (user !== null) {
    entitlements = await getEntitlements(user.username);
    enrollments = await getEnrollments(user.username);
    verificationStatus = await getUserVerificationStatus(user.username);
    ssoRecords = await getSsoRecords(user.username);
    user.passwordStatus = await getUserPasswordStatus(user.username);
    licenses = await getLicense(user.email);
  }

  return {
    errors,
    user,
    entitlements,
    enrollments,
    verificationStatus,
    ssoRecords,
    licenses,
  };
}

export async function getCourseData(courseUUID) {
  try {
    const { data } = await getAuthenticatedHttpClient().get(
      `${getConfig().DISCOVERY_API_BASE_URL}/api/v1/courses/${courseUUID}/`,
    );
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(JSON.parse(error.customAttributes.httpErrorResponseData));
    if (error.customAttributes.httpErrorStatus === 404) {
      const courseError404 = {
        code: null,
        dismissible: true,
        text: `We couldn't find summary data for this Course "${courseUUID}".`,
        type: 'error',
        topic: 'course-summary',
      };
      return { errors: [courseError404] };
    }
    const courseError = {
      code: null,
      dismissible: true,
      text: `Error finding summary data for this Course "${courseUUID}".`,
      type: 'danger',
      topic: 'course-summary',
    };
    return { errors: [courseError] };
  }
}

export async function patchEntitlement({
  uuid, requestData,
}) {
  try {
    const { data } = await getAuthenticatedHttpClient().patch(
      `${getConfig().LMS_BASE_URL}/api/entitlements/v1/entitlements/${uuid}/`, requestData,
    );
    return data;
  } catch (error) {
    if (error.customAttributes.httpErrorStatus === 400) {
      // We don't have good error handling in the app for any errors that may have come back
      // from the API, so we log them to the console and tell the user to go look.  We would
      // never do this in a customer-facing app.
      // eslint-disable-next-line no-console
      console.log(JSON.parse(error.customAttributes.httpErrorResponseData));
    }
    return {
      errors: [
        {
          code: null,
          dismissible: true,
          text:
            'There was an error submitting this entitlement. Check the JavaScript console for detailed errors.',
          type: 'danger',
          topic: 'entitlements',
        },
      ],
    };
  }
}

export async function postEntitlement({
  requestData,
}) {
  try {
    const { data } = await getAuthenticatedHttpClient().post(
      `${getConfig().LMS_BASE_URL}/api/entitlements/v1/entitlements/`, requestData,
    );
    return data;
  } catch (error) {
    if (error.customAttributes.httpErrorStatus === 400) {
      // We don't have good error handling in the app for any errors that may have come back
      // from the API, so we log them to the console and tell the user to go look.  We would
      // never do this in a customer-facing app.
      // eslint-disable-next-line no-console
      console.log(JSON.parse(error.customAttributes.httpErrorResponseData));
    }
    return {
      errors: [
        {
          code: null,
          dismissible: true,
          text:
            'There was an error submitting this entitlement. Check the JavaScript console for detailed errors.',
          type: 'danger',
          topic: 'entitlements',
        },
      ],
    };
  }
}

export async function postEnrollmentChange({
  user,
  courseID,
  newMode,
  oldMode,
  reason,
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
      // eslint-disable-next-line no-console
      console.log(JSON.parse(error.customAttributes.httpErrorResponseData));
    }
    return {
      errors: [
        {
          code: null,
          dismissible: true,
          text:
            'There was an error submitting this enrollment. Check the JavaScript console for detailed errors.',
          type: 'danger',
          topic: 'enrollments',
        },
      ],
    };
  }
}

export async function postTogglePasswordStatus(user, comment) {
  const { data } = await getAuthenticatedHttpClient().post(
    `${getConfig().LMS_BASE_URL}/support/manage_user/${user}`,
    {
      comment,
    },
  );
  return data;
}

export async function postResetPassword(email) {
  const { data } = await getAuthenticatedHttpClient().post(
    `${getConfig().LMS_BASE_URL}/account/password`,
    {
      email,
    },
  );
  return data;
}
