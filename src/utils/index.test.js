import { isEmail, isValidUsername, formatDate } from './index';

describe('Test Utils', () => {
  describe('test user identifier', () => {
    const validEmails = ['staff@email.com', 'admin@email.co.og', 'test\'1@email.com'];
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

  describe('Format Date', () => {
    it('correctly formats date', () => {
      const formatedDate = formatDate('2015-09-19T11:00:00');

      expect(formatedDate).toEqual('Sep 19, 2015 11:00 AM');
    });
    it('returns N/A if data is not provided', () => {
      expect(formatDate('')).toEqual('N/A');
      expect(formatDate()).toEqual('N/A');
    });
  });
});
