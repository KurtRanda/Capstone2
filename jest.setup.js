import { TextEncoder, TextDecoder } from "util";
import jwt from "jsonwebtoken";

const testUser = { id: "test-user-id", email: "test@example.com" };
process.env.TEST_TOKEN = jwt.sign(testUser, "test-secret", { expiresIn: "1h" });

process.env.JWT_SECRET = "test-secret"; // Ensure it's consistent across tests

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock environment variables for testing
process.env.VITE_EDAMAM_APP_ID = "test-app-id";
process.env.VITE_EDAMAM_APP_KEY = "test-app-key";
process.env.JWT_SECRET = "test-secret";
process.env.TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci1pZCIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTc0MjMxMjYyMiwiZXhwIjoxNzQyMzE2MjIyfQ.CzC9BQXzeAS3ioPEfK8-3AXNmpFP2laO0sCz585SHuk"; // Replace with a valid test token

// Ensure Jest recognizes custom environment variables
import "@testing-library/jest-dom";