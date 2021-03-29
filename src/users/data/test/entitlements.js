const entitlementsData = {
  data: {
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
          comments: 'creating entitlement',
          unenrolledRun: null,
        },
        ],
      },
      {
        user: 'edX',
        uuid: 'entitlement-1-uuid',
        courseUuid: 'course-1-uuid',
        enrollmentCourseRun: 'course-v1:testX+test123+2040',
        created: Date().toLocaleString(),
        modified: Date().toLocaleString(),
        expiredAt: Date().toLocaleString(),
        mode: 'professional',
        orderNumber: '123edX456789',
        supportDetails: [],
      },
    ],
  },
  user: 'edX',
  expanded: true,
  changeHandler: jest.fn(() => {}),
};

export default entitlementsData;
