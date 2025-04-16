/** @type {import('ts-jest').JestConfigWithTsJest} */
import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  testEnvironment: "node",
  transform: {
    "^.+.ts?$": ["ts-jest", {}],
    "^.+.tsx?$": ["ts-jest", {}],
  },

  clearMocks: true,

  coverageProvider: "v8",

  preset: "@shelf/jest-mongodb",

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ["json", "text", "lcov", "clover"],

  // An array of file extensions your modules use
  moduleFileExtensions: [
    "js",
    "mjs",
    "cjs",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node",
  ],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  // moduleNameMapper: {},

  // An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
  // modulePathIgnorePatterns: [],

  // Run tests from one or more projects
  // projects: undefined,

  // The root directory that Jest should scan for tests and modules within
  // rootDir: undefined,

  // A list of paths to directories that Jest should use to search for files in
  // roots: [
  //   "<rootDir>"
  // ],

  // Allows you to use a custom runner instead of Jest's default test runner
  // runner: "jest-runner",

  // The glob patterns Jest uses to detect test files
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: ["/node_modules/", "\\.pnp\\.[^\\/]+$"],
};

export default config;
