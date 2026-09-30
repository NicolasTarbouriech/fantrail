module.exports = {
  displayName: 'backend-web',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/apps/backend/web',
  coverageThreshold: {
    global: { statements: 30, branches: 30, lines: 30, functions: 30 },
  },
};
