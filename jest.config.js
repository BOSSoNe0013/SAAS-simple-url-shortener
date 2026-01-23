export default {
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      diagnostics: false,
    }],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testEnvironment: "node",
};
