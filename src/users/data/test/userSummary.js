const UserSummaryData = {
  userData: {
    name: 'edx',
    username: 'edx',
    email: 'edx@example.com',
    id: 1,
    activationKey: 'db2f834f90fd49afaa3ca2a68a1ae9e1',
    isActive: true,
    country: 'US',
    dateJoined: null,
    lastLogin: null,
    passwordStatus: {
      passwordToggleHistory: [],
      status: 'Usable',
    },
  },
  changeHandler: jest.fn(() => {}),
  onboardingData: {
    onboardingStatus: 'verified',
    expirationDate: null,
    onboardingLink: '/course/course-uuid/some-route',
    onboardingPastDue: false,
    onboardingReleaseDate: new Date().toISOString(),
    reviewRequirementsUrl: null,
  },
};

export default UserSummaryData;
