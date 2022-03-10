export const programInspectorSuccessResponse = {
  error: '',
  learner_program_enrollments: {
    enrollments: [
      {
        created: '2022-01-27T03:54:31',
        modified: '2022-01-27T03:54:31',
        external_user_key: 'testuser',
        status: 'enrolled',
        program_uuid: 'c72af4c6-7e40-40ff-8580-c8b31107883e',
        program_name: 'edX Demonstration Program',
        program_course_enrollments: [
          {
            course_key: 'course-v1:edX+DemoX+Demo_Course',
            course_url: '/courses/course-v1:edX+DemoX+Demo_Course/course/',
            created: '2022-01-27T03:59:45',
            modified: '2022-01-27T03:59:45',
            status: 'active',
            course_enrollment: {
              course_id: 'course-v1:edX+DemoX+Demo_Course',
              is_active: true,
              mode: 'audit',
            },
          },
          {
            course_key: 'course-v1:edX+DemoX+Demo_Course',
            course_url: '/courses/course-v1:edX+DemoX+Demo_Course/course/',
            created: '2022-01-27T03:59:45',
            modified: '2022-01-27T03:59:45',
            status: 'active',
            course_enrollment: {
              course_id: 'course-v1:edX+DemoX+Demo_Course',
              is_active: false,
              mode: 'audit',
            },
          },
        ],
      },
    ],
    id_verification: {
      error: '',
      should_display: false,
      status: 'approved',
      status_date: '2022-01-27T04:30:14.273438Z',
      verification_expiry: '',
    },
    user: {
      email: 'verified@example.com',
      username: 'verified',
      sso_list: [
        {
          uid: 'edx-inc:test@edx.org',
        },
      ],
    },
  },
  org_keys: 'testX',
};

export const programInspectorErrorResponse = {
  error: 'Could not find edx account with wrongAccount',
  learner_program_enrollments: {},
  org_keys: 'testX',
};
