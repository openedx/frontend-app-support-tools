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
    isActive: true,
    mode: 'audit',
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
