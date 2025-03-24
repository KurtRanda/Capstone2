const path = require("path");
require("dotenv").config({ path: "./backend/.env.test" });

module.exports = {
  testEnvironment: "node",
  testMatch: [path.join(__dirname, "tests/**/*.test.js")], // ✅ Ensures correct path
  verbose: true,
  moduleFileExtensions: ["js", "json"],
  transformIgnorePatterns: ["/node_modules/"],
  setupFiles: [path.resolve(__dirname, "jest.setup.js")], // ✅ Uses absolute path
};

