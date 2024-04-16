import { getConfig } from '@edx/frontend-platform';
import { isEmail, isValidLMSUserID, isValidUsername } from '../../utils/index';

export const getEnrollmentsUrl = username => `${
  getConfig().LMS_BASE_URL
}/support/enrollment/${username}`;

export const getSSORecordsUrl = username => `${
  getConfig().LMS_BASE_URL
}/support/sso_records/${username}`;

export const getUserAccountUrl = userIdentifier => {
  let baseUrl = `${getConfig().LMS_BASE_URL}/api/user/v1/accounts`;
  const identifierIsEmail = isEmail(userIdentifier);
  const identifierIsUsername = isValidUsername(userIdentifier);
  const identifierIsLMSUserID = isValidLMSUserID(userIdentifier);

  if (!(identifierIsEmail || identifierIsUsername || identifierIsLMSUserID)) {
    throw new Error('Invalid Argument!');
  }

  if (identifierIsEmail) {
    (baseUrl += `?email=${encodeURIComponent(userIdentifier)}`);
  } else if (identifierIsLMSUserID) {
    (baseUrl += `?lms_user_id=${userIdentifier}`);
  } else {
    (baseUrl += `/${userIdentifier}`);
  }
  return baseUrl;
};

export const getEnterpriseCustomerUsersUrl = () => `${
  getConfig().LMS_BASE_URL
}/enterprise/api/v1/enterprise-learner/`;

export const getUserVerificationDetailUrl = username => `${
  getConfig().LMS_BASE_URL
}/api/user/v1/accounts/${username}/verifications/`;

export const getUserVerificationStatusUrl = username => `${
  getConfig().LMS_BASE_URL
}/api/user/v1/accounts/${username}/verification_status/`;

export const getVerifiedNameHistoryUrl = username => `${
  getConfig().LMS_BASE_URL
}/api/edx_name_affirmation/v1/verified_name/history?username=${username}`;

export const getVerificationAttemptDetailsByIdUrl = attemptId => `${
  getConfig().LMS_BASE_URL
}/api/user/v1/accounts/verifications/${attemptId}/`;

export const getUserPasswordStatusUrl = userIdentifier => `${
  getConfig().LMS_BASE_URL
}/support/manage_user/${userIdentifier}`;

export const getLicenseManagerUrl = () => `${
  getConfig().LICENSE_MANAGER_URL
}/api/v1/staff_lookup_licenses/`;

export const getCourseDataUrl = courseUUID => `${
  getConfig().DISCOVERY_API_BASE_URL
}/api/v1/courses/${courseUUID}/`;

export const getEntitlementUrl = (uuid = null) => {
  let postfix = '';
  if (uuid) {
    postfix = `${uuid}/`;
  }
  return `${getConfig().LMS_BASE_URL}/api/entitlements/v1/entitlements/${postfix}`;
};

export const getTogglePasswordStatusUrl = user => `${
  getConfig().LMS_BASE_URL
}/support/manage_user/${user}`;

export const getResetPasswordUrl = () => `${
  getConfig().LMS_BASE_URL
}/account/password`;

export const CancelRetirementUrl = () => `${
  getConfig().LMS_BASE_URL
}/api/user/v1/accounts/cancel_retirement/`;

export const userRetirementUrl = () => `${
  getConfig().LMS_BASE_URL
}/v1/accounts/bulk_retire_users`;
export const getAccountActivationUrl = (activationKey) => `${
  getConfig().LMS_BASE_URL
}/activate/${activationKey}`;

export const getOnboardingStatusUrl = (username) => `${
  getConfig().LMS_BASE_URL
}/support/onboarding_status/${encodeURIComponent(username)}`;

export const getCertificateUrl = (username, courseKey) => `${
  getConfig().LMS_BASE_URL
}/certificates/search?user=${username}&course_id=${courseKey}`;

export const generateCertificateUrl = () => `${
  getConfig().LMS_BASE_URL
}/certificates/generate`;

export const regenerateCertificateUrl = () => `${
  getConfig().LMS_BASE_URL
}/certificates/regenerate`;

export const getUserCredentialsUrl = () => `${getConfig().CREDENTIALS_BASE_URL}/api/v2/credentials`;

export const getLearnerRecordsUrl = () => `${getConfig().CREDENTIALS_BASE_URL}/records/api/v1/program_records`;

export const getOrderHistoryUrl = () => `${getConfig().ECOMMERCE_BASE_URL}/api/v2/orders`;

export const courseResetUrl = (username) => `${getConfig().LMS_BASE_URL}/support/course_reset/${username}`;
