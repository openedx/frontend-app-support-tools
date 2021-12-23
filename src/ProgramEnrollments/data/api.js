import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

const { LMS_BASE_URL } = getConfig();

export default async function getLinkProgramEnrollmentDetails({
  programID,
  usernamePairText,
}) {
  const apiUrl = `${LMS_BASE_URL}/support/link_program_enrollments_details/`;
  const formData = new FormData();
  formData.append('program_uuid', programID);
  formData.append('username_pair_text', usernamePairText);
  try {
    const { data } = await getAuthenticatedHttpClient().post(apiUrl, formData);
    return data;
  } catch (error) {
    return {
      error: [
        {
          code: null,
          dismissible: true,
          text: `Unexpected error while linking program enrollments for Program ${programID}`,
          type: 'error',
          topic: 'linkProgramEnrollment',
        },
      ],
    };
  }
}
