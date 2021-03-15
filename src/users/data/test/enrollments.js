const enrollmentsData = {
  data: [{
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
  {
    courseId: 'course-v1:testX+test123+2040',
    courseStart: Date().toLocaleString(),
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
    manualEnrollment: {
      reason: 'Test Enrollment 2',
      enrolledBy: 'edX',
      timestamp: Date().toLocaleString(),
    },
  },
  ],
  user: 'edX',
  changeHandler: jest.fn(() => {}),
  expanded: true,
};

export default enrollmentsData;
