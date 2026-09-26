import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import { HomePage } from "../../pages/home-page";
import { BasePage } from "../../pages/base-page";
import { createValidRegisterData } from "../../fixtures/auth-test-data";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_001 - Verify registration with valid username, email, and matching passwords", async ({
    page,
  }) => {
    const data = createValidRegisterData("auth001");

    const basePage = new BasePage(page);
    const authPage = new AuthPage(page);
    const homePage = new HomePage(page);

    await authPage.gotoLogin();

    // Step 1 - Click "Create account" in login page.
    await authPage.createAccountLink.click();

    // Step 2 - Fill in the "Username" field, "Email address" field, "Password (8+ chars)" field, and "Confirm password" field with matching, valid values.
    await authPage.fillRegisterForm(data);

    // Step 3 - Click the "Create Free Account" button.
    await authPage.createFreeAccountButton.click();
    await authPage.page.waitForLoadState("networkidle");

    // Expected Result 1 - Registration is completed successfully.
    // Expected Result 2 - User is automatically signed in.
    // Expected Result 3 - App redirects to the home page.
    await expect(homePage.page).not.toHaveURL(/\/login/);
    await basePage.expectNavLinkActive(homePage.homeNavLink);

    // Expected Result 4 - Welcome back message, the user's account information, learning section are displayed.
    await expect(homePage.welcomeHeading).toBeVisible();
    await expect(homePage.profileSummaryCard).toBeVisible();
    await expect(homePage.continueLearningHeading).toBeVisible();

    // Expected Result 5 - Account name is displayed correctly based on the registered email address.
    const expectedDisplayName = data.email.split("@")[0];
    await expect(homePage.profileDisplayName).toHaveText(expectedDisplayName);

    // Expected Result 6 - Username is displayed in lowercase regardless of the capitalisation used
    // during registration, with a random suffix appended by the app (e.g. "@testuser00002_a1b2").
    await expect(homePage.profileHandle).toHaveText(
      new RegExp(`^@${data.username.toLowerCase()}_[0-9a-f]{4}$`),
    );
  });
});
