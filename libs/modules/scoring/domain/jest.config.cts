module.exports = {
  displayName: 'modules-scoring-domain',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/modules/scoring/domain',
  coveragePathIgnorePatterns: ['<rootDir>/src/lib/testing/'],
  coverageThreshold: {
    global: { statements: 100, branches: 100, lines: 100, functions: 100 },
  },
};
