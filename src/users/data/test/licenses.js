const licensesData = {
  results: [
    {
      status: 'unassigned',
      assignedDate: null,
      revokedDate: null,
      activationDate: new Date().toISOString().replace(/T.*/, ''),
      subscriptionPlanTitle: 'test',
      lastRemindDate: new Date().toISOString().replace(/T.*/, ''),
      activationLink: null,
      subscriptionPlanExpirationDate: 'http://localhost:8734/test/licenses/None/activate',
    },
    {
      status: 'unassigned',
      assignedDate: new Date().toISOString().replace(/T.*/, ''),
      revokedDate: null,
      activationDate: null,
      subscriptionPlanTitle: 'test2',
      lastRemindDate: new Date().toISOString().replace(/T.*/, ''),
      activationLink: null,
      subscriptionPlanExpirationDate: null,
    },
  ],
  status: '',
};

export default licensesData;
