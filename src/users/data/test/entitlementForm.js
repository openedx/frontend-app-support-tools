const entitlementFormData = {
  user: 'edX',
  entitlement: {
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
  changeHandler: jest.fn(() => {}),
  closeHandler: jest.fn(() => {}),
};

export default entitlementFormData;
