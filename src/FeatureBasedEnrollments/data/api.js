import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

export default async function getFeatureBasedEnrollmentDetails(courseId) {
  const apiUrl = `${getConfig().LMS_BASE_URL}/support/feature_based_enrollment_details/${courseId}`;
  try {
    const { data } = await getAuthenticatedHttpClient().get(apiUrl);
    return data;
  } catch (error) {
    return {
      errors: [
        {
          code: null,
          dismissible: true,
          text: `Unexpected error while fetching gating information for Course ${courseId}`,
          type: 'error',
          topic: 'featureBasedEnrollment',
        },
      ],
    };
  }
}
