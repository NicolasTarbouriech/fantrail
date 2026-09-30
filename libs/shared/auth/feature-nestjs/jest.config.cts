module.exports = {
  displayName: 'shared-auth-feature-nestjs',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/shared/auth/feature-nestjs',
  coveragePathIgnorePatterns: ['<rootDir>/src/lib/testing.ts'],
  coverageThreshold: {
    global: { statements: 90, branches: 90, lines: 90, functions: 90 },
  },
};
