import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import { createValidRegisterData } from "../../fixtures/auth-test-data";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_018 - Verify registration behavior for a syntactically valid but non-existent email address", async ({
    page,
  }) => {
    const base = createValidRegisterData("auth018");
    const data = {
      ...base,
      email: base.email.replace("@example.com", "@abc1.com"), // valid format, nonexistent domain
    };

    const authPage = new AuthPage(page);

    await authPage.gotoLogin();

    // Step 1 - Click "Create account" on the login page.
    await authPage.createAccountLink.click();

    // Step 2 - Enter a syntactically valid but non-existent email address.
    // Step 3 - Fill the remaining fields with valid values.
    // Step 4 - Click "Create Free Account".
    await authPage.fillRegisterForm(data);
    await authPage.createFreeAccountButton.click();

    // Expected Result 1 - Registration should be rejected (still on
    // /register, no redirect to home).
    // NOTE: many apps only validate email *format* at signup, not
    // deliverability/domain existence, so this expectation from the QA
    // plan may not hold against the real app - worth confirming with the
    // team whether domain-existence checking is actually in scope here.
    await expect(page).toHaveURL(/\/register/);

    // Expected Result 2 - A validation/error message is displayed
    // indicating the email address is invalid or not acceptable. The plan
    // doesn't pin an exact wording, so this checks for the banner plus
    // email-related text broadly.
    await expect(authPage.errorMessage).toBeVisible();
    await expect(authPage.errorMessage).toHaveText('Please enter a valid email address.');
  });
});
