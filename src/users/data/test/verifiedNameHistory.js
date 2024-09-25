const verifiedNameHistory = {
  results: [
    {
      created: '2021-10-08T17:36:55.781077Z',
      verified_name: 'Jonathan Doe',
      profile_name: 'Jon Doe',
      verification_attempt_id: null,
      verification_attempt_status: null,
      proctored_exam_attempt_id: 123,
      platform_verification_attempt_id: null,
      platform_verification_attempt_status: null,
      status: 'approved',
    },
    {
      created: '2021-09-08T17:36:55.781077Z',
      verified_name: 'J Doe',
      profile_name: 'Jon Doe',
      verification_attempt_id: 456,
      verification_attempt_status: 'must_retry',
      proctored_exam_attempt_id: null,
      platform_verification_attempt_id: null,
      platform_verification_attempt_status: null,
      status: 'denied',
    },
    {
      created: '2021-09-07T17:36:55.781077Z',
      verified_name: 'Jonathan D. Doe',
      profile_name: 'Jon Doe',
      verification_attempt_id: null,
      verification_attempt_status: null,
      proctored_exam_attempt_id: null,
      platform_verification_attempt_id: 789,
      platform_verification_attempt_status: 'pending',
      status: 'denied',
    },
  ],
};

export default verifiedNameHistory;
