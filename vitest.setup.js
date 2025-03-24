import "@testing-library/jest-dom";
import { vi } from "vitest";

// ✅ Mock `import.meta.env` properly in Vitest
vi.stubGlobal("import.meta", {
  env: {
    VITE_EDAMAM_APP_ID: "test-app-id",
    VITE_EDAMAM_APP_KEY: "test-app-key",
    VITE_API_BASE_URL: "http://localhost:5001",
  },
});
