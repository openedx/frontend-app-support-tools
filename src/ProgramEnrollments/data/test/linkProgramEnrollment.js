export const lpeSuccessResponse = {
  successes: ["('testuser', 'verified')"],
  errors: [],
  program_uuid: '8bee627e-d85e-4a76-be41-d58921da666e',
  username_pair_text: 'testuser,verified',
};

export const lpeErrorResponseAlreadyLinked = {
  successes: [],
  errors: [
    'Program enrollment with external_student_key=testuser1 is already linked to target account username=verified',
  ],
  program_uuid: '8bee627e-d85e-4a76-be41-d58921da666e',
  username_pair_text: 'testuser,verified',
};

export const lpeErrorResponseInvalidUUID = {
  successes: [],
  errors: [
    "Supplied program UUID '8bee627e-d85e-4a76-be41-d58921da666e' is not a valid UUID.",
  ],
  program_uuid: '8bee627e-d85e-4a76-be41-d58921da666e',
  username_pair_text: 'testuser,verified',
};

export const lpeErrorResponseInvalidUsername = {
  successes: [],
  errors: ['No user found with username verified'],
  program_uuid: '8bee627e-d85e-4a76-be41-d58921da666e',
  username_pair_text: 'testuser,verified',
};

export const lpeErrorResponseInvalidExternalKey = {
  successes: [],
  errors: [
    'No program enrollment found for program uuid=8bee627e-d85e-4a76-be41-d58921da666e and external student key=testuser',
  ],
  program_uuid: '8bee627e-d85e-4a76-be41-d58921da666e',
  username_pair_text: 'testuser,verified',
};

export const lpeErrorResponseEmptyValues = {
  successes: [],
  errors: [
    "You must provide both a program uuid and a series of lines with the format 'external_user_key,lms_username'.",
  ],
  program_uuid: '',
  username_pair_text: '',
};
