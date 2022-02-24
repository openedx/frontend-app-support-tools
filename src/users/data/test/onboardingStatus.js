const onboardingStatusData = {
  onboardingStatus: 'verified',
  expirationDate: null,
  onboardingLink: '/course/course-uuid/some-route',
  onboardingPastDue: false,
  onboardingReleaseDate: new Date().toISOString(),
  reviewRequirementsUrl: null,
};

const v2OnboardingStatusData = {
  verifiedIn: {
    onboardingStatus: 'verified',
    onboardingLink: '/courses/course-v1:test-course/jump_to/block-v1:test-course+type@sequential+block@12345678',
    expirationDate: '2022-09-07T23:59:59+00:00',
    onboardingPastDue: false,
    onboardingReleaseDate: '2020-09-03T20:00:00+00:00',
    reviewRequirementsUrl: 'https://support.edx.org/hc/en-us/sections/12345678-Proctortrack',
    courseId: 'course-v1:test-course',
    enrollmentDate: '2020-07-03T08:57:50Z',
    instructorDashboardLink: '/courses/course-v1:test-course/instructor#view-special_exams',
  },
  currentStatus: {
    onboardingStatus: 'verified',
    onboardingLink: '/courses/course-v1:test-course/jump_to/block-v1:test-course+type@sequential+block@12345678',
    expirationDate: '2022-09-07T23:59:59+00:00',
    onboardingPastDue: false,
    onboardingReleaseDate: '2020-09-03T20:00:00+00:00',
    reviewRequirementsUrl: 'https://support.edx.org/hc/en-us/sections/12345678-Proctortrack',
    courseId: 'course-v1:test-course',
    enrollmentDate: '2020-07-03T08:57:50Z',
    instructorDashboardLink: '/courses/course-v1:test-course/instructor#view-special_exams',
  },
};

export { onboardingStatusData, v2OnboardingStatusData };
