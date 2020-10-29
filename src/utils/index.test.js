import { isEmail, isValidUsername } from './index';

describe('Test Utils', () => {
  const validEmails = ['staff@email.com', 'admin@email.co.og'];
  const invalidEmails = [
    '',
    ' ',
    undefined,
    'invalid email@mail.com',
    'invalid-email',
    '2020email.com',
    'www.email.com',
  ];
  const validUsername = ['staff', 'admin123'];
  const invalidUsername = ['', ' ', undefined, 'invalid username', '%invalid'];
  test.each(validEmails)('isEmail return true for %s', (email) => {
    expect(isEmail(email)).toBe(true);
  });
  test.each(invalidEmails)('isEmail return false for %s', (email) => {
    expect(isEmail(email)).toBe(false);
  });

  test.each(validUsername)('isValidUsername return true for %s', (username) => {
    expect(isValidUsername(username)).toBe(true);
  });
  test.each(invalidUsername)(
    'isValidUsername return false for %s',
    (username) => {
      expect(isValidUsername(username)).toBe(false);
    },
  );
});
