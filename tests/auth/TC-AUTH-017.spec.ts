import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import { HomePage } from "../../pages/home-page";
import { createValidRegisterData } from "../../fixtures/auth-test-data";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_017 - Verify pressing Enter submits the registration form", async ({
    page,
  }) => {
    const data = createValidRegisterData("auth017");

    const authPage = new AuthPage(page);
    const homePage = new HomePage(page);

    await authPage.gotoLogin();

    // Step 1 - Click "Create account" on the login page.
    await authPage.createAccountLink.click();

    // Step 2 - Fill in valid values for all four fields.
    await authPage.fillRegisterForm(data);

    // Step 3 - Press Enter instead of clicking "Create Free Account".
    await authPage.confirmPasswordInput.press("Enter");
    await page.waitForLoadState("networkidle");

    // Expected Result 1 - Form is submitted and the account is
    // successfully registered (redirected away from /register, to the
    // home page, same success signals as TC-AUTH-001).
    await expect(page).not.toHaveURL(/\/register/);
    await expect(homePage.welcomeHeading).toBeVisible();
    await expect(homePage.profileSummaryCard).toBeVisible();
  });
});
