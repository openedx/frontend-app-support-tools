import moment from 'moment';

const EMAIL_REGEX = '^[a-zA-Z0-9\'!#$&*._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
const USERNAME_REGEX = '^[\\w.@_+-]+$';

export const formatDate = (date) => {
  if (date) {
    return moment(date).format('lll');
  }

  return 'N/A';
};

export const isEmail = (value) => Boolean(value && value.match(EMAIL_REGEX));

export const isValidUsername = (searchValue) => Boolean(searchValue && searchValue.match(USERNAME_REGEX));

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
