const path = require('path');

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    // "@vue/prettier"
  ],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    // 'import/extensions': ['error', 'ignorePackages', {
    //   js: 'never',
    //   vue: 'never',
    // }],
    'linebreak-style': 'off',
    'import/prefer-default-export': 'off',
    'import/no-named-as-default': 'off',
    'prefer-destructuring': 'off',
    quotes: ['error', 'single'],
    'comma-dangle': ['error', 'always-multiline'],
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    'vue/html-self-closing': 'off',

  },
  // for eslint import alias error
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', path.resolve(__dirname, 'src')],
        ],
        extensions: ['.ts', '.js', '.jsx', '.json', '.vue'],
      },
    },
  },
};
