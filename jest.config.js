module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.(ts|tsx|js)'],
  transformIgnorePatterns: ['node_modules/(?!(@react-native|react-native)/)'],
};
