import MockAdapter from 'axios-mock-adapter';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { createIntl } from '@edx/frontend-platform/i18n';
import { fetchUserRoleBasedCourses, updateUserRolesInCourses } from './api';
import * as utils from '../utils';
import messages from '../messages';

const intl = createIntl({ locale: 'en', messages: {} });

describe('Manage Course Team API', () => {
  let mockAdapter;
  const { LMS_BASE_URL } = getConfig();
  const email = 'test@example.com';

  beforeEach(() => {
    mockAdapter = new MockAdapter(getAuthenticatedHttpClient(), { onNoMatch: 'throwException' });
  });

  afterEach(() => {
    mockAdapter.reset();
  });

  describe('fetchUserRoleBasedCourses', () => {
    const apiUrl = `${LMS_BASE_URL}/api/support/v1/manage_course_team/?email=${encodeURIComponent(email)}`;

    it('returns data on successful GET', async () => {
      const mockData = [
        {
          course_id: 'course-v1:Arbisoft+t1+t1',
          course_name: 'Introduction to Computing using Python (2024)',
          course_url: 'http://localhost:18010/course/course-v1:Arbisoft+t1+t1',
          role: 'instructor',
          status: 'archived',
          org: 'Arbisoft',
          run: 't1',
          number: 't1',
        },
        {
          course_id: 'course-v1:Arbisoft+t2+t2',
          course_name: 'HTML5 Coding Essentials and Best Practices',
          course_url: 'http://localhost:18010/course/course-v1:Arbisoft+t2+t2',
          role: 'staff',
          status: 'archived',
          org: 'Arbisoft',
          run: 't2',
          number: 't2',
        },
        {
          course_id: 'course-v1:Arbisoft+t3+t3',
          course_name: 'Behavioral Neuroscience: Advanced Insights from Mouse Models',
          course_url: 'http://localhost:18010/course/course-v1:Arbisoft+t3+t3',
          role: null,
          status: 'archived',
          org: 'Arbisoft',
          run: 't3',
          number: 't3',
        },
      ];
      mockAdapter.onGet(apiUrl).reply(200, mockData);

      const result = await fetchUserRoleBasedCourses(email);
      expect(result).toEqual(mockData);
    });

    it('returns empty array on error', async () => {
      mockAdapter.onGet(apiUrl).reply(500);

      const result = await fetchUserRoleBasedCourses(email, intl);
      expect(result).toEqual({
        error: [
          {
            code: null,
            dismissible: true,
            text: intl.formatMessage(messages.courseTeamGetApiError),
            type: 'danger',
            topic: 'courseTeamManagementApiErrors',
          },
        ],
        isGetAppError: true,
      });
    });
  });

  describe('updateUserRolesInCourses', () => {
    const apiUrl = `${LMS_BASE_URL}/api/support/v1/manage_course_team/`;
    const changedCourses = {
      newlyCheckedWithRole: [],
      uncheckedWithRole: [],
      roleChangedRows: [
        {
          runId: 't2',
          from: 'staff',
          to: 'instructor',
          courseName: 'HTML5 Coding Essentials and Best Practices',
          number: 't2',
          courseId: 'course-v1:Arbisoft+t2+t2',
        },
      ],
    };
    const coursesToUpdate = [
      {
        course_id: 'course-v1:Arbisoft+t2+t2',
        role: 'instructor',
        action: 'assign',
      },
    ];
    const errors = {
      newlyCheckedWithRoleErrors: [],
      uncheckedWithRoleErrors: [],
      roleChangedRowsErrors: [],
    };
    const mockPutData = {
      email: 'test@example.com',
      results: [
        {
          course_id: 'course-v1:Arbisoft+t2+t2',
          role: 'staff',
          action: 'assign',
          status: 'success',
        },
      ],
    };

    it('calls PUT and returns extracted errors on success', async () => {
      const expectedBulkOps = utils.getDataToUpdateForPutRequest(changedCourses);
      expect(expectedBulkOps).toEqual(coursesToUpdate);
      const expectedErrors = utils.extractErrorsFromUpdateResponse(mockPutData);
      expect(expectedErrors).toEqual(errors);

      mockAdapter.onPut(apiUrl, {
        email,
        bulk_role_operations: expectedBulkOps,
      }).reply(200, mockPutData);

      const result = await updateUserRolesInCourses({ userEmail: email, changedCourses });

      expect(result).toEqual(expectedErrors);
    });

    it('returns empty array on error', async () => {
      mockAdapter.onPut(apiUrl).reply(500);

      const result = await updateUserRolesInCourses({ userEmail: email, changedCourses, intl });
      expect(result).toEqual({
        error: [
          {
            code: null,
            dismissible: true,
            text: intl.formatMessage(messages.courseTeamUpdateApiError),
            type: 'danger',
            topic: 'courseTeamManagementApiErrors',
          },
        ],
      });
    });
  });
});
