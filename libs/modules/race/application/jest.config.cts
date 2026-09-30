module.exports = {
  displayName: 'modules-race-application',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/modules/race/application',
  coverageThreshold: {
    global: { statements: 90, branches: 90, lines: 90, functions: 90 },
  },
};
