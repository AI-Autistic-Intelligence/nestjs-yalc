module.exports = {
  rootDir: '.',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/__tests__/**/*.spec.ts'],
  setupFiles: ['reflect-metadata'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/src/__tests__/tsconfig.json',
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@nest-yalc-2/([^/]+)$': '<rootDir>/../../../$1/src/index.ts',
    '^@nest-yalc-2/([^/]+)/(.*)\\.js$': '<rootDir>/../../../$1/src/$2.ts',
  },
};
