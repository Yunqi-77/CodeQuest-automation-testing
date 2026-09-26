import { randomBytes } from "crypto";

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Short random hex suffix, matching the {random_hex} placeholder notation
 * used throughout the QA test plan (e.g. test_{random_hex},
 * test_{random_hex}@example.com). Keeps generated accounts unique across
 * repeated test runs so cases like duplicate-email/duplicate-username
 * checks don't collide with leftover data from a previous run.
 */
export function randomHex(length = 6): string {
  return randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

/**
 * Builds a fresh, valid set of registration data.
 * Pass a `seed` (e.g. "auth003") to get stable, human-readable data that's
 * easy to trace back to a specific test in reports/logs. Leave it blank
 * for a random suffix instead.
 */
export function createValidRegisterData(seed?: string): RegisterFormData {
  const hex = seed ?? randomHex();
  const password = `Test_${hex}!`;

  return {
    username: `test_${hex}`,
    email: `test_${hex}@example.com`,
    password,
    confirmPassword: password,
  };
}

/**
 * Fixed, scenario-specific invalid values called out by the QA test plan.
 * These are deliberately NOT randomized - the plan pins the exact invalid
 * input for each case.
 */
export const invalidRegisterInputs = {
  usernameTooShort: "te",
  usernameInvalidChars: "test@003",
  emailMalformedNoAt: "not-anemail",
  emailMalformedTrailingAt: "test@",
  passwordTooShort: "Pass1",
  passwordMismatch: "Mismatch1!",
  passwordWhitespaceOnly: "        ", // exactly 8 spaces
};
