module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/tests/**',
    '!jest.config.js'
  ],
  coverageReporters: ['text', 'lcov', 'clover'],
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: '.',
      outputName: 'junit.xml',
      suiteName: 'Backend Tests'
    }]
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 30000
};










