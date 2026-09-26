import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";

const EXISTING_EMAIL = "playersky00@gmail.com";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_021 - Verify login with invalid password", async ({
    page,
  }) => {
    const authPage = new AuthPage(page);

    // Step 1 - Go to the login page.
    await authPage.gotoLogin();

    // Step 2 - Clear the pre-filled demo values.
    await authPage.emailInput.fill("");
    await authPage.passwordInput.fill("");

    // Step 3 - Enter a valid, registered email with an incorrect
    // password.
    await authPage.emailInput.fill(EXISTING_EMAIL);
    await authPage.passwordInput.fill("WrongPass1!");

    // Step 4 - Click "Sign In ->".
    await authPage.signInButton.click();

    // Expected Result 1 - Login is unsuccessful, and the user remains on
    // the login page.
    await expect(page).toHaveURL(/\/login/);

    // Expected Result 2 - Error message "⚠️ Invalid email or password." is displayed.
    await expect(authPage.errorMessage).toHaveText("⚠️ Invalid email or password.");
  });
});
