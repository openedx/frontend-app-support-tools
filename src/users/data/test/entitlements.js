export const entitlementsData = {
  results: [
    {
      user: 'edX',
      uuid: 'entitlement-uuid',
      courseUuid: 'course-uuid',
      enrollmentCourseRun: 'course-v1:testX+test123+2030',
      created: Date().toLocaleString(),
      modified: Date().toLocaleString(),
      expiredAt: Date().toLocaleString(),
      mode: 'verified',
      orderNumber: '123edX456',
      supportDetails: [{
        supportUser: 'admin',
        action: 'CREATE',
        actionCreated: Date().toLocaleString(),
        comments: 'creating entitlement',
        unenrolledRun: null,
      },
      {
        supportUser: 'admin',
        action: 'EXPIRE',
        actionCreated: Date().toLocaleString(),
        comments: 'expiring entitlement',
        unenrolledRun: null,
      },
      ],
    },
    {
      user: 'edX',
      uuid: 'entitlement-1-uuid',
      courseUuid: 'course-1-uuid',
      enrollmentCourseRun: null,
      created: Date().toLocaleString(),
      modified: Date().toLocaleString(),
      expiredAt: null,
      mode: 'professional',
      orderNumber: '123edX456789',
      supportDetails: [],
    },
  ],
};

export const entitlementsErrors = {
  errors: [
    {
      code: null,
      dismissible: true,
      text: 'Test Error',
      type: 'danger',
      topic: 'entitlements',
    },
  ],
};
