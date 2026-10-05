module.exports = {
  displayName: 'shared-apps-backend-web-data-access-graphql-types',
  preset: '../../../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../../../../coverage/libs/shared/apps/backend/web/data-access-graphql-types',
  coveragePathIgnorePatterns: ['<rootDir>/src/lib/generated/'],
  coverageThreshold: {
    global: { statements: 80, branches: 80, lines: 80, functions: 80 },
  },
};
