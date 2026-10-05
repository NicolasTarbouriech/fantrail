module.exports = {
  displayName: 'spa-admin',
  preset: '../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/apps/spa/admin',
  coveragePathIgnorePatterns: ['<rootDir>/src/services/generated/'],
  coverageThreshold: {
    global: { statements: 80, branches: 80, lines: 80, functions: 80 },
  },
};
