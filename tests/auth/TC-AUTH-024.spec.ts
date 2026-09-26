import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import { createValidRegisterData } from "../../fixtures/auth-test-data";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_024 - Verify login when email field is left blank", async ({
    page,
  }) => {
    const data = createValidRegisterData("auth024");

    const authPage = new AuthPage(page);

    // Step 1 - Go to login page.
    await authPage.gotoLogin();

    // Step 2 - Clear the pre-filled email value only.
    await authPage.emailInput.fill("");

    // Step 3 - Leave Email empty, keep/enter a password.
    await authPage.passwordInput.fill(data.password);

    // Step 4 - Click "Sign In ->".
    await authPage.signInButton.click();

    // Expected Result 1 - The browser prevents form submission and
    // displays a validation tooltip message. Playwright can't see the
    // native tooltip visually, so this checks the underlying
    // constraint-validation API instead, which is what actually blocks submission.
    const emailInvalid = await authPage.emailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid,
    );
    expect(emailInvalid).toBe(true);

    // Expected Result 2 - Login is unsuccessful (still on /login).
    await expect(page).toHaveURL(/\/login/);
  });
});
