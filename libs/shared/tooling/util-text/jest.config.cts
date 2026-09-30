module.exports = {
  displayName: 'shared-tooling-util-text',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/shared/tooling/util-text',
  coverageThreshold: {
    global: { statements: 100, branches: 100, lines: 100, functions: 100 },
  },
};
