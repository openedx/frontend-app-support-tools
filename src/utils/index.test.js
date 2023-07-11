import {
  extractMessageTuple,
  extractParams,
  formatBoolean,
  formatDate,
  formatUnixTimestamp,
  isEmail,
  isValidCourseID,
  isValidDateString,
  isValidLMSUserID,
  isValidOpportunityProduct,
  isValidUsername,
  isWholeDollarAmount,
  sort,
  sortedCompareDates,
  titleCase,
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

    const validLMSUserIDs = ['1', '111', '999', '1000000022333'];
    const invalidLMSUserIDs = ['0', '-1', '12b3', undefined, 'edx@example.com', 'edx'];

    const validCourseID = ['course-v1:testX+test101+2020', 'course-v1/testX/test101/2020'];
    const invalidCourseID = ['invalid-course-id', 'course-v1:testX+test101', 'no-id'];

    test.each(validEmails)('isEmail returns true for %s', (email) => {
      expect(isEmail(email)).toBe(true);
    });
    test.each(invalidEmails)('isEmail returns false for %s', (email) => {
      expect(isEmail(email)).toBe(false);
    });

    test.each(validUsername)('isValidUsername returns true for %s', (username) => {
      expect(isValidUsername(username)).toBe(true);
    });
    test.each(invalidUsername)(
      'isValidUsername return false for %s',
      (username) => {
        expect(isValidUsername(username)).toBe(false);
      },
    );
    test.each(validLMSUserIDs)('isValidLMSUserID returns true for %s', (username) => {
      expect(isValidLMSUserID(username)).toBe(true);
    });

    test.each(invalidLMSUserIDs)('isValidLMSUserID returns true for %s', (username) => {
      expect(isValidLMSUserID(username)).toBe(false);
    });
    test.each(validCourseID)('isValidCourseID returns true for %s', (courseId) => {
      expect(isValidCourseID(courseId)).toBe(true);
    });

    test.each(invalidCourseID)('isValidCourseID returns false for %s', (courseId) => {
      expect(isValidCourseID(courseId)).toBe(false);
    });
  });

  describe('Format Boolean', () => {
    it('correctly formats boolean', () => {
      expect(formatBoolean(true)).toEqual('True');
      expect(formatBoolean(false)).toEqual('False');
      expect(formatBoolean(null)).toEqual('N/A');
      expect(formatBoolean(undefined)).toEqual('N/A');
    });
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

  describe('Format Unix Timestamp', () => {
    it('correctly formats unix timestamp', () => {
      const date1 = formatUnixTimestamp('1635327149');
      const date2 = formatUnixTimestamp('1');
      const date3 = formatUnixTimestamp('2635444449');

      expect(date1).toEqual('Oct 27, 2021 9:32 AM');
      expect(date2).toEqual('Jan 1, 1970 12:00 AM');
      expect(date3).toEqual('Jul 6, 2053 7:54 PM');
    });
    it('returns N/A if data is not provided', () => {
      expect(formatUnixTimestamp('')).toEqual('N/A');
      expect(formatUnixTimestamp()).toEqual('N/A');
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

  describe('sortedCompareDates', () => {
    const dates = [
      '2022-04-06T20:49:53.428771Z',
      '2022-04-06T20:49:53.428771Z',
      '2021-04-06T20:49:53.428771Z',
      '2020-04-06T20:49:53.428771Z',
      '2021-04-06T10:49:53.428771Z',
    ];

    const ascSortedDates = [
      '2020-04-06T20:49:53.428771Z',
      '2021-04-06T10:49:53.428771Z',
      '2021-04-06T20:49:53.428771Z',
      '2022-04-06T20:49:53.428771Z',
      '2022-04-06T20:49:53.428771Z',
    ];

    const dscSortedDates = [
      '2022-04-06T20:49:53.428771Z',
      '2022-04-06T20:49:53.428771Z',
      '2021-04-06T20:49:53.428771Z',
      '2021-04-06T10:49:53.428771Z',
      '2020-04-06T20:49:53.428771Z',
    ];

    it('dates in asc order', () => {
      expect(dates.sort(
        (a, b) => sortedCompareDates(a, b, true),
      )).toEqual(ascSortedDates);
    });
    it('dates in dsc order', () => {
      expect(dates.sort(
        (a, b) => sortedCompareDates(a, b, false),
      )).toEqual(dscSortedDates);
    });
  });

  describe('Extract Message Tuples', () => {
    const message = "('external_user_key', 'lms_username')";
    expect(extractMessageTuple(message)).toEqual([
      'external_user_key',
      'lms_username',
    ]);
  });

  describe('Extract Search Params', () => {
    it('valid search param', () => {
      const query = '?param1=test&param2=test2&param3=';
      const params = extractParams(query);
      expect(params.size).toEqual(3);
      expect(params.get('param1')).toEqual('test');
      expect(params.get('param2')).toEqual('test2');
      expect(params.get('param3')).toEqual('');
    });
    it('no search param', () => {
      const query = '';
      const params = extractParams(query);
      expect(params.size).toEqual(1);
      expect(params.get('')).toEqual(undefined);
    });
  });

  describe('isValidDate', () => {
    it('returns true for valid date string in YYYY-MM-DD format', () => {
      expect(isValidDateString('2022-03-24')).toBe(true);
      expect(isValidDateString('1997-11-04')).toBe(true);
      expect(isValidDateString('2022-01-01')).toBe(true);
    });
    it('returns false for invalid date string', () => {
      expect(isValidDateString('2022-3-24')).toBe(false);
      expect(isValidDateString('2022-04-3oT12:00:00Z')).toBe(false);
      expect(isValidDateString('2022/01/01')).toBe(false);
      expect(isValidDateString('foo')).toBe(false);
    });
    it('returns false for null or undefined input', () => {
      expect(isValidDateString(null)).toBe(false);
      expect(isValidDateString(undefined)).toBe(false);
    });
  });
});

describe('isWholeDollarAmount', () => {
  it('returns true for whole dollar amounts', () => {
    expect(isWholeDollarAmount('1')).toEqual(true);
    expect(isWholeDollarAmount('999')).toEqual(true);
  });
  it('returns false for non-whole dollar amounts', () => {
    expect(isWholeDollarAmount('10.00')).toEqual(false);
    expect(isWholeDollarAmount('0.99')).toEqual(false);
    expect(isWholeDollarAmount('123.45')).toEqual(false);
    expect(isWholeDollarAmount('0')).toEqual(false);
  });
  it('returns false for non-numeric inputs', () => {
    expect(isWholeDollarAmount('abc')).toEqual(false);
    expect(isWholeDollarAmount('')).toEqual(false);
    expect(isWholeDollarAmount(null)).toEqual(false);
    expect(isWholeDollarAmount('123ab')).toEqual(false);
    expect(isWholeDollarAmount('ab233')).toEqual(false);
  });
});

describe('isValidOpportunityProduct', () => {
  it('returns true for valid opportunity product', () => {
    expect(isValidOpportunityProduct('00')).toEqual(true);
    expect(isValidOpportunityProduct('00k')).toEqual(true);
    expect(isValidOpportunityProduct('00k0')).toEqual(true);
    expect(isValidOpportunityProduct('00k000000000000000')).toEqual(true);
  });
  it('returns false for invalid opportunity product', () => {
    expect(isValidOpportunityProduct('')).toEqual(false);
    expect(isValidOpportunityProduct('1')).toEqual(false);
    expect(isValidOpportunityProduct('c')).toEqual(false);
    expect(isValidOpportunityProduct('0k')).toEqual(false);
    expect(isValidOpportunityProduct('01')).toEqual(false);
    expect(isValidOpportunityProduct('oo')).toEqual(false);
    expect(isValidOpportunityProduct('OO')).toEqual(false);
    expect(isValidOpportunityProduct('00p')).toEqual(false);
    expect(isValidOpportunityProduct('00K')).toEqual(false);
    expect(isValidOpportunityProduct('abk0000000000000000')).toEqual(false);
    expect(isValidOpportunityProduct('abK0000000000000000')).toEqual(false);
    expect(isValidOpportunityProduct('00k00000000000000000000000000000')).toEqual(false);
    expect(isValidOpportunityProduct()).toEqual(false);
  });
});
