import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_033 - Verify unauthenticated visitor to /profile is redirected to the login page", async ({
    page,
  }) => {
    const authPage = new AuthPage(page);

    // Step 1 - Navigate directly to /profile without logging in.
    await page.goto("/profile");

    // Expected Result 1 - The login page is displayed by default.
    await expect(page).toHaveURL(/\/login/);
    await expect(authPage.loginHeading).toBeVisible();
  });
});
