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
      passwordToggleHistory: [
        {
          created: Date().toLocaleString(),
          comment: 'Test Disabled',
          disabled: false,
          createdBy: 'staff',
        },
        {
          created: Date().toLocaleString(),
          comment: 'Test Enable',
          disabled: true,
          createdBy: 'staff',
        }],
      status: 'Usable',
    },
  },
  changeHandler: jest.fn(() => {}),
};

export default UserSummaryData;
