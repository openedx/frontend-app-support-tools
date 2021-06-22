import { getConfig } from '@edx/frontend-platform';
import { isEmail, isValidUsername } from '../../utils/index';

const { LMS_BASE_URL } = getConfig();

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

  if (!(identifierIsEmail || identifierIsUsername)) {
    throw new Error('Invalid Argument!');
  }

  baseUrl = identifierIsEmail
    ? (baseUrl += `?email=${encodeURIComponent(userIdentifier)}`)
    : (baseUrl += `/${userIdentifier}`);
  return baseUrl;
};

export const getUserVerificationDetailUrl = username => `${
  LMS_BASE_URL
}/api/user/v1/accounts/${username}/verifications/`;

export const getUserVerificationStatusUrl = username => `${
  LMS_BASE_URL
}/api/user/v1/accounts/${username}/verification_status/`;

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

export const getAccountActivationUrl = (activationKey) => `${
  LMS_BASE_URL
}/activate/${activationKey}`;

export const getOnboardingStatusUrl = (courseId, username) => `${
  LMS_BASE_URL
}/api/edx_proctoring/v1/user_onboarding/status?course_id=${encodeURIComponent(courseId)}&username=${encodeURIComponent(username)}`;
