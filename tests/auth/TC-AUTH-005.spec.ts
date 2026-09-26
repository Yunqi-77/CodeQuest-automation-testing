import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import {
  createValidRegisterData,
  invalidRegisterInputs,
} from "../../fixtures/auth-test-data";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_005 - Verify format validation of email input", async ({
    page,
  }) => {
    const baseData = createValidRegisterData("auth005");

    const authPage = new AuthPage(page);

    await authPage.gotoLogin();

    // Step 1 - Click "Create account" on the login page.
    await authPage.createAccountLink.click();

    // Step 2 - Enter "not-anemail" in the "Email address" field.
    // Step 3 - Fill the remaining fields with valid values.
    await authPage.fillRegisterForm({
      ...baseData,
      email: invalidRegisterInputs.emailMalformedNoAt,
    });

    // Step 4 - Click "Create Free Account".
    await authPage.createFreeAccountButton.click();
    await authPage.page.waitForLoadState("networkidle");

    // Expected Result 1 - Registration is rejected when an improperly
    // formatted email is entered.
    // Expected Result 3 - No registration request is submitted and no
    // account is created (still on /register, no redirect to home).
    await expect(page).toHaveURL(/\/register/);

    // Expected Result 2 - The browser's native email validation is
    // triggered. Playwright/the DOM has no visibility into the native
    // tooltip itself, so this checks the underlying constraint-validation
    // API state instead, which is what actually blocks submission.
    const firstAttemptInvalid = await authPage.registerEmailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid,
    );
    expect(firstAttemptInvalid).toBe(true);

    // Step 5 - Repeat the registration attempt using "test@" as the email
    // address.
    await authPage.registerEmailInput.fill(
      invalidRegisterInputs.emailMalformedTrailingAt,
    );
    await authPage.createFreeAccountButton.click();
    await authPage.page.waitForLoadState("networkidle");
    
    // Expected Result 1 / 3 (repeat) - still rejected, still on /register.
    await expect(page).toHaveURL(/\/register/);

    // Expected Result 2 (repeat) - native validation triggered again.
    const secondAttemptInvalid = await authPage.registerEmailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid,
    );
    expect(secondAttemptInvalid).toBe(true);
  });
});
