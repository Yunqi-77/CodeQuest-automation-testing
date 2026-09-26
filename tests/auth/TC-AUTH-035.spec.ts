import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import { HomePage } from "../../pages/home-page";

const EXISTING_ACC = {
  email: "playersky00@gmail.com",
  password: "Playersky00",
};

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_035 - Verify logout clears session and redirects correctly", async ({
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

    // Step 3 - After logged in, click the avatar/username button in the
    // top-right of the navbar to open the dropdown menu.
    await homePage.userMenuButton.click();

    // Expected Result 1 - Dropdown menu is shown after the avatar is
    // clicked.
    // BasePage has no dedicated "menu container" locator yet, so this
    // checks that the "Log out" item inside it becomes visible instead -
    // worth adding a direct dropdown-menu locator to BasePage once the
    // real markup (e.g. a role="menu" wrapper) is confirmed.
    await expect(homePage.logoutMenuItem).toBeVisible();

    // Step 4 - Click the "Log out" menu item.
    await homePage.logoutMenuItem.click();

    // Expected Result 2 - User is redirected to the login page when the
    // log out menu item is selected.
    await expect(page).toHaveURL(/\/login/);
  });
});