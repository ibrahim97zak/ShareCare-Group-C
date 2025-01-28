module.exports = {
  env: {
    browser: true,   // For frontend code
    node: true,      // For backend code
    es2021: true,    // Modern ECMAScript features
    jest: true,      // Enable Jest globally for testing
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',  // Add TypeScript linting rules
    'plugin:react-hooks/recommended',  // React hooks linting rules
  ],
  parser: '@typescript-eslint/parser',  // Set TypeScript parser
  parserOptions: {
    ecmaVersion: 2021,  // Use the latest ECMAScript features
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,  // Enable JSX parsing
    },
  },
  plugins: [
    'react',  // React plugin for linting React-specific code
    '@typescript-eslint',  // TypeScript plugin
    'jest' ,  // Add the Jest plugi
  ],
  rules: {
    // Custom rules for flexibility
    'no-undef': 'error',  // Flag undefined variables
    'react/prop-types': 'off',  // Disable prop-types enforcement (optional if using TypeScript)
    '@typescript-eslint/explicit-module-boundary-types': 'off',  // Disable explicit return type for functions (optional)
  },
  overrides: [
    {
      files: ['**/frontend/**/*.{js,jsx,ts,tsx}'],  // Frontend files
      env: {
        browser: true,
      },
      rules: {
        // Frontend-specific rules can go here
      },
    },
    {
      files: ['**/backend/**/*.{js,ts}'],  // Backend files
      env: {
        node: true,
      },
      rules: {
        // Backend-specific rules can go here
      },
    },
  ],
};
