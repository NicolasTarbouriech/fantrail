module.exports = {
  displayName: 'modules-user-infrastructure',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/modules/user/infrastructure',
  coverageThreshold: {
    global: { statements: 80, branches: 80, lines: 80, functions: 80 },
  },
};
