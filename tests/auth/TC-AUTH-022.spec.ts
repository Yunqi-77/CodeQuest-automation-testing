import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import { createValidRegisterData } from "../../fixtures/auth-test-data";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_022 - Verify login with non-existent email", async ({
    page,
  }) => {
    const data = createValidRegisterData("auth022");
    // Reuses the fixture's format/password but points at an email that
    // was never actually registered.
    const nonExistentEmail = data.email.replace("test_", "doesnotexist_");

    const authPage = new AuthPage(page);

    // Step 1 - Go to login page.
    await authPage.gotoLogin();

    // Step 2 - Clear the pre-filled demo values.
    await authPage.emailInput.fill("");
    await authPage.passwordInput.fill("");

    // Step 3 - Enter an email not associated with any account, and any
    // password.
    await authPage.emailInput.fill(nonExistentEmail);
    await authPage.passwordInput.fill(data.password);

    // Step 4 - Click "Sign In ->".
    await authPage.signInButton.click();

    // Expected Result 1 - Login is unsuccessful, and the user remains on
    // the login page.
    await expect(page).toHaveURL(/\/login/);

    // Expected Result 2 - Error message "⚠️ Invalid email or password." is displayed.
    await expect(authPage.errorMessage).toHaveText("⚠️ Invalid email or password.");
  });
});
