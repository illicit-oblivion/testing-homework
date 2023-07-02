module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['<rootDir>/test/e2e/**/*.test.js'],
  setupFilesAfterEnv: ['expect-puppeteer'],
};
