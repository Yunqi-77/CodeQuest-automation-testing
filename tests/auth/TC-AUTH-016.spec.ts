import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_016 - Verify 'Already have an account? Log in' link", async ({
    page,
  }) => {
    const authPage = new AuthPage(page);

    await authPage.gotoLogin();

    // Step 1 - Click "Create account" on the login page.
    await authPage.createAccountLink.click();

    // Step 2 - Click the "Log in" link at the bottom, in the sentence
    // "Already have an account? Log in".
    await authPage.loginLink.click();

    // Expected Result 1 - User is successfully navigated to the login
    // page.
    await expect(page).toHaveURL(/\/login/);

    // Expected Result 2 - Login form is displayed.
    await expect(authPage.loginHeading).toBeVisible();
    await expect(authPage.emailInput).toBeVisible();
    await expect(authPage.passwordInput).toBeVisible();
    await expect(authPage.signInButton).toBeVisible();
  });
});
