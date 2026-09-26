import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_029 - Verify 'New here? Create account' link", async ({
    page,
  }) => {
    const authPage = new AuthPage(page);

    // Step 1 - Go to login page.
    await authPage.gotoLogin();

    // Step 2 - Locate and click the "Create account" link at the bottom,
    // in the sentence "New here? Create account".
    await authPage.createAccountLink.click();

    // Expected Result 1 - User is redirected to the register page.
    await expect(page).toHaveURL(/\/register/);

    // Expected Result 2 - Register form is displayed.
    await expect(authPage.registerHeading).toBeVisible();
    await expect(authPage.usernameInput).toBeVisible();
    await expect(authPage.registerEmailInput).toBeVisible();
    await expect(authPage.registerPasswordInput).toBeVisible();
    await expect(authPage.confirmPasswordInput).toBeVisible();
    await expect(authPage.createFreeAccountButton).toBeVisible();
  });
});
