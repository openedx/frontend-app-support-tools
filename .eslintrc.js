const { getBaseConfig } = require('@edx/frontend-build');

const config = getBaseConfig('eslint');

config.rules = {
  ...config.rules,
  "jsx-a11y/label-has-associated-control": [ 2, {
    "controlComponents": ["Input"],
    "assert": "htmlFor",
    "depth": 3,
  }],
};

module.exports = config;
