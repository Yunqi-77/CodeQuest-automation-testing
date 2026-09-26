import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import { createValidRegisterData } from "../../fixtures/auth-test-data";

const EXISTING_EMAIL = "playersky00@gmail.com";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_025 - Verify login when password field is left blank", async ({
    page,
  }) => {
    const authPage = new AuthPage(page);

    // Step 1 - Go to login page.
    await authPage.gotoLogin();

    // Step 2 - Clear the pre-filled password value only.
    await authPage.passwordInput.fill("");

    // Step 3 - Enter a valid email, leave Password empty.
    await authPage.emailInput.fill(EXISTING_EMAIL);

    // Step 4 - Click "Sign In ->".
    await authPage.signInButton.click();

    // Expected Result 1 - The browser prevents form submission and
    // displays a validation tooltip message. Playwright can't see the
    // native tooltip visually, so this checks the underlying
    // constraint-validation API instead, which is what actually blocks
    // submission.
    const passwordInvalid = await authPage.passwordInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid,
    );
    expect(passwordInvalid).toBe(true);

    // Expected Result 2 - Login is unsuccessful (still on /login).
    await expect(page).toHaveURL(/\/login/);
  });
});
