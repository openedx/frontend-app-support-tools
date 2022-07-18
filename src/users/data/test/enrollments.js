export const changeEnrollmentFormData = {
  user: 'edX',
  enrollment: {
    courseId: 'course-v1:testX+test123+2030',
    courseStart: Date().toLocaleString(),
    verifiedUpgradeDeadline: Date().toLocaleString(),
    courseEnd: Date().toLocaleString(),
    created: Date().toLocaleString(),
    courseModes: [
      {
        slug: 'verified',
      },
    ],
    isActive: true,
    mode: 'audit',
    manualEnrollment: {
      reason: 'Test Enrollment',
      enrolledBy: 'edX',
      timestamp: Date().toLocaleString(),
    },
  },
  changeHandler: jest.fn(() => {}),
  closeHandler: jest.fn(() => {}),
};

export const createEnrollmentFormData = {
  user: 'edX',
  changeHandler: jest.fn(() => {}),
  closeHandler: jest.fn(() => {}),
};

export const enrollmentsData = [
  {
    courseId: 'course-v1:testX+test123+2030',
    courseStart: Date().toLocaleString(),
    courseName: 'Test Course 1',
    pacingType: 'Self Paced',
    verifiedUpgradeDeadline: Date().toLocaleString(),
    courseEnd: Date().toLocaleString(),
    created: Date().toLocaleString(),
    courseModes: [
      {
        slug: 'verified',
      },
    ],
    enterpriseCourseEnrollments: [
      {
        course_id: 'course-v1:testX+test123+2030',
        enterprise_customer_name: 'Test Enterprise',
        enterprise_customer_user_id: 1,
        license: {
          uuid: 'fake-license-uuid',
          is_revoked: false,
        },
        data_sharing_consent: undefined,
      },
    ],
    isActive: true,
    mode: 'audit',
    orderNumber: 'EDX-001',
    manualEnrollment: {
      reason: 'Test Enrollment',
      enrolledBy: 'edX',
      timestamp: Date().toLocaleString(),
    },
  },
  {
    courseId: 'course-v1:testX+test123+2040',
    courseStart: Date().toLocaleString(),
    courseName: 'Test Course 2',
    enterpriseCourseEnrollments: [
      {
        course_id: 'course-v1:testX+test123+2040',
        enterprise_customer_name: 'Test Enterprise',
        enterprise_customer_user_id: 1,
        license: {
          uuid: 'fake-license-uuid',
          is_revoked: false,
        },
        data_sharing_consent: {
          consentProvided: true,
          consentRequired: false,
        },
      },
    ],
    pacingType: 'Instructor Paced',
    verifiedUpgradeDeadline: Date().toLocaleString(),
    courseEnd: Date().toLocaleString(),
    created: Date().toLocaleString(),
    isActive: false,
    mode: 'audit',
    courseModes: [
      {
        slug: 'verified',
      },
    ],
    manualEnrollment: {},
  },
];
