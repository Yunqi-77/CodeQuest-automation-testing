import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import { createValidRegisterData } from "../../fixtures/auth-test-data";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_019 - Verify script/HTML input in the username field", async ({
    page,
  }) => {
    const data = {
      ...createValidRegisterData("auth019"),
      username: "<script>alert(1)</script>",
    };

    // Security check - if the raw markup is ever executed instead of
    // being rejected/escaped, a JS dialog would fire. Fail loudly rather
    // than let Playwright hang waiting on an unhandled dialog.
    let dialogAppeared = false;
    page.on("dialog", async (dialog) => {
      dialogAppeared = true;
      await dialog.dismiss();
    });

    const authPage = new AuthPage(page);

    await authPage.gotoLogin();

    // Step 1 - Click "Create account" on the login page.
    await authPage.createAccountLink.click();

    // Step 2 - Enter <script>alert(1)</script> in the Username field,
    // valid values elsewhere.
    // Step 3 - Click "Create Free Account" and observe the error banner.
    await authPage.fillRegisterForm(data);
    await authPage.createFreeAccountButton.click();

    // Expected Result 1 - Form does not submit (still on /register, no
    // redirect to home).
    // NOTE: flagged FAIL in the QA test plan - this test encodes the
    // expected, safe behavior (input rejected and never executed), so it
    // should fail if the underlying issue is still present.
    await expect(page).toHaveURL(/\/register/);

    // Expected Result 2 - A validation message is displayed. The raw
    // string contains characters outside the allowed set, so this should
    // surface the same rule as TC-AUTH-004.
    await expect(
      page.getByText("Username: letters, numbers, underscores only."),
    ).toBeVisible();

    // The script must never execute, regardless of whether it's rejected
    // via this exact message.
    expect(dialogAppeared).toBe(false);
  });
});
