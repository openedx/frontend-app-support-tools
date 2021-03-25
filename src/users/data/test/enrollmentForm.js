const enrollmentFormData = {
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

export default enrollmentFormData;
