import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_023 - Verify Google OAuth button on login page", async ({
    page,
  }) => {
    const authPage = new AuthPage(page);

    // Step 1 - Go to login page.
    await authPage.gotoLogin();

    // Step 2 - Locate the "Continue with Google" button and click it.
    await expect(authPage.googleSignInButton).toBeVisible();
    await expect(authPage.loginDivider).toBeVisible();

    // Expected Result 1 - Button is visible above the "or sign in with
    // email" divider. No ordering attribute to key off, so this compares
    // rendered Y position (same fallback used in TC-AUTH-002).
    const googleButtonBox = await authPage.googleSignInButton.boundingBox();
    const dividerBox = await authPage.loginDivider.boundingBox();
    expect(googleButtonBox).not.toBeNull();
    expect(dividerBox).not.toBeNull();
    expect(googleButtonBox!.y).toBeLessThan(dividerBox!.y);

    await authPage.googleSignInButton.click();

    // Expected Result 2 - Label changes to "Connecting..." while the
    // request is pending.
    // NOTE: flagged FAIL in the QA test plan. Also a transient state -
    // same caveat as TC-AUTH-002's "Redirecting..." check: if the request
    // resolves faster than Playwright's polling catches it, this may need
    // a network stub to be reliable in CI.
    await expect(authPage.googleSignInButton).toHaveText(/Connecting/i);

    // Expected Result 3 - If Google OAuth is not configured on the
    // connected Supabase project, the error banner shows the exact
    // message below, with no crash.
    await expect(
      page.getByText(
        "Google sign-in is not configured. Use email & password below.",
      ),
    ).toBeVisible();

    // Confirm no crash / unhandled error route was hit.
    await expect(page).not.toHaveURL(/error/i);
  });
});
