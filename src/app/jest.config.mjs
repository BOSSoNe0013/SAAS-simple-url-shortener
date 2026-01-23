export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts", "json", "node"],
  testMatch: ["**/tests/**/*.+(ts|tsx)"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      tsconfig: "tsconfig.json",
    }],
  },
  testPathIgnorePatterns: ["/dist/"],
};
