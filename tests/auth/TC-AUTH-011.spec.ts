import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_011 - Verify registration when required fields are left blank", async ({
    page,
  }) => {
    const authPage = new AuthPage(page);

    await authPage.gotoLogin();

    // Step 1 - Click "Create account" on the login page.
    await authPage.createAccountLink.click();

    // Step 2 - Leave all fields empty (default state - nothing is filled
    // in after navigating to the register form).
    // Step 3 - Click "Create Free Account".
    await authPage.createFreeAccountButton.click();

    // Expected Result 1 - Form does not submit (still on /register, no
    // redirect to home).
    await expect(page).toHaveURL(/\/register/);

    // Expected Result 2 - A validation tooltip is displayed (the native
    // browser constraint-validation UI), with no custom in-app error
    // message shown alongside it.
    // Playwright can't see the native tooltip visually, so this checks the
    // underlying constraint-validation API on the first required field
    // instead, which is what actually blocks submission.
    const usernameInvalid = await authPage.usernameInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid,
    );
    expect(usernameInvalid).toBe(true);

    // No custom in-app error message should appear alongside the native tooltip.
    await expect(authPage.errorMessage).not.toBeVisible();
  });
});
