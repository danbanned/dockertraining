import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/app/$1",
  },

  // 👇 Tell Jest ONLY where to look
  roots: ["<rootDir>/app"],

  modulePathIgnorePatterns: [
    "<rootDir>/.next/"
  ],

  testPathIgnorePatterns: [
    "/node_modules/",
    "/.next/"
  ],

  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"]
};

export default createJestConfig(customJestConfig);