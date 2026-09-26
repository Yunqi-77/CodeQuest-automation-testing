import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import { HomePage } from "../../pages/home-page";

const EXISTING_ACC = {
  email: "playersky00@gmail.com",
  password: "Playersky00",
}

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_020 - Verify log in with valid email and password", async ({
    page,
  }) => {

    const authPage = new AuthPage(page);
    const homePage = new HomePage(page);

    // Step 1 - Go to the login page.
    await authPage.gotoLogin();

    // Step 2 - Clear default demo credentials in the fields.
    await authPage.emailInput.fill("");
    await authPage.passwordInput.fill("");

    // Step 3 - Enter the registered account's email and matching
    // password.
    await authPage.emailInput.fill(EXISTING_ACC.email);
    await authPage.passwordInput.fill(EXISTING_ACC.password);

    // Step 4 - Click "Sign In ->".
    await authPage.signInButton.click();
    await page.waitForLoadState("networkidle");

    // Expected Result 1 - User is logged in successfully and directed to
    // the homepage.
    await expect(page).not.toHaveURL(/\/login/);

    // Expected Result 2 - A "Welcome back" message is displayed.
    await expect(homePage.welcomeHeading).toBeVisible();
  });
});
