import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import { createValidRegisterData } from "../../fixtures/auth-test-data";

// An account that is guaranteed to already exist in the target environment.
const EXISTING_EMAIL = "playersky00@gmail.com";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_014 - Verify duplicate email check is case-insensitive", async ({
    page,
  }) => {

    const authPage = new AuthPage(page);


    const duplicateAttempt = {
      ...createValidRegisterData("auth014b"),
      email: EXISTING_EMAIL.toUpperCase(), // same email, different case
    };

    await authPage.gotoLogin();

    // Step 1 - Click "Create account" on the login page.
    await authPage.createAccountLink.click();

    // Step 2 - Attempt a second registration using the same email in a
    // different case.
    // Step 3 - Click "Create Free Account".
    await authPage.fillRegisterForm(duplicateAttempt);
    await authPage.createFreeAccountButton.click();

    // Expected Result 1 - Form does not submit (still on /register, no
    // redirect to home).
    await expect(page).toHaveURL(/\/register/);

    // Expected Result 2 - Error message "A user with this email address
    // has already been registered" is displayed.
    await expect(authPage.errorMessage).toHaveText(
      "A user with this email address has already been registered.",
    );

  });
});
