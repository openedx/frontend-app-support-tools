import { getConfig } from '@edx/frontend-platform';
import { isEmail, isValidLMSUserID, isValidUsername } from '../../utils/index';

const { LMS_BASE_URL, CREDENTIALS_BASE_URL } = getConfig();

export const getEnrollmentsUrl = username => `${
  LMS_BASE_URL
}/support/enrollment/${username}`;

export const getSSORecordsUrl = username => `${
  LMS_BASE_URL
}/support/sso_records/${username}`;

export const getUserAccountUrl = userIdentifier => {
  let baseUrl = `${LMS_BASE_URL}/api/user/v1/accounts`;
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
  LMS_BASE_URL
}/enterprise/api/v1/enterprise-learner/`;

export const getUserVerificationDetailUrl = username => `${
  LMS_BASE_URL
}/api/user/v1/accounts/${username}/verifications/`;

export const getUserVerificationStatusUrl = username => `${
  LMS_BASE_URL
}/api/user/v1/accounts/${username}/verification_status/`;

export const getVerifiedNameHistoryUrl = username => `${
  LMS_BASE_URL
}/api/edx_name_affirmation/v1/verified_name/history?username=${username}`;

export const getVerificationAttemptDetailsByIdUrl = attemptId => `${
  LMS_BASE_URL
}/api/user/v1/accounts/verifications/${attemptId}/`;

export const getUserPasswordStatusUrl = userIdentifier => `${
  LMS_BASE_URL
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
  return `${LMS_BASE_URL}/api/entitlements/v1/entitlements/${postfix}`;
};

export const getTogglePasswordStatusUrl = user => `${
  LMS_BASE_URL
}/support/manage_user/${user}`;

export const getResetPasswordUrl = () => `${
  LMS_BASE_URL
}/account/password`;

export const CancelRetirementUrl = () => `${
  LMS_BASE_URL
}/api/user/v1/accounts/cancel_retirement/`;

export const userRetirementUrl = () => `${
  LMS_BASE_URL
}/v1/accounts/bulk_retire_users`;
export const getAccountActivationUrl = (activationKey) => `${
  LMS_BASE_URL
}/activate/${activationKey}`;

export const getOnboardingStatusUrl = (username) => `${
  LMS_BASE_URL
}/support/onboarding_status/${encodeURIComponent(username)}`;

export const getCertificateUrl = (username, courseKey) => `${
  LMS_BASE_URL
}/certificates/search?user=${username}&course_id=${courseKey}`;

export const generateCertificateUrl = () => `${
  LMS_BASE_URL
}/certificates/generate`;

export const regenerateCertificateUrl = () => `${
  LMS_BASE_URL
}/certificates/regenerate`;

export const getUserCredentialsUrl = () => `${CREDENTIALS_BASE_URL}/api/v2/credentials`;

export const getLearnerRecordsUrl = () => `${CREDENTIALS_BASE_URL}/records/api/v1/program_records`;
