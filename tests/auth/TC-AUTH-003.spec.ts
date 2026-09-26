import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import {
  createValidRegisterData,
  invalidRegisterInputs,
} from "../../fixtures/auth-test-data";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_003 - Verify minimum characters of username input", async ({
    page,
  }) => {
    const data = {
      ...createValidRegisterData("auth003"),
      username: invalidRegisterInputs.usernameTooShort,
    };

    const authPage = new AuthPage(page);

    await authPage.gotoLogin();

    // Step 1 - Click "Create account" in login page.
    await authPage.createAccountLink.click();

    // Step 2 - Enter a 1-2 character value in the "Username" field.
    // Step 3 - Fill the remaining fields with otherwise-valid values and
    // click "Create Free Account".
    await authPage.fillRegisterForm(data);
    await authPage.createFreeAccountButton.click();
    await authPage.page.waitForLoadState("networkidle");

    // Expected Result 1 - Form does not submit (still on /register, no
    // redirect to home).
    await expect(page).toHaveURL(/\/register/);

    // Expected Result 2 - Error message "Username must be at least 3 characters." is displayed.
    await expect(authPage.errorMessage).toHaveText(
      "Username must be at least 3 characters.",
    );
  });
});
