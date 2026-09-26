import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import { HomePage } from "../../pages/home-page";

const EXISTING_ACC = {
  email: "playersky00@gmail.com",
  password: "Playersky00",
};

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_034 - Verify session persists after tab refresh", async ({
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

    // Step 3 - Refresh the browser tab.
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Expected Result 1 - User remains logged in after the refresh.
    // Expected Result 2 - The homepage reloads with the session intact.
    await expect(page).not.toHaveURL(/\/login/);
    await expect(homePage.welcomeHeading).toBeVisible();
  });
});
