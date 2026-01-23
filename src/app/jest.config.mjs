export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts", "json", "node"],
  testMatch: ["**/tests/**/*\\.spec\\.(ts|tsx)"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      tsconfig: "tsconfig.json",
    }],
  },
  testPathIgnorePatterns: ["/dist/", "/src/domain/entities/"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/*.ts",
    "!src/scripts/*.ts",
    "!src/**/*.entity.ts",
    "!src/**/*.dto.ts",
    "!src/**/*.module.ts"
  ]
};
