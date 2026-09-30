module.exports = {
  displayName: 'shared-database-data-access-main',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../../coverage/libs/shared/database/data-access-main',
  coverageThreshold: {
    global: { statements: 0, branches: 0, lines: 0, functions: 0 },
  },
};
