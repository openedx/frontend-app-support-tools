const UserSummaryData = {
  userData: {
    name: 'edx',
    username: 'edx',
    email: 'edx@example.com',
    id: 1,
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
  ssoRecords: [{
    provider: 'edX',
    uid: 'uid',
    modified: null,
    extraData: [],
  }],
  verificationData: {
    status: 'verified',
    expirationDatetime: null,
    isVerified: true,
    extraData: [],
  },
};

export default UserSummaryData;
