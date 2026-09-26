import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import { HomePage } from "../../pages/home-page";

const EXISTING_ACC = {
  email: "playersky00@gmail.com",
  password: "Playersky00",
};

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_027 - Verify login email matching is case-insensitive", async ({
    page,
  }) => {

    const authPage = new AuthPage(page);
    const homePage = new HomePage(page);

    await authPage.gotoLogin();

    // Step 1 - Click "Create account" on the login page.
    await authPage.createAccountLink.click();

    // Step 2 - Enter the existing registered email using different letter casing, with the valid password.
    await authPage.emailInput.fill(EXISTING_ACC.email.toUpperCase());
    await authPage.passwordInput.fill(EXISTING_ACC.password);

    // Step 3 - Click "Sign In ->".
    await authPage.signInButton.click();
    await page.waitForLoadState("networkidle");

    // Expected Result 1 - Login is successful.
    // Expected Result 2 - Email address matching is case-insensitive.
    // Expected Result 3 - User is redirected to the homepage.
    await expect(page).not.toHaveURL(/\/login/);
    await expect(homePage.welcomeHeading).toBeVisible();
  });
});
