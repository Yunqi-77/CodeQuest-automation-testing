import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import {
  createValidRegisterData,
  invalidRegisterInputs,
} from "../../fixtures/auth-test-data";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_006 - Verify minimum characters of password input", async ({
    page,
  }) => {
    const data = {
      ...createValidRegisterData("auth006"),
      password: invalidRegisterInputs.passwordTooShort,
      confirmPassword: invalidRegisterInputs.passwordTooShort,
    };

    const authPage = new AuthPage(page);

    await authPage.gotoLogin();

    // Step 1 - Click "Create account" on the login page.
    await authPage.createAccountLink.click();

    // Step 2 - Enter a password with fewer than 8 characters in
    // "Password (8+ chars)".
    // Step 3 - Fill the same password in "Confirm password".
    // Step 4 - Fill remaining fields with valid values.
    // Step 5 - Click "Create Free Account".
    await authPage.fillRegisterForm(data);
    await authPage.createFreeAccountButton.click();
    await authPage.page.waitForLoadState("networkidle");

    // Expected Result 1 - Form does not submit (still on /register, no
    // redirect to home).
    await expect(page).toHaveURL(/\/register/);

    // Expected Result 2 - Error message "Password must be at least 8 characters." is displayed.
    await expect(authPage.errorMessage).toHaveText(
      "Password must be at least 8 characters.",
    );
  });
});
