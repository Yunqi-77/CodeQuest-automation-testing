import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_032 - Verify unauthenticated visitor to / is redirected to the login page", async ({
    page,
  }) => {
    const authPage = new AuthPage(page);

    // Step 1 - Navigate to / without logging in. A fresh test page's
    // default browser context has no existing session.
    await page.goto("/");

    // Step 2 - Observe whether the public hero section renders, or
    // whether you get redirected.

    // Expected Result 1 - The login page is displayed by default; no
    // public landing page is shown to unauthenticated visitors.
    await expect(page).toHaveURL(/\/login/);
    await expect(authPage.loginHeading).toBeVisible();
  });
});
