module.exports = {
  displayName: 'modules-scoring-application',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/modules/scoring/application',
  coverageThreshold: {
    global: { statements: 90, branches: 90, lines: 90, functions: 90 },
  },
};
