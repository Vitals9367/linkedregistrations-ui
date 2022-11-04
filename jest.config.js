/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
// jest.config.js
const nextJest = require('next/jest');

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({ dir: './' });

// Any custom config you want to pass to Jest
const customJestConfig = {
  coverageProvider: 'babel',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/domain/auth/ApiTokenUpdater.tsx',
    '<rootDir>/src/domain/auth/hooks/useApiTokenUpdater.ts',
    '<rootDir>/src/pages/',
    '<rootDir>/src/tests/',
    '<rootDir>/src/utils/getPageHeaderHeight.ts',
    '<rootDir>/src/utils/getSessionAndUser.ts',
    '<rootDir>/src/utils/mockDataUtils.ts',
    '<rootDir>/src/utils/mockSession.ts',
    '<rootDir>/src/utils/testUtils.ts',
    'constants.ts',
    'types.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jest-environment-jsdom',
};

// createJestConfig is exported in this way to ensure that next/jest can load the Next.js configuration, which is async
module.exports = async () => {
  const config = await createJestConfig(customJestConfig)();

  return {
    ...config,
    transform: {
      /* Use babel-jest to transpile tests with the next/babel preset
        https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object */
      '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    },
  };
};
