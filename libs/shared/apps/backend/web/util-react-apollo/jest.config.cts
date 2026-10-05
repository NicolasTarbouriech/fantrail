module.exports = {
  displayName: 'shared-apps-backend-web-util-react-apollo',
  preset: '../../../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../../../../coverage/libs/shared/apps/backend/web/util-react-apollo',
  coverageThreshold: {
    global: { statements: 80, branches: 80, lines: 80, functions: 80 },
  },
};
