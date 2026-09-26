import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import {
  createValidRegisterData,
  invalidRegisterInputs,
} from "../../fixtures/auth-test-data";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_013 - Verify handling of a password consisting only of whitespace", async ({
    page,
  }) => {
    const data = {
      ...createValidRegisterData("auth013"),
      password: invalidRegisterInputs.passwordWhitespaceOnly,
      confirmPassword: invalidRegisterInputs.passwordWhitespaceOnly,
    };

    const authPage = new AuthPage(page);

    await authPage.gotoLogin();

    // Step 1 - Click "Create account" on the login page.
    await authPage.createAccountLink.click();

    // Step 2 - Enter exactly 8 space characters in both "Password (8+
    // chars)" and "Confirm password".
    // Step 3 - Fill remaining fields with valid values.
    // Step 4 - Click "Create Free Account".
    await authPage.fillRegisterForm(data);
    await authPage.createFreeAccountButton.click();

    // Expected Result 1 - Registration is rejected when the password
    // consists only of whitespace (still on /register, no redirect to
    // home).
    // NOTE: the QA test plan flags this case as FAIL - whitespace-only
    // passwords may currently be accepted by the app. This assertion
    // encodes the *expected*, correct behavior, so this test should fail
    // until that bug is fixed.
    await expect(page).toHaveURL(/\/register/);

    // Expected Result 2 - A validation message is displayed.
    // The plan doesn't pin an exact wording for this message, so this
    // just checks that some error indicator is shown.
    await expect(authPage.errorMessage).toHaveText(
      "Passwords should not be blank.",
    );
  });
});
