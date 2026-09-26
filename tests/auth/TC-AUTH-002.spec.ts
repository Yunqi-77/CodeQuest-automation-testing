import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_002 - Verify Google OAuth button visibility on register page", async ({
    page,
  }) => {
    const authPage = new AuthPage(page);

    await authPage.gotoLogin();

    // Step 1 - Click "Create account" in login page.
    await authPage.createAccountLink.click();

    // Step 2 - Locate the "Continue with Google" button, positioned above the "or with email" divider.
    await expect(authPage.googleSignInButton).toBeVisible();
    await expect(authPage.registerDivider).toBeVisible();

    // Expected Result 1 - Button is visible above the "or with email" divider.
    // No aria/DOM ordering attribute to key off, so this compares rendered
    // Y position instead (same approach as expectNavLinkActive in BasePage,
    // which also falls back to a visual check where markup gives no hook).
    const googleButtonBox = await authPage.googleSignInButton.boundingBox();
    const dividerBox = await authPage.registerDivider.boundingBox();
    expect(googleButtonBox).not.toBeNull();
    expect(dividerBox).not.toBeNull();
    expect(googleButtonBox!.y).toBeLessThan(dividerBox!.y);

    // Step 3 - Click it.
    await authPage.googleSignInButton.click();

    // Expected Result 2 - Label changes to "Redirecting..." while the request is pending.
    // NOTE: this is a transient state - if the OAuth redirect (or the
    // failure path below) resolves faster than Playwright's actionability
    // polling, this assertion may not catch the label in time. Revisit
    // with a network-idle wait or a route interception/stub if this proves
    // flaky in CI.
    await expect(authPage.googleSignInButton).toHaveText(/Redirecting/i);

    // Expected Result 3 - If Google OAuth is not configured on the connected
    // Supabase project, the error banner shows the exact message below, and
    // the app does not crash.
    // Adjust once real register error-banner markup is confirmed (see
    // registerErrorBanner comment in AuthPage - shared with TC-AUTH-005/006/etc).
    
    await expect(authPage.errorMessage).toHaveText(
      "Google sign-in is not configured. Use email & password below.",
    );

    // Confirm no crash / unhandled error route was hit.
    await expect(page).not.toHaveURL(/error/i);
  });
});
