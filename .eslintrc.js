module.exports = {
  env: {
    browser: true, // For frontend code
    node: true,    // For backend code
    es2021: true,
    jest: true,    // Enable Jest globally for testing
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    // Custom rules for flexibility
    'no-undef': 'error', // Flag undefined variables
    'react/prop-types': 'off', // Disable prop-types enforcement (optional if using TypeScript)
  },
  overrides: [
    {
      files: ['**/FrontEnd/**/*.{js,jsx}'], // Frontend files
      env: {
        browser: true,
      },
      rules: {
        // Frontend-specific rules can go here
      },
    },
    {
      files: ['**/BackEnd/**/*.{js,ts}'], // Backend files
      env: {
        node: true,
      },
      rules: {
        // Backend-specific rules can go here
      },
    },
  ],
};
