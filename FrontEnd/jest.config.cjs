module.exports = {
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // If you're using CSS modules, add this line
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios)/', // If needed for transforming some node_modules packages
  ],
};
