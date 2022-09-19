module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/pages/',
    '<rootDir>/src/tests/',
    'constants.ts',
    'types.ts',
    '<rootDir>/src/domain/auth/userManager.ts',
    '<rootDir>/src/domain/auth/callbackComponent/CallbackComponent.tsx',
    '<rootDir>/src/domain/auth/hooks/useAuth.ts',
    '<rootDir>/src/domain/auth/hooks/useApiToken.ts',
    '<rootDir>/src/domain/auth/oidcCallback/OidcCallback.tsx',
    '<rootDir>/src/domain/auth/silentCallback/SilentCallback.tsx',
    '<rootDir>/src/utils/getPageHeaderHeight.ts',
    '<rootDir>/src/utils/mockAuthContextValue.ts',
    '<rootDir>/src/utils/mockDataUtils.ts',
    '<rootDir>/src/utils/testUtils.ts',
  ],
  moduleNameMapper: {
    /* Handle CSS imports (with CSS modules)
      https://jestjs.io/docs/webpack#mocking-css-modules */
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/src/__mocks__/styleMock.js',

    /* Handle image imports
      https://jestjs.io/docs/webpack#handling-static-assets */
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  testEnvironment: 'jsdom',
  transform: {
    /* Use babel-jest to transpile tests with the next/babel preset
      https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object */
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
};
