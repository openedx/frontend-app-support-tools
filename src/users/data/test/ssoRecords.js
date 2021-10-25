const ssoRecordsData = [
  {
    provider: 'edX',
    uid: 'uid',
    modified: null,
    extraData: '{}',
  },
  {
    provider: 'tpa-saml',
    uid: 'edx-inc:test@edx.org',
    created: '2020-06-19T12:38:40.456Z',
    modified: '2020-07-08T15:11:34.340Z',
    extraData: JSON.stringify({
      userid: ['user@edx.org'],
      'User ID': ['user@edx.org'],
      Email: ['user@edx.org'],
      mail: ['user@edx.org'],
      session_index: '_540ed9fbf25f613a8177cab8bdabcc78',
      surname: ['Test'],
      auth_time: 1594221094,
      name_id: 'user@edx.org',
      givenName: ['Staff'],
      'First Name': ['Staff'],
      'Last Name': ['Test'],
    }),
  },
  {
    provider: 'google-oauth2',
    uid: 'user@edx.org',
    created: '2020-06-19T12:38:40.456Z',
    modified: '2021-08-30T14:36:27.613Z',
    extraData: JSON.stringify({
      access_token: 'longlongtokenid-QWERTYUIOPasdfghjklZXCVBNM',
      token_type: 'Bearer',
      expires: 3599,
      auth_time: null,
    }),
  },
];

export default ssoRecordsData;
