import { ensureConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import * as messages from '../../userMessages/messages';
import * as AppUrls from './urls';
import { REISSUE } from '../entitlements/EntitlementActions';
import {
  isEmail, isValidLMSUserID, isValidUsername,
} from '../../utils';

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

    let notFoundErrorText = null;
    if (JSON.parse(error.customAttributes?.httpErrorResponseData)) {
      notFoundErrorText = JSON.parse(error.customAttributes.httpErrorResponseData).error_msg;
    } else if (isEmail(userIdentifier)) {
      notFoundErrorText = messages.USER_EMAIL_IDENTIFIER_NOT_FOUND_ERROR;
    } else if (isValidLMSUserID(userIdentifier)) {
      notFoundErrorText = messages.LMS_USER_ID_IDENTIFIER_NOT_FOUND_ERROR;
    } else if (isValidUsername(userIdentifier)) {
      notFoundErrorText = messages.USERNAME_IDENTIFIER_NOT_FOUND_ERROR;
    }

    notFoundErrorText = notFoundErrorText.replace('{identifier}', userIdentifier);

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

export async function getEnterpriseCustomerUsers(username, page = 1) {
  const queryParams = new URLSearchParams({ username, page });
  const baseUrl = AppUrls.getEnterpriseCustomerUsersUrl(username);
  const { data } = await getAuthenticatedHttpClient().get(`${baseUrl}?${queryParams.toString()}`);

  if (data.next) {
    const nextPageEnterpriseCustomerUsers = await getEnterpriseCustomerUsers(username, data.current_page + 1);
    return data.results.concat(nextPageEnterpriseCustomerUsers);
  }

  return data.results;
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

export async function getVerifiedNameHistory(username) {
  const response = {
    verifiedName: null,
    status: null,
    verificationType: null,
    history: [],
    error: null,
  };

  try {
    const { data } = await getAuthenticatedHttpClient().get(
      AppUrls.getVerifiedNameHistoryUrl(username),
    );

    if (!data || !data.results || data.results.length === 0) {
      return { ...response, error: 'No record found' };
    }
    const latestResult = data.results[0];
    let verificationType = null;

    if (latestResult.verification_attempt_id) {
      verificationType = 'IDV';
    } else if (latestResult.proctored_exam_attempt_id) {
      verificationType = 'Proctoring';
    }

    return {
      ...response,
      verifiedName: latestResult.verified_name,
      status: latestResult.status,
      verificationType,
      history: data.results,
    };
  } catch (error) {
    let errorText = 'Error while fetching data';

    try {
      if (error.customAttributes?.httpErrorResponseData) {
        errorText = JSON.parse(error.customAttributes.httpErrorResponseData);
      }
    } catch (e) {
      // In case there is something wrong with the response, use the default
      // error message
    }

    return { ...response, error: errorText };
  }
}

export async function getVerificationAttemptDetailsById(attemptId) {
  try {
    const { data } = await getAuthenticatedHttpClient().get(
      AppUrls.getVerificationAttemptDetailsByIdUrl(attemptId),
    );
    return data;
  } catch (error) {
    // We don't have good error handling in the app for any errors that may have come back
    // from the API, so we log them to the console and tell the user to go look.  We would
    // never do this in a customer-facing app.
    // eslint-disable-next-line no-console
    console.log(JSON.parse(error.customAttributes.httpErrorResponseData));
    return {};
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

export async function getOnboardingStatus(username) {
  const defaultResponse = {
    verified_in: null,
    current_status: null,
  };
  try {
    const { data } = await getAuthenticatedHttpClient().get(
      AppUrls.getOnboardingStatusUrl(username),
    );
    return data;
  } catch (error) {
    let errorText = 'Error while fetching data';

    try {
      if (error.customAttributes?.httpErrorResponseData) {
        errorText = JSON.parse(error.customAttributes.httpErrorResponseData);
      }
    } catch (e) {
      // In case there is something wrong with the response, use the default
      // error message
    }

    return { ...defaultResponse, error: errorText };
  }
}

export async function getAllUserData(userIdentifier) {
  const errors = [];
  let user = null;
  let retirementStatus = null;
  let errorResponse = null;
  try {
    user = await getUser(userIdentifier);
  } catch (error) {
    if (error.userError) {
      errors.push(error.userError);
      errorResponse = JSON.parse(error.customAttributes.httpErrorResponseData);
      if (errorResponse?.can_cancel_retirement) {
        retirementStatus = {
          canCancelRetirement: errorResponse.can_cancel_retirement,
          retirementId: errorResponse.retirement_id,
        };
      }
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
    retirementStatus,
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
    const { data } = await getAuthenticatedHttpClient().patch(AppUrls.getEntitlementUrl(uuid), requestData);
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
          topic: requestData.support_details[0].action === REISSUE ? 'reissueEntitlement' : 'expireEntitlement',
        },
      ],
    };
  }
}

export async function postEntitlement({
  requestData,
}) {
  try {
    const { data } = await getAuthenticatedHttpClient().post(AppUrls.getEntitlementUrl(), requestData);
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
          topic: 'createEntitlement',
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
    let errorMessage;
    if (error.customAttributes.httpErrorStatus === 400) {
      errorMessage = JSON.parse(error.customAttributes.httpErrorResponseData);
      // eslint-disable-next-line no-console
      console.log(errorMessage);
    }
    return {
      errors: [
        {
          code: null,
          dismissible: true,
          text: errorMessage || 'An unexpected error occurred',
          type: 'danger',
          topic: 'createEnrollments',
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
          topic: 'changeEnrollments',
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
  try {
    const { data } = await getAuthenticatedHttpClient().post(AppUrls.getResetPasswordUrl(), `email_from_support_tools=${email}`);
    return data;
  } catch (error) {
    return {
      errors: [
        {
          code: null,
          dismissible: true,
          text: (error.response && error.response.data),
          type: 'error',
          topic: 'resetPassword',
        },
      ],
    };
  }
}

export async function postRetireUser(username) {
  let errMessage = '';
  try {
    const response = await getAuthenticatedHttpClient().post(
      AppUrls.userRetirementUrl(),
      {
        usernames: username,
      },
    );

    if (response.data.failed_user_retirements.length > 0) {
      errMessage = 'Server Error. The backend service(lms) failed to retire the user';
      throw new Error();
    }
    return response.data;
  } catch (error) {
    let errorStatus = -1;
    if ('customAttributes' in error) {
      errorStatus = error.customAttributes.httpErrorStatus;
    }
    if (errorStatus === 401) {
      errMessage = 'Authentication Failed';
    } else if (errorStatus === 403) {
      errMessage = 'Forbidden. You do not have permissions to retire this user';
    } else if (errorStatus === 404) {
      errMessage = 'Not Found';
    }

    if (!errMessage) { errMessage = 'Unable to connect to the service'; }

    return {
      errors: [
        {
          code: null,
          dismissible: true,
          text: errMessage,
          type: 'error',
          topic: 'retireUser',
        },
      ],
    };
  }
}

export async function postCancelRetirement(retirementId) {
  try {
    const { data } = await getAuthenticatedHttpClient().post(AppUrls.CancelRetirementUrl(), `retirement_id=${retirementId}`);
    return data;
  } catch (error) {
    return {
      errors: [
        {
          code: null,
          dismissible: true,
          text: error.message,
          type: 'error',
          topic: 'cancelRetirement',
        },
      ],
    };
  }
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

export async function getUserProgramCredentials(username, page = 1) {
  try {
    const { data } = await getAuthenticatedHttpClient().get(
      `${AppUrls.getUserCredentialsUrl()}?username=${username}&type=program&page=${page}`,
    );
    if (data.next !== null) {
      const nextPageData = await getUserProgramCredentials(username, page + 1);
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
          text: error.text ? error.text : 'There was an error retrieving credentials for the user',
          type: 'danger',
          topic: 'credentials',
        },
      ],
    };
  }
}

export async function getLearnerRecords(username) {
  try {
    const { data } = await getAuthenticatedHttpClient().get(`${AppUrls.getLearnerRecordsUrl()}/?username=${username}`);
    const programDetails = [];

    if (data.enrolled_programs.length > 0) {
      await Promise.all(data.enrolled_programs.map(program => (
        getAuthenticatedHttpClient().get(`${AppUrls.getLearnerRecordsUrl()}/${program.uuid}/?username=${username}`)
          .then(response => programDetails.push(response.data))
      )));
    }

    return programDetails;
  } catch (error) {
    return {
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'There was an error retrieving records for the user',
          type: 'danger',
          topic: 'credentials',
        },
      ],
    };
  }
}
