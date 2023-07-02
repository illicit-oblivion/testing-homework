module.exports = {
  preset: 'ts-jest',
  testMatch: ['<rootDir>/test/unit/**/*.test.{ts,tsx}'],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
