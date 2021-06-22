import {
  isEmail, isValidUsername, formatDate, sort, titleCase,
} from './index';

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

  describe('Sort', () => {
    const sortDict1 = {
      name: 'string',
      id: { value: 1 },
      list: ['array value 1', 'array value 2'],
    };
    const sortDict2 = {
      name: 'string2',
      id: { value: 2 },
      list: ['array value 3', 'array value 4'],
    };
    it('sorts in ascending order', () => {
      expect(sort(sortDict1, sortDict2, 'id', 'asc')).toEqual(-1);
      expect(sort(sortDict2, sortDict1, 'id', 'asc')).toEqual(1);
    });
    it('sorts in descending order', () => {
      expect(sort(sortDict1, sortDict2, 'id', 'desc')).toEqual(1);
      expect(sort(sortDict2, sortDict1, 'id', 'desc')).toEqual(-1);
    });
    it('when the values are equal', () => {
      expect(sort(sortDict1, sortDict1, 'id', 'asc')).toEqual(0);
      expect(sort(sortDict1, sortDict1, 'id', 'asc')).toEqual(0);
    });
  });

  describe('titleCase', () => {
    it('empty string', () => {
      expect(titleCase('')).toEqual('');
      expect(titleCase(' ')).toEqual(' ');
    });
    it('one word string', () => {
      expect(titleCase('hello')).toEqual('Hello');
      expect(titleCase('title')).toEqual('Title');
    });
    it('string with spaces', () => {
      expect(titleCase('hello world')).toEqual('Hello World');
      expect(titleCase('title case')).toEqual('Title Case');
    });
    it('string with underscore', () => {
      expect(titleCase('hello_world')).toEqual('Hello World');
      expect(titleCase('title_case')).toEqual('Title Case');
      expect(titleCase('onboarding_exam_details')).toEqual('Onboarding Exam Details');
    });
  });
});
