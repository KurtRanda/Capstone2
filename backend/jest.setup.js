const jwt = require("jsonwebtoken");
const { TextEncoder, TextDecoder } = require("util");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// ✅ Load environment variables for testing
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env.test") });



// ✅ Mock JWT Token for Tests
const testUser = { id: "test-user-id", email: "test@example.com" };
process.env.TEST_TOKEN = jwt.sign(testUser, "test-secret", { expiresIn: "1h" });
process.env.JWT_SECRET = "test-secret"; // Ensure consistency

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// ✅ Properly Mock `import.meta.env`
Object.defineProperty(global, "import.meta", {
  value: {
    env: {
      VITE_EDAMAM_APP_ID: "test-app-id",
      VITE_EDAMAM_APP_KEY: "test-app-key",
      VITE_API_BASE_URL: "http://localhost:5001",
    },
  },
});
