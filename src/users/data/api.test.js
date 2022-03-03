import MockAdapter from 'axios-mock-adapter';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { enrollmentsData } from './test/enrollments';
import { downloadableCertificate } from './test/certificates';
import verifiedNameHistoryData from './test/verifiedNameHistory';
import { v2OnboardingStatusData } from './test/onboardingStatus';
import * as api from './api';
import * as urls from './urls';

describe('API', () => {
  const testUsername = 'username';
  const testEmail = 'email@example.com';
  const testLMSUserID = '22';
  const testCourseId = 'course-v1:testX+test123+2030';
  const testAttemptId = 12334;
  const userAccountApiBaseUrl = `${getConfig().LMS_BASE_URL}/api/user/v1/accounts`;
  const ssoRecordsApiUrl = `${getConfig().LMS_BASE_URL}/support/sso_records/${testUsername}`;
  const enrollmentsApiUrl = `${getConfig().LMS_BASE_URL}/support/enrollment/${testUsername}`;
  const passwordStatusApiUrl = `${getConfig().LMS_BASE_URL}/support/manage_user/${testUsername}`;
  const entitlementsApiBaseUrl = `${getConfig().LMS_BASE_URL}/api/entitlements/v1/entitlements/?user=${testUsername}`;
  const verificationDetailsApiUrl = `${getConfig().LMS_BASE_URL}/api/user/v1/accounts/${testUsername}/verifications/`;
  const verificationStatusApiUrl = `${getConfig().LMS_BASE_URL}/api/user/v1/accounts/${testUsername}/verification_status/`;
  const verifiedNameHistoryUrl = `${getConfig().LMS_BASE_URL}/api/edx_name_affirmation/v1/verified_name/history?username=${testUsername}`;
  const verificationAttemptDetailsByIdUrl = `${getConfig().LMS_BASE_URL}/api/user/v1/accounts/verifications/${testAttemptId}/`;
  const licensesApiUrl = `${getConfig().LICENSE_MANAGER_URL}/api/v1/staff_lookup_licenses/`;
  const certificatesUrl = urls.getCertificateUrl(testUsername, testCourseId);
  const generateCertificateUrl = urls.generateCertificateUrl();
  const regenerateCertificateUrl = urls.regenerateCertificateUrl();
  const getEnterpriseCustomerUsersUrl = urls.getEnterpriseCustomerUsersUrl(testUsername);

  let mockAdapter;

  const throwError = (errorCode, dataString) => {
    const error = new Error();
    error.customAttributes = {
      httpErrorStatus: errorCode,
      httpErrorResponseData: JSON.stringify(dataString),
    };
    throw error;
  };

  beforeEach(() => {
    mockAdapter = new MockAdapter(getAuthenticatedHttpClient(), { onNoMatch: 'throwException' });
  });

  afterEach(() => {
    mockAdapter.reset();
  });

  const enrollmentErrors = {
    errors: [
      {
        code: null,
        dismissible: true,
        text: 'An unexpected error occurred. Please try refreshing the page.',
        type: 'danger',
        topic: 'enrollments',
      },
    ],
  };

  describe('Onboarding Status Fetch', () => {
    const expectedSuccessResponse = {
      onboardingStatus: 'verified',
      expirationDate: null,
      onboardingLink: null,
      onboardingPastDue: null,
      onboardingReleaseDate: null,
      reviewRequirementsUrl: null,
    };

    it('No Active Paid Enrollment ', async () => {
      const response = await api.getOnboardingStatus([], testUsername);
      expect(response).toEqual({ ...expectedSuccessResponse, onboardingStatus: 'No Paid Enrollment' });
    });

    // prepare enrollments data
    const data = enrollmentsData;
    data[1].mode = 'verified';
    data[1].course_id = data[1].courseId;
    data[1].is_active = true;
    const url = urls.getOnboardingStatusUrl(data[1].course_id, testUsername);
    it('Successful Fetch ', async () => {
      mockAdapter.onGet(url).reply(200, expectedSuccessResponse);

      const response = await api.getOnboardingStatus(data, testUsername);
      expect(response).toEqual(expectedSuccessResponse);
    });

    it('No Record for Onboaring Status Fetch ', async () => {
      mockAdapter.onGet(url).reply(() => throwError(404, ''));

      const response = await api.getOnboardingStatus(data, testUsername);
      expect(response).toEqual({ ...expectedSuccessResponse, onboardingStatus: 'No Record Found' });
    });

    it('Unexpected error', async () => {
      mockAdapter.onGet(url).reply(() => throwError(500, ''));

      const response = await api.getOnboardingStatus(data, testUsername);
      expect(response).toEqual({ ...expectedSuccessResponse, onboardingStatus: 'Error while fetching data' });
    });

    it('Unexpected error fetching enrollments', async () => {
      const response = await api.getOnboardingStatus(enrollmentErrors, testUsername);
      expect(response).toEqual({ ...expectedSuccessResponse, onboardingStatus: 'Error while fetching data' });
    });
  });

  describe('V2 Onboarding Status Fetch', () => {
    const expectedSuccessResponse = v2OnboardingStatusData;
    const url = urls.getV2OnboardingStatusUrl(testUsername);
    it('Successful Fetch ', async () => {
      mockAdapter.onGet(url).reply(200, expectedSuccessResponse);

      const response = await api.getV2OnboardingStatus(testUsername);
      expect(response).toEqual(expectedSuccessResponse);
    });

    it('No Active Paid Enrollment ', async () => {
      mockAdapter.onGet(url).reply(() => throwError(404, 'Missing Records'));
      const defaultResponse = {
        verified_in: null,
        current_status: null,
        error: 'Missing Records',
      };
      const response = await api.getV2OnboardingStatus(testUsername);
      expect(response).toEqual(defaultResponse);
    });

    it('returns a server error with default message', async () => {
      const defaultResponse = {
        verified_in: null,
        current_status: null,
        error: 'Error while fetching data',
      };
      mockAdapter.onGet(url).reply(() => throwError(500));
      const response = await api.getV2OnboardingStatus(testUsername);
      expect(response).toEqual(defaultResponse);
    });
  });

  describe('SSO Records Fetch', () => {
    it('No SSO data is Returned', async () => {
      mockAdapter.onGet(ssoRecordsApiUrl).reply(200, []);
      const response = await api.getSsoRecords(testUsername);
      expect(response).toEqual([]);
    });

    it('default error response', async () => {
      const errorResponse = {
        errors: [
          {
            code: null,
            dismissible: true,
            text: 'Not Available',
            type: 'danger',
            topic: 'ssoRecords',
          },
        ],
      };
      mockAdapter.onGet(ssoRecordsApiUrl).reply(() => throwError(500, 'Not Available'));
      const expectedData = { ...errorResponse };
      const response = await api.getSsoRecords(testUsername);
      expect(response).toEqual(expectedData);
    });

    it('Valid SSO data is Returned', async () => {
      const apiResponseData = [
        {
          provider: 'edX',
          uid: 'uid',
          modified: null,
          extraData: '{}',
        },
        {
          provider: 'Google',
          uid: 'gid',
          modified: null,
          extraData: '{"auth": "sso"}',
        }];
      const expectedData = apiResponseData.map(item => ({
        ...item,
        extraData: JSON.parse(item.extraData),
      }));
      mockAdapter.onGet(ssoRecordsApiUrl).reply(200, apiResponseData);
      const response = await api.getSsoRecords(testUsername);
      expect(response).toEqual(expectedData);
    });
  });

  describe('User Password Status Fetch', () => {
    it('Password Status Data', async () => {
      const expectedData = {
        username: testUsername,
        date_joined: Date().toLocaleString(),
        is_active: true,
        status: 'Usable',
        password_toggle_history: [],
        email: testEmail,
      };
      mockAdapter.onGet(passwordStatusApiUrl).reply(200, expectedData);

      const response = await api.getUserPasswordStatus(testUsername);
      expect(response).toEqual(expectedData);
    });
  });

  describe('User Verification Details Fetch', () => {
    const defaultResponse = {
      sso_verification: [],
      ss_photo_verification: [],
      manual_verification: [],
    };

    it('default response is returned if error is raised', async () => {
      mockAdapter.onGet(verificationDetailsApiUrl).reply(() => throwError(500, ''));
      const response = await api.getUserVerificationDetail(testUsername);
      expect(response).toEqual(defaultResponse);
    });

    it('default response is returned if 404 is raised', async () => {
      mockAdapter.onGet(verificationDetailsApiUrl).reply(() => throwError(404, ''));
      const response = await api.getUserVerificationDetail(testUsername);
      expect(response).toEqual(defaultResponse);
    });

    it('Successfully fetched data is returned', async () => {
      const expectedData = [
        {
          type: 'Manual',
          status: 'Approved',
          expiration_datetime: Date().toLocaleString(),
          updated_at: Date().toLocaleString(),
          message: '',
          receipt_id: 'receipt_id',
        },
      ];
      mockAdapter.onGet(verificationDetailsApiUrl).reply(200, expectedData);
      const response = await api.getUserVerificationDetail(testUsername);
      expect(response).toEqual(expectedData);
    });
  });

  describe('User Verification Status Fetch', () => {
    const defaultResponseTemplate = {
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

    it('404 error response', async () => {
      mockAdapter.onGet(verificationStatusApiUrl).reply(() => throwError(404, ''));
      const expectedData = { ...defaultResponseTemplate };
      const response = await api.getUserVerificationStatus(testUsername);
      expect(response).toEqual(expectedData);
    });

    it('default error response', async () => {
      const errorResponse = {
        errors: [
          {
            code: null,
            dismissible: true,
            text: 'Not Available',
            type: 'danger',
            topic: 'idvStatus',
          },
        ],
      };
      mockAdapter.onGet(verificationStatusApiUrl).reply(() => throwError(500, 'Not Available'));
      const expectedData = { ...errorResponse };
      const response = await api.getUserVerificationStatus(testUsername);
      expect(response).toEqual(expectedData);
    });

    it('Successful Status Fetch', async () => {
      const apiResponseData = {
        status: 'approved',
        is_verified: false,
        expiration_datetime: Date().toLocaleString(),
      };
      const expectedData = { ...apiResponseData, extraData: {} };
      mockAdapter.onGet(verificationDetailsApiUrl).reply(200, {});
      mockAdapter.onGet(verificationStatusApiUrl).reply(200, apiResponseData);

      const response = await api.getUserVerificationStatus(testUsername);
      expect(response).toEqual(expectedData);
    });
  });

  describe('Verified Name History Fetch', () => {
    const defaultResponse = {
      verifiedName: null,
      status: null,
      verificationType: null,
      history: [],
      error: null,
    };

    it('returns a server error with default message', async () => {
      const expectedData = {
        ...defaultResponse,
        error: 'Error while fetching data',
      };
      mockAdapter.onGet(verifiedNameHistoryUrl).reply(() => throwError(500));
      const response = await api.getVerifiedNameHistory(testUsername);
      expect(response).toEqual(expectedData);
    });

    it('returns a server error with information', async () => {
      const expectedData = {
        ...defaultResponse,
        error: 'User does not exist',
      };
      mockAdapter.onGet(verifiedNameHistoryUrl).reply(() => throwError(500, 'User does not exist'));
      const response = await api.getVerifiedNameHistory(testUsername);
      expect(response).toEqual(expectedData);
    });

    it('returns an error with an empty data set', async () => {
      const expectedData = {
        ...defaultResponse,
        error: 'No record found',
      };
      mockAdapter.onGet(verifiedNameHistoryUrl).reply(200, { results: [] });
      const response = await api.getVerifiedNameHistory(testUsername);
      expect(response).toEqual(expectedData);
    });

    it('successfully fetches data', async () => {
      const expectedData = {
        ...defaultResponse,
        verifiedName: verifiedNameHistoryData.results[0].verified_name,
        status: verifiedNameHistoryData.results[0].status,
        verificationType: 'Proctoring',
        history: verifiedNameHistoryData.results,
      };
      mockAdapter.onGet(verifiedNameHistoryUrl).reply(200, verifiedNameHistoryData);

      const response = await api.getVerifiedNameHistory(testUsername);
      expect(response).toEqual(expectedData);
    });

    it('changes verificationType field based on linked ID', async () => {
      const apiResponseData = {
        results: [
          { ...verifiedNameHistoryData.results[1] },
          { ...verifiedNameHistoryData.results[0] },
        ],
      };
      const expectedData = {
        ...defaultResponse,
        verifiedName: apiResponseData.results[0].verified_name,
        status: apiResponseData.results[0].status,
        verificationType: 'IDV',
        history: apiResponseData.results,
      };
      mockAdapter.onGet(verifiedNameHistoryUrl).reply(200, apiResponseData);

      const response = await api.getVerifiedNameHistory(testUsername);
      expect(response).toEqual(expectedData);
    });
  });

  describe('Verification Attempt Details By Id', () => {
    const mockResponse = {
      message: '[{"generalReasons": ["Name mismatch"]}]',
      status: 'denied',
      verificationType: 'softwareSecure',
    };

    it('returns empty if request experience server error', async () => {
      mockAdapter.onGet(verificationAttemptDetailsByIdUrl).reply(() => throwError(500, '{}'));
      const response = await api.getVerificationAttemptDetailsById(testAttemptId);
      expect(response).toEqual({});
    });

    it('successfully fetches data', async () => {
      mockAdapter.onGet(verificationAttemptDetailsByIdUrl).reply(200, mockResponse);

      const response = await api.getVerificationAttemptDetailsById(testAttemptId);
      expect(response).toEqual(mockResponse);
    });
  });

  describe('User Account Details', () => {
    const successDictResponse = {
      username: testUsername,
      email: testEmail,
      lms_user_id: testLMSUserID,
      is_active: true,
    };
    const successListResponse = [
      successDictResponse,
    ];

    test.each(['Invalid Email', '%invalid'])('Invalid Identifiers', async (identifier) => {
      await expect(() => api.getUser(identifier)).rejects.toThrowError(new Error('Invalid Argument!'));
    });

    test.each([successDictResponse, successListResponse])('Successful Fetch by email', async (successResponse) => {
      mockAdapter.onGet(`${userAccountApiBaseUrl}?email=${encodeURIComponent(testEmail)}`).reply(200, successResponse);
      const response = await api.getUser(testEmail);
      expect(response).toEqual(Array.isArray(successResponse) ? successResponse[0] : successResponse);
    });

    test.each([successDictResponse, successListResponse])('Successful Fetch by email with +', async (responseType) => {
      const testEmailWithPlus = 'email+1@example.com';
      const successResponse = {
        ...Array.isArray(responseType) ? responseType[0] : responseType, testEmail: testEmailWithPlus,
      };
      mockAdapter.onGet(`${userAccountApiBaseUrl}?email=${encodeURIComponent(testEmailWithPlus)}`).reply(200, successResponse);
      const response = await api.getUser(testEmailWithPlus);
      expect(response).toEqual(Array.isArray(successResponse) ? successResponse[0] : successResponse);
    });

    test.each([successDictResponse, successListResponse])('Successful Fetch by username', async (successResponse) => {
      mockAdapter.onGet(`${userAccountApiBaseUrl}/${testUsername}`).reply(200, successResponse);
      const response = await api.getUser(testUsername);
      expect(response).toEqual(Array.isArray(successResponse) ? successResponse[0] : successResponse);
    });

    test.each([successDictResponse, successListResponse])('Successful Fetch by LMS User ID', async (successResponse) => {
      mockAdapter.onGet(`${userAccountApiBaseUrl}?lms_user_id=${testLMSUserID}`).reply(200, successResponse);
      const response = await api.getUser(testLMSUserID);
      expect(response).toEqual(Array.isArray(successResponse) ? successResponse[0] : successResponse);
    });

    it('Username retrieval 404 failure', async () => {
      const expectedUserError = {
        code: null,
        dismissible: true,
        text: `We couldn't find a user with the username "${testUsername}".`,
        type: 'error',
        topic: 'general',
      };
      mockAdapter.onGet(`${userAccountApiBaseUrl}/${testUsername}`).reply(() => throwError(404, ''));
      try {
        await api.getUser(testUsername);
      } catch (error) {
        expect(error.userError).toEqual(expectedUserError);
      }
    });

    it('LMS User ID retrieval 404 failure', async () => {
      const expectedUserError = {
        code: null,
        dismissible: true,
        text: `We couldn't find a user with the LMS User ID "${testLMSUserID}".`,
        type: 'error',
        topic: 'general',
      };
      mockAdapter.onGet(`${userAccountApiBaseUrl}?lms_user_id=${testLMSUserID}`).reply(() => throwError(404, ''));
      try {
        await api.getUser(testLMSUserID);
      } catch (error) {
        expect(error.userError).toEqual(expectedUserError);
      }
    });

    it('Username retrieval generic failure', async () => {
      const expectedUserError = {
        code: null,
        dismissible: true,
        text: "There was an error loading this user's data. Check the JavaScript console for detailed errors.",
        type: 'danger',
        topic: 'general',
      };
      mockAdapter.onGet(`${userAccountApiBaseUrl}/${testUsername}`).reply(() => throwError(500, ''));
      try {
        await api.getUser(testUsername);
      } catch (error) {
        expect(error.userError).toEqual(expectedUserError);
      }
    });

    it('Email retrieval 404 failure', async () => {
      const expectedUserError = {
        code: null,
        dismissible: true,
        text: `We couldn't find a user with the email "${testEmail}".`,
        type: 'error',
        topic: 'general',
      };
      mockAdapter.onGet(`${userAccountApiBaseUrl}?email=${encodeURIComponent(testEmail)}`).reply(() => throwError(404, ''));
      try {
        await api.getUser(testEmail);
      } catch (error) {
        expect(error.userError).toEqual(expectedUserError);
      }
    });

    it('Email retrieval generic failure', async () => {
      const expectedUserError = {
        code: null,
        dismissible: true,
        text: "There was an error loading this user's data. Check the JavaScript console for detailed errors.",
        type: 'danger',
        topic: 'general',
      };
      mockAdapter.onGet(`${userAccountApiBaseUrl}?email=${encodeURIComponent(testEmail)}`).reply(() => throwError(500, ''));
      try {
        await api.getUser(testEmail);
      } catch (error) {
        expect(error.userError).toEqual(expectedUserError);
      }
    });
  });

  describe('All User Data ', () => {
    const successDictResponse = {
      username: testUsername,
      email: testEmail,
      is_active: true,
    };

    it('Unsuccessful User Data Retrieval', async () => {
      const expectedUserError = {
        code: null,
        dismissible: true,
        text: `We couldn't find a user with the email "${testEmail}".`,
        type: 'error',
        topic: 'general',
      };
      mockAdapter.onGet(`${userAccountApiBaseUrl}?email=${encodeURIComponent(testEmail)}`).reply(() => throwError(404, ''));
      try {
        await api.getAllUserData(testEmail);
      } catch (error) {
        expect(error.userError).toEqual(expectedUserError);
      }
    });

    it('Successful User Data Retrieval', async () => {
      mockAdapter.onGet(`${userAccountApiBaseUrl}/${testUsername}`).reply(200, successDictResponse);
      mockAdapter.onGet(passwordStatusApiUrl).reply(200, {});

      const response = await api.getAllUserData(testUsername);
      expect(response).toEqual({
        errors: [],
        user: { ...successDictResponse, passwordStatus: {} },
      });
    });
  });

  describe('Toggle Password Status', () => {
    const togglePasswordApiUrl = `${getConfig().LMS_BASE_URL}/support/manage_user/${testUsername}`;

    it('Toggle Password Status Response', async () => {
      const comment = 'Toggling Password Status';
      const expectedResponse = { success: true };
      mockAdapter.onPost(togglePasswordApiUrl, { comment }).reply(200, expectedResponse);

      const response = await api.postTogglePasswordStatus(testUsername, comment);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('Reset Password', () => {
    const resetPasswordApiUrl = `${getConfig().LMS_BASE_URL}/account/password`;

    it('Reset Password Response', async () => {
      const expectedResponse = { };
      mockAdapter.onPost(resetPasswordApiUrl, `email_from_support_tools=${testEmail}`).reply(200, expectedResponse);
      const response = await api.postResetPassword(testEmail);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('Get Course Data', () => {
    const courseUUID = 'uuid';

    const courseDataApiUrl = `${getConfig().DISCOVERY_API_BASE_URL}/api/v1/courses/${courseUUID}/`;

    it('Course Not Found', async () => {
      mockAdapter.onGet(courseDataApiUrl).reply(() => throwError(404, ''));
      const courseNotFoundResponse = {
        code: null,
        dismissible: true,
        text: `We couldn't find summary data for this Course "${courseUUID}".`,
        type: 'error',
        topic: 'course-summary',
      };

      const response = await api.getCourseData(courseUUID);
      expect(...response.errors).toEqual(courseNotFoundResponse);
    });

    it('Error fetching course summary', async () => {
      mockAdapter.onGet(courseDataApiUrl).reply(() => throwError(500, ''));
      const courseError = {
        code: null,
        dismissible: true,
        text: `Error finding summary data for this Course "${courseUUID}".`,
        type: 'danger',
        topic: 'course-summary',
      };

      const response = await api.getCourseData(courseUUID);
      expect(...response.errors).toEqual(courseError);
    });

    it('Successful course summary fetch', async () => {
      const expectedData = {
        uuid: courseUUID,
        title: 'Test Course',
      };
      mockAdapter.onGet(courseDataApiUrl).reply(200, expectedData);

      const response = await api.getCourseData(courseUUID);
      expect(response).toEqual(expectedData);
    });
  });

  describe('getEnterpriseCustomerUsers', () => {
    it('Fetches successfully', async () => {
      const mockResponse = { next: null, results: [] };
      mockAdapter.onGet(`${getEnterpriseCustomerUsersUrl}?username=${testUsername}&page=1`).reply(200, mockResponse);
      const enterpriseCustomerUsers = await api.getEnterpriseCustomerUsers(testUsername);
      expect(enterpriseCustomerUsers).toEqual(mockResponse.results);
    });

    it('Fetches all pages ', async () => {
      const baseUrl = `${getEnterpriseCustomerUsersUrl}?username=${testUsername}`;
      const page1Url = `${baseUrl}&page=1`;
      const page2Url = `${baseUrl}&page=2`;

      const expectedData = [{ id: 1 }, { id: 2 }];

      mockAdapter.onGet(page1Url).reply(200, {
        next: page1Url,
        current_page: 1,
        results: [expectedData[0]],
      });
      mockAdapter.onGet(page2Url).reply(200, {
        next: null,
        current_page: 2,
        results: [expectedData[1]],
      });
      const enterpriseCustomerUsers = await api.getEnterpriseCustomerUsers(testUsername);
      expect(enterpriseCustomerUsers).toEqual(
        expectedData,
      );
    });
  });

  describe('Entitlements Operations', () => {
    const entitlementUuid = 'uuid';

    const requestData = {
      support_details: [{
        action: 'REISSUE',
        comments: 'Reissue Entitlement',
        enrollmentCourseRun: 'course-v1:testX',
      }],
    };

    const expectedError = {
      code: null,
      dismissible: true,
      text:
        'There was an error submitting this entitlement. Check the JavaScript console for detailed errors.',
      type: 'danger',
      topic: 'entitlements',
    };

    const expectedSuccessfulResponseData = {
      uuid: entitlementUuid,
      topic: 'entitlements',
    };

    describe('Entitlements Fetch', () => {
      const defaultResult = {
        course_uuid: 'test_uuid',
        created: Date.toLocaleString(),
        expired_at: null,
        mode: 'no-id-professional',
        modified: Date.toLocaleString(),
        order_number: null,
        refund_locked: true,
        support_details: [],
        user: testUsername,
        uuid: 'uuid',
      };
      it('Unsuccessful fetch', async () => {
        mockAdapter.onGet(`${entitlementsApiBaseUrl}&page=1`).reply(() => throwError(400, 'There was an error fetching entitlements.'));
        const response = await api.getEntitlements(testUsername);
        expect(...response.errors).toEqual({ ...expectedError, text: 'There was an error fetching entitlements.' });
      });
      it('Single page result', async () => {
        const expectedData = {
          count: 1,
          current_page: 1,
          next: null,
          results: [
            defaultResult,
          ],
        };
        mockAdapter.onGet(`${entitlementsApiBaseUrl}&page=1`).reply(200, expectedData);

        const response = await api.getEntitlements(testUsername);
        expect(response).toEqual(expectedData);
      });

      it('Multi page result', async () => {
        const firstPageResult = {
          count: 2,
          current_page: 1,
          next: 2,
          results: [
            defaultResult,
          ],
        };
        const secondPageResult = {
          count: 2,
          current_page: 2,
          next: null,
          results: [
            defaultResult,
          ],
        };

        const expectedData = {
          count: 2,
          current_page: 1,
          next: 2,
          results: [
            defaultResult,
            defaultResult,
          ],
        };
        mockAdapter.onGet(`${entitlementsApiBaseUrl}&page=1`).reply(200, firstPageResult);
        mockAdapter.onGet(`${entitlementsApiBaseUrl}&page=2`).reply(200, secondPageResult);

        const response = await api.getEntitlements(testUsername);
        expect(response).toEqual(expectedData);
      });
    });

    describe('Patch Entitlements', () => {
      const patchEntitlementsApiUrl = `${getConfig().LMS_BASE_URL}/api/entitlements/v1/entitlements/${entitlementUuid}/`;

      it('Unsuccessful patch', async () => {
        mockAdapter.onPatch(patchEntitlementsApiUrl, requestData).reply(() => throwError(400, ''));
        const response = await api.patchEntitlement({ uuid: entitlementUuid, requestData });
        expect(...response.errors).toEqual({ ...expectedError, topic: 'expireEntitlement' });
      });

      it('Successful patch', async () => {
        mockAdapter.onPatch(patchEntitlementsApiUrl, requestData).reply(200, expectedSuccessfulResponseData);
        const response = await api.patchEntitlement({ uuid: entitlementUuid, requestData });
        expect(response).toEqual(expectedSuccessfulResponseData);
      });
    });

    describe('Post Entitlements', () => {
      const postEntitlementApiUrl = `${getConfig().LMS_BASE_URL}/api/entitlements/v1/entitlements/`;

      it('Unsuccessful post', async () => {
        mockAdapter.onPost(postEntitlementApiUrl, requestData).reply(() => throwError(400, ''));
        const response = await api.postEntitlement({ requestData });
        expect(...response.errors).toEqual({ ...expectedError, topic: 'createEntitlement' });
      });

      it('Successful post', async () => {
        mockAdapter.onPost(postEntitlementApiUrl, requestData).reply(200, expectedSuccessfulResponseData);
        const response = await api.postEntitlement({ requestData });
        expect(response).toEqual(expectedSuccessfulResponseData);
      });
    });
  });

  describe('Enrollment Operations', () => {
    describe('Enrollments Fetch', () => {
      it('Enrollments Response', async () => {
        mockAdapter.onGet(enrollmentsApiUrl).reply(200, enrollmentsData);
        const expectedData = { ...enrollmentsData[0] };
        delete expectedData.changeHandler;

        const response = await api.getEnrollments(testUsername);
        expect(response[0]).toEqual(expectedData);
      });

      it('Enrollments Errors', async () => {
        mockAdapter.onGet(enrollmentsApiUrl).reply(() => throwError(500, 'An unexpected error occurred. Please try refreshing the page.'));

        const response = await api.getEnrollments(testUsername);
        expect(response).toEqual(enrollmentErrors);
      });
    });

    describe('Post Enrollment', () => {
      const apiCallData = {
        user: testUsername,
        courseID: 'course-v1:testX',
        mode: 'audit',
        reason: 'test enrollment create',
      };

      const requestData = {
        course_id: 'course-v1:testX',
        mode: 'audit',
        reason: 'test enrollment create',
      };

      it('Unsuccessful enrollment create', async () => {
        const expectedError = {
          code: null,
          dismissible: true,
          text:
          'There was an error creating the enrollment. Check the JavaScript console for detailed errors.',
          type: 'danger',
          topic: 'enrollments',
        };
        mockAdapter.onPost(enrollmentsApiUrl, requestData).reply(() => throwError(400, ''));
        const response = await api.postEnrollment({ ...apiCallData });
        expect(...response.errors).toEqual({ ...expectedError, topic: 'createEnrollments' });
      });

      it('Successful enrollment create', async () => {
        const expectedSuccessResponse = {
          topic: 'enrollments',
          message: 'enrollment created',
        };
        mockAdapter.onPost(enrollmentsApiUrl, requestData).reply(200, expectedSuccessResponse);
        const response = await api.postEnrollment({ ...apiCallData });
        expect(response).toEqual(expectedSuccessResponse);
      });
    });

    describe('Patch Enrollment Change', () => {
      const apiCallData = {
        user: testUsername,
        courseID: 'course-v1:testX',
        oldMode: 'audit',
        newMode: 'verified',
        reason: 'test mode change',
      };

      const requestData = {
        course_id: 'course-v1:testX',
        new_mode: 'verified',
        old_mode: 'audit',
        reason: 'test mode change',
      };

      it('Unsuccessful enrollment change', async () => {
        const expectedError = {
          code: null,
          dismissible: true,
          text:
            'There was an error submitting this enrollment. Check the JavaScript console for detailed errors.',
          type: 'danger',
          topic: 'enrollments',
        };
        mockAdapter.onPatch(enrollmentsApiUrl, requestData).reply(() => throwError(400, ''));
        const response = await api.patchEnrollment({ ...apiCallData });
        expect(...response.errors).toEqual({ ...expectedError, topic: 'changeEnrollments' });
      });

      it('Successful enrollment change', async () => {
        const expectedSuccessResponse = {
          topic: 'enrollments',
          message: 'enrollment mode changed',
        };
        mockAdapter.onPatch(enrollmentsApiUrl, requestData).reply(200, expectedSuccessResponse);
        const response = await api.patchEnrollment({ ...apiCallData });
        expect(response).toEqual(expectedSuccessResponse);
      });

      it('Successful license fetch with data', async () => {
        const expectedSuccessResponse = [
          {
            status: 'unassigned',
            assigned_date: null,
            activation_date: null,
            revoked_date: null,
            last_remind_date: null,
            subscription_plan_title: 'test',
            subscription_plan_expiration_date: '2021-04-01',
            activation_link: 'http://localhost:8734/test/licenses/None/activate',
          },
        ];
        mockAdapter.onPost(licensesApiUrl, { user_email: testEmail }).reply(200, expectedSuccessResponse);
        const response = await api.getLicense(testEmail);
        expect(response).toEqual({ results: expectedSuccessResponse, status: '' });
      });

      it('Unsuccessful license fetch when no email provided', async () => {
        mockAdapter.onPost(licensesApiUrl, { user_email: null }).reply(() => throwError(400, ''));
        const response = await api.getLicense(null);
        expect(response).toEqual({ results: [], status: 'User email is not provided' });
      });

      it('Unsuccessful license fetch when no record found', async () => {
        mockAdapter.onPost(licensesApiUrl, { user_email: testEmail }).reply(() => throwError(404, ''));
        const response = await api.getLicense(testEmail);
        expect(response).toEqual({ results: [], status: 'No record found' });
      });

      it('Unsuccessful license fetch when user does not have permission to license manager', async () => {
        mockAdapter.onPost(licensesApiUrl, { user_email: testEmail }).reply(() => throwError(403, ''));
        const response = await api.getLicense(testEmail);
        expect(response).toEqual({ results: [], status: 'Forbidden: User does not have permission to view this data' });
      });

      it('Unsuccessful license fetch when user is not authenticated', async () => {
        mockAdapter.onPost(licensesApiUrl, { user_email: testEmail }).reply(() => throwError(401, ''));
        const response = await api.getLicense(testEmail);
        expect(response).toEqual({ results: [], status: 'Unauthenticated: Could not autheticate user to view this data' });
      });

      it('Unsuccessful license fetch when unexpected error comes', async () => {
        mockAdapter.onPost(licensesApiUrl, { user_email: testEmail }).reply(() => throwError(500, ''));
        const response = await api.getLicense(testEmail);
        expect(response).toEqual({ results: [], status: 'Unable to connect to the service' });
      });
    });
  });

  describe('Certificate Operations', () => {
    const successDictResponse = downloadableCertificate;
    const successListResponse = [successDictResponse];
    const expectedError = {
      code: null,
      dismissible: true,
      text: '',
      type: 'danger',
      topic: 'certificates',
    };

    test.each([successDictResponse, successListResponse])('Successful Certificate Fetch', async (successResponse) => {
      mockAdapter.onGet(certificatesUrl).reply(200, successResponse);
      const response = await api.getCertificate(testUsername, testCourseId);
      expect(response).toEqual(Array.isArray(successResponse) ? successResponse[0] : successResponse);
    });

    it('Unsuccessful Certificates fetch', async () => {
      mockAdapter.onGet(certificatesUrl).reply(() => throwError(400, ''));
      const response = await api.getCertificate(testUsername, testCourseId);
      expect(...response.errors).toEqual(expectedError);
    });

    it('Successful generate Certificate', async () => {
      /**
       * No data is added in the post request check because axios-mock-adapter fails
       * with formData in post request.
       * See: https://github.com/ctimmerm/axios-mock-adapter/issues/253
       */
      mockAdapter.onPost(generateCertificateUrl).reply(200, successDictResponse);
      const response = await api.generateCertificate(testUsername, testCourseId);
      expect(response).toEqual(successDictResponse);
    });

    it('Unsuccessful generate Certificate', async () => {
      /**
       * No data is added in the post request check because axios-mock-adapter fails
       * with formData in post request.
       * See: https://github.com/ctimmerm/axios-mock-adapter/issues/253
       */
      mockAdapter.onPost(generateCertificateUrl).reply(() => throwError(400, ''));
      const response = await api.generateCertificate(testUsername, testCourseId);
      expect(...response.errors).toEqual(expectedError);
    });

    it('Successful regenerate Certificate', async () => {
      /**
       * No data is added in the post request check because axios-mock-adapter fails
       * with formData in post request.
       * See: https://github.com/ctimmerm/axios-mock-adapter/issues/253
       */
      mockAdapter.onPost(regenerateCertificateUrl).reply(200, successDictResponse);
      const response = await api.regenerateCertificate(testUsername, testCourseId);
      expect(response).toEqual(successDictResponse);
    });

    it('Unsuccessful regenerate Certificate', async () => {
      /**
       * No data is added in the post request check because axios-mock-adapter fails
       * with formData in post request.
       * See: https://github.com/ctimmerm/axios-mock-adapter/issues/253
       */
      mockAdapter.onPost(regenerateCertificateUrl).reply(() => throwError(400, ''));
      const response = await api.regenerateCertificate(testUsername, testCourseId);
      expect(...response.errors).toEqual(expectedError);
    });
  });
});
