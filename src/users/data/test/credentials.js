export const credentials = {
  count: 1,
  next: null,
  previous: null,
  results: [
    {
      attributes: [
        {
          name: 'test_name',
          value: 'test_value',
        },
      ],
      certificate_url: 'http://localhost:18150/credentials/94315574b2754dc0ba98f1051a4c5dc5/',
      created: '2022-04-07T00:47:12Z',
      credential: {
        type: 'program',
        credential_id: 1,
        program_uuid: '887d1d24-bc9f-11ec-8422-0242ac120002',
      },
      date_override: null,
      download_url: null,
      modified: '2022-04-18T02:39:29Z',
      status: 'awarded',
      username: 'edx',
      uuid: '94315574-b275-4dc0-ba98-f1051a4c5dc5',
    },
  ],
};

export const noCredentials = {
  count: 0,
  next: null,
  previous: null,
  results: [],
};
