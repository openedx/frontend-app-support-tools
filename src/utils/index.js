import moment from 'moment';

const COURSE_ID_REGEX = '[^/+]+(/|\\+)[^/+]+(/|\\+)[^/?]+';
const EMAIL_REGEX = '^[a-zA-Z0-9\'!#$&*._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
const USERNAME_REGEX = '^[\\w.@_+-]+$';
const LMS_USER_ID_REGEX = '^(?!0)[0-9]+$';
const DIGITS_ONLY_REGEX = /^(?!0\d)[1-9]\d*(?<!\.)$/;

export const formatDate = (date) => {
  if (date) {
    return moment(date).format('lll');
  }

  return 'N/A';
};

export const formatBoolean = (value) => {
  if (value === undefined || value === null) {
    return 'N/A';
  }
  return value ? 'True' : 'False';
};

/** Convert a UNIX timestamp (in seconds) to human readable date string. */
export const formatUnixTimestamp = (date) => {
  if (date) {
    // js works in miliseconds
    const dateObj = new Date(date * 1000);
    return formatDate(dateObj);
  }

  return 'N/A';
};

export const isEmail = (value) => Boolean(value && value.match(EMAIL_REGEX));

export const isValidUsername = (searchValue) => Boolean(searchValue && searchValue.match(USERNAME_REGEX));

export const isValidLMSUserID = (searchValue) => Boolean(searchValue && searchValue.match(LMS_USER_ID_REGEX));

export const isValidCourseID = (value) => Boolean(value && value.match(COURSE_ID_REGEX));

export const isWholeDollarAmount = (value) => Boolean(value && value.match(DIGITS_ONLY_REGEX));

export function sort(firstElement, secondElement, key, direction) {
  const directionIsAsc = direction === 'asc';

  if (firstElement[key].value > secondElement[key].value) {
    return directionIsAsc ? 1 : -1;
  }
  if (firstElement[key].value < secondElement[key].value) {
    return directionIsAsc ? -1 : 1;
  }
  return 0;
}

/** Convert a string containing space and/or underscore (snake_case) into titleCase. e.g. hello_world -> Hello World */
export function titleCase(str) {
  return str.toLowerCase().replace(/_/g, ' ').replace(/\b(\w)/g, s => s.toUpperCase());
}

/**  Compare dates function for array.sort() */
export function sortedCompareDates(x, y, asc) {
  const a = new Date(x);
  const b = new Date(y);
  return asc ? a - b : b - a;
}

export function extractMessageTuple(message) {
  /*
      Support Tools API sends an array of success tuples for
      Link Program Enrollments of format
      [
          '('external_user_key', 'lms_username')',
          '('external_user_key', 'lms_username')',
      ]
      that are identified as strings by the JS.
      This function removes the overhead characters and
      splits the string into an array of format
      [
          [external_user_key,lms_username],
          [external_user_key,lms_username],
      ]
  */
  return message
    .replace('(', '')
    .replace(')', '')
    .replace(/'/g, '')
    .replace(/ /g, '')
    .split(',');
}

export function extractParams(searchParams) {
  // converts query params from url into map e.g. ?param1=value1&param2=value2 -> {param1: value1, param2: value2}
  return new Map(
    searchParams
      .slice(1) // removes '?' mark from start
      .split('&')
      .map(queryParams => queryParams.split('=')),
  );
}

export const isValidDateString = (dateString) => moment(dateString, 'YYYY-MM-DD', true).isValid();
