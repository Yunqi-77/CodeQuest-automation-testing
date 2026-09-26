import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import { HomePage } from "../../pages/home-page";
import { createValidRegisterData } from "../../fixtures/auth-test-data";

const EXISTING_ACC = {
  email: "playersky00@gmail.com",
  password: "Playersky00",
};

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_030 - Verify pressing Enter submits the login form", async ({
    page,
  }) => {

    const authPage = new AuthPage(page);
    const homePage = new HomePage(page);

    // Step 1 - Go to login page.
    await authPage.gotoLogin();

    // Step 2 - Clear pre-filled values.
    await authPage.emailInput.fill("");
    await authPage.passwordInput.fill("");

    // Step 3 - Enter valid credentials.
    await authPage.emailInput.fill(EXISTING_ACC.email);
    await authPage.passwordInput.fill(EXISTING_ACC.password);

    // Step 4 - Press Enter instead of clicking "Sign In →".
    await authPage.passwordInput.press("Enter");
    await page.waitForLoadState("networkidle");

    // Expected Result 1 - Login is successful.
    // Expected Result 2 - User is redirected to the homepage.
    await expect(page).not.toHaveURL(/\/login/);
    await expect(homePage.welcomeHeading).toBeVisible();
  });
});
