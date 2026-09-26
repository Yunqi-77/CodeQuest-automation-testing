import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import { HomePage } from "../../pages/home-page";

const EXISTING_ACC = {
  email: "playersky00@gmail.com",
  password: "Playersky00",
};

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_036 - Verify behavior when a logged-in user navigates to /login", async ({
    page,
  }) => {

    const authPage = new AuthPage(page);
    const homePage = new HomePage(page);

    // Step 1 - Go to login page.
    await authPage.gotoLogin();

    // Step 2 - Enter valid credentials.
    await authPage.emailInput.fill("");
    await authPage.passwordInput.fill("");
    await authPage.emailInput.fill(EXISTING_ACC.email);
    await authPage.passwordInput.fill(EXISTING_ACC.password);
    await authPage.signInButton.click();
    await page.waitForLoadState("networkidle");
    await expect(homePage.welcomeHeading).toBeVisible();

    // Step 3 - After logged in, manually navigate the browser to /login.
    await authPage.gotoLogin();

    // Expected Result 1 - User is not redirected to the login page.
    await expect(page).not.toHaveURL(/\/login/);

    // Expected Result 2 - Login form is not displayed.
    await expect(authPage.loginHeading).not.toBeVisible();

    // Expected Result 3 - User stays on the homepage.
    await expect(homePage.welcomeHeading).toBeVisible();

  });
});
