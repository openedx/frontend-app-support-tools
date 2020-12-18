const EMAIL_REGEX = '^[a-zA-Z0-9\'!#$&*._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
const USERNAME_REGEX = '^[\\w.@_+-]+$';

// todo: No need for !!. This operation is not affecting the value.
export const isEmail = (value) => !!(value && value.match(EMAIL_REGEX));

/* eslint-disable arrow-body-style */
export const isValidUsername = (searchValue) => {
  return !!(searchValue && searchValue.match(USERNAME_REGEX));
};
