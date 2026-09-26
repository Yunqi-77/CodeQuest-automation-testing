import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import { HomePage } from "../../pages/home-page";
import {
  createValidRegisterData,
  RegisterFormData,
} from "../../fixtures/auth-test-data";

/**
 * Registers one account in its own browser context (so each registration
 * gets an independent, logged-out starting state) and returns the
 * resulting "@handle_xxxx" text from the post-registration homepage.
 */
async function registerAndGetHandle(
  browser: import("@playwright/test").Browser,
  data: RegisterFormData,
): Promise<string | null> {
  const context = await browser.newContext();
  const page = await context.newPage();
  const authPage = new AuthPage(page);
  const homePage = new HomePage(page);

  await authPage.gotoLogin();
  await authPage.createAccountLink.click();
  await authPage.fillRegisterForm(data);
  await authPage.createFreeAccountButton.click();
  await page.waitForLoadState("networkidle");

  const handle = await homePage.profileHandle.textContent();
  await context.close();
  return handle;
}

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_009 - Verify registration with duplicate username", async ({
    browser,
  }) => {
    const registration1 = createValidRegisterData("auth009a");
    const registration2 = {
      ...createValidRegisterData("auth009b"),
      username: registration1.username, // Step 6 - same username as Registration 1
    };

    // Steps 1-5 - Register account 1 with a valid username, email,
    // password, and confirm password.
    const handle1 = await registerAndGetHandle(browser, registration1);

    // Step 6 - Repeat the registration process using the same username
    // with a different valid email address.
    const handle2 = await registerAndGetHandle(browser, registration2);

    // Step 7 - Compare the usernames generated for both accounts.

    // Expected Result 4 - The system should allow registration if all
    // other required information is valid (i.e. neither attempt was
    // blocked outright by the shared username).
    expect(handle1).not.toBeNull();
    expect(handle2).not.toBeNull();

    // Expected Result 1 - System appends a unique/random identifier to the
    // entered username (matches the "_xxxx" suffix pattern seen in
    // TC-AUTH-001's profileHandle assertion).
    const suffixPattern = new RegExp(
      `^@${registration1.username.toLowerCase()}_[0-9a-f]{4}$`,
    );
    expect(handle1).toMatch(suffixPattern);
    expect(handle2).toMatch(suffixPattern);

    // Expected Result 2 / 3 - The generated username is unique per
    // registration; both accounts must not end up with the same final
    // handle despite the identical entered username.
    expect(handle1).not.toEqual(handle2);
  });
});
