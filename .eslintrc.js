// eslint-disable-next-line import/no-extraneous-dependencies
const { getBaseConfig } = require('@edx/frontend-build');

const config = getBaseConfig('eslint');

config.rules = {
  ...config.rules,
  'jsx-a11y/label-has-associated-control': [2, {
    depth: 3,
    controlComponents: ['Input'],
    assert: 'htmlFor',
  }],
  'react-hooks/exhaustive-deps': 'off',
  'react/function-component-definition': 'off',

};

module.exports = config;
