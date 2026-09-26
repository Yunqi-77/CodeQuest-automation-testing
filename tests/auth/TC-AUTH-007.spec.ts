import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import {
  createValidRegisterData,
  invalidRegisterInputs,
} from "../../fixtures/auth-test-data";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_007 - Verify mismatched password", async ({ page }) => {
    const data = {
      ...createValidRegisterData("auth007"),
      confirmPassword: invalidRegisterInputs.passwordMismatch,
    };

    const authPage = new AuthPage(page);

    await authPage.gotoLogin();

    // Step 1 - Click "Create account" on the login page.
    await authPage.createAccountLink.click();

    // Step 2 - Enter different values (each >=8 chars) in
    // "Password (8+ chars)" and "Confirm password".
    // Step 3 - Click "Create Free Account".
    await authPage.fillRegisterForm(data);
    await authPage.createFreeAccountButton.click();
    await authPage.page.waitForLoadState("networkidle");
    
    // Expected Result 1 - Form does not submit (still on /register, no
    // redirect to home).
    await expect(page).toHaveURL(/\/register/);

    // Expected Result 2 - Error message "Passwords do not match." is displayed.
    await expect(authPage.errorMessage).toHaveText(
      "Passwords do not match.",
    );
  });
});
