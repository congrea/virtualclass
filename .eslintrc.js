module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    virtualclass: "writable",
  },
  parserOptions: {
    ecmaVersion: 2017,
  },
  rules: {
  },
};
