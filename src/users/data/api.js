import { ensureConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import * as messages from '../../userMessages/messages';
import * as AppUrls from './urls';
import { isEmail, sortedCompareDates } from '../../utils';

export async function getEntitlements(username, page = 1) {
  try {
    const baseURL = AppUrls.getEntitlementUrl();
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
  } catch (error) {
    return {
      errors: [
        {
          code: null,
          dismissible: true,
          text: JSON.parse(error.customAttributes.httpErrorResponseData),
          type: 'danger',
          topic: 'entitlements',
        },
      ],
    };
  }
}

export async function getEnrollments(username) {
  try {
    const { data } = await getAuthenticatedHttpClient().get(
      AppUrls.getEnrollmentsUrl(username),
    );
    return data;
  } catch (error) {
    return {
      errors: [
        {
          code: null,
          dismissible: true,
          text: JSON.parse(error.customAttributes.httpErrorResponseData),
          type: 'danger',
          topic: 'enrollments',
        },
      ],
    };
  }
}

export async function getSsoRecords(username) {
  try {
    const { data } = await getAuthenticatedHttpClient().get(
      AppUrls.getSSORecordsUrl(username),
    );
    let parsedData = [];
    if (data.length > 0) {
      parsedData = data.map((entry) => {
        const extraData = JSON.parse(entry.extraData);

        Object.keys(extraData).forEach((key) => {
          extraData[key] = Array.isArray(extraData[key]) && extraData[key].length > 0
            ? extraData[key][0]
            : extraData[key];
        });

        return {
          ...entry,
          extraData,
        };
      });
    }
    return parsedData;
  } catch (error) {
    return {
      errors: [
        {
          code: null,
          dismissible: true,
          text: JSON.parse(error.customAttributes.httpErrorResponseData),
          type: 'danger',
          topic: 'ssoRecords',
        },
      ],
    };
  }
}

export async function getUser(userIdentifier) {
  const url = AppUrls.getUserAccountUrl(userIdentifier);

  try {
    const { data } = await getAuthenticatedHttpClient().get(url);
    return Array.isArray(data) && data.length > 0 ? data[0] : data;
  } catch (error) {
    // We don't have good error handling in the app for any errors that may have come back
    // from the API, so we log them to the console and tell the user to go look.  We would
    // never do this in a customer-facing app.
    // eslint-disable-next-line no-console
    console.log(JSON.parse(error.customAttributes.httpErrorResponseData));
    const notFoundErrorText = (isEmail(userIdentifier)
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
      AppUrls.getUserVerificationDetailUrl(username),
    );
    return data;
  } catch (error) {
    // We don't have good error handling in the app for any errors that may have come back
    // from the API, so we log them to the console and tell the user to go look.  We would
    // never do this in a customer-facing app.
    // eslint-disable-next-line no-console
    console.log(JSON.parse(error.customAttributes.httpErrorResponseData));
    return defaultResponse;
  }
}

export async function getUserVerificationStatus(username) {
  try {
    const { data } = await getAuthenticatedHttpClient().get(
      AppUrls.getUserVerificationStatusUrl(username),
    );
    const extraData = await getUserVerificationDetail(username);
    data.extraData = extraData;
    return data;
  } catch (error) {
    if (error.customAttributes.httpErrorStatus === 404) {
      return {
        errors: [
          {
            code: null,
            dismissible: true,
            text: 'Verification Status not found',
            type: 'danger',
            topic: 'idvStatus',
          },
        ],
      };
    }
    return {
      errors: [
        {
          code: null,
          dismissible: true,
          text: JSON.parse(error.customAttributes.httpErrorResponseData),
          type: 'danger',
          topic: 'idvStatus',
        },
      ],
    };
  }
}

export async function getUserPasswordStatus(userIdentifier) {
  const { data } = await getAuthenticatedHttpClient().get(
    AppUrls.getUserPasswordStatusUrl(userIdentifier),
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
      AppUrls.getLicenseManagerUrl(),
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

export async function getOnboardingStatus(enrollments, username) {
  const defaultResponse = {
    onboardingStatus: null,
    expirationDate: null,
    onboardingLink: null,
    onboardingPastDue: null,
    onboardingReleaseDate: null,
    reviewRequirementsUrl: null,
  };

  if (enrollments.errors) {
    return {
      ...defaultResponse,
      onboardingStatus: 'Error while fetching data',
    };
  }

  // get most recent paid active enrollment
  const paidEnrollments = enrollments.filter((enrollment) => enrollment.is_active && (enrollment.mode === 'verified' || enrollment.mode === 'professional'));

  // sort courses on enrollments created with most recent enrollment on top
  paidEnrollments.sort((x, y) => sortedCompareDates(x.created, y.created, false));

  if (paidEnrollments.length === 0) {
    return {
      ...defaultResponse,
      onboardingStatus: 'No Paid Enrollment',
    };
  }

  const courseId = paidEnrollments[0].course_id;
  try {
    const { data } = await getAuthenticatedHttpClient().get(
      AppUrls.getOnboardingStatusUrl(courseId, username),
    );
    return data;
  } catch (error) {
    if ('customAttributes' in error && error.customAttributes.httpErrorStatus === 404) {
      return {
        ...defaultResponse,
        onboardingStatus: 'No Record Found',
      };
    }
    return {
      ...defaultResponse,
      onboardingStatus: 'Error while fetching data',
    };
  }
}

export async function getAllUserData(userIdentifier) {
  const errors = [];
  let user = null;
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
    user.passwordStatus = await getUserPasswordStatus(user.username);
  }

  return {
    errors,
    user,
  };
}

export async function getCourseData(courseUUID) {
  try {
    const { data } = await getAuthenticatedHttpClient().get(
      AppUrls.getCourseDataUrl(courseUUID),
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
      AppUrls.getEntitlementUrl(uuid), requestData,
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
      AppUrls.getEntitlementUrl(), requestData,
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

export async function postEnrollment({
  user,
  courseID,
  mode,
  reason,
}) {
  try {
    const { data } = await getAuthenticatedHttpClient().post(
      AppUrls.getEnrollmentsUrl(user),
      {
        course_id: courseID,
        mode,
        reason,
      },
    );
    return data;
  } catch (error) {
    if (error.customAttributes.httpErrorStatus === 400) {
      // eslint-disable-next-line no-console
      console.log(JSON.parse(error.customAttributes.httpErrorResponseData));
    }
    return {
      errors: [
        {
          code: null,
          dismissible: true,
          text:
            'There was an error creating the enrollment. Check the JavaScript console for detailed errors.',
          type: 'danger',
          topic: 'enrollments',
        },
      ],
    };
  }
}

export async function patchEnrollment({
  user,
  courseID,
  newMode,
  oldMode,
  reason,
}) {
  try {
    const { data } = await getAuthenticatedHttpClient().patch(
      AppUrls.getEnrollmentsUrl(user),
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
    AppUrls.getTogglePasswordStatusUrl(user),
    {
      comment,
    },
  );
  return data;
}

export async function postResetPassword(email) {
  const { data } = await getAuthenticatedHttpClient().post(
    AppUrls.getResetPasswordUrl(), `email_from_support_tools=${email}`,
  );
  return data;
}

export async function getCertificate(username, courseKey) {
  try {
    const { data } = await getAuthenticatedHttpClient().get(
      AppUrls.getCertificateUrl(username, courseKey),
    );
    return Array.isArray(data) && data.length > 0 ? data[0] : data;
  } catch (error) {
    return {
      errors: [
        {
          code: null,
          dismissible: true,
          text: error.message,
          type: 'danger',
          topic: 'certificates',
        },
      ],
    };
  }
}

export async function generateCertificate(username, courseKey) {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('course_key', courseKey);
  try {
    const { data } = await getAuthenticatedHttpClient().post(
      AppUrls.generateCertificateUrl(),
      formData,
    );
    return data;
  } catch (error) {
    return {
      errors: [
        {
          code: null,
          dismissible: true,
          text: error.message,
          type: 'danger',
          topic: 'certificates',
        },
      ],
    };
  }
}

export async function regenerateCertificate(username, courseKey) {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('course_key', courseKey);
  try {
    const { data } = await getAuthenticatedHttpClient().post(
      AppUrls.regenerateCertificateUrl(),
      formData,
    );
    return data;
  } catch (error) {
    return {
      errors: [
        {
          code: null,
          dismissible: true,
          text: error.message,
          type: 'danger',
          topic: 'certificates',
        },
      ],
    };
  }
}
