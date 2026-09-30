module.exports = {
  displayName: 'shared-graphql-util-generator',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/shared/graphql/util-generator',
  coverageThreshold: {
    global: { statements: 0, branches: 0, lines: 0, functions: 0 },
  },
};
