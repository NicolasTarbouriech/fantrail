module.exports = {
  displayName: 'shared-tooling-util-environment',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../../coverage/libs/shared/tooling/util-environment',
  coverageThreshold: {
    global: { statements: 80, branches: 80, lines: 80, functions: 80 },
  },
};
