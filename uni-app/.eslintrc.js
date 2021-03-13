module.exports = {
  root: true,
  env: {
    node: true,
  },
  globals: {
    uni: 'readonly',
    wx: 'readonly',
    getCurrentPages: 'readonly',
    uniCloud: 'readonly',
  },
  extends: ['plugin:vue/essential', '@vue/airbnb'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'object-curly-newline': ['error', { ImportDeclaration: { multiline: true } }],
    'implicit-arrow-linebreak': ['error', 'beside'],
    'operator-linebreak': [2, 'before', { overrides: { '?': 'before' } }],
    'max-len': ['error', { code: 130, ignoreUrls: true }],
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    'arrow-body-style': ['error', 'as-needed'],
    'no-bitwise': ['error', { allow: ['~'] }],
  },
};
