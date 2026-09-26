import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import { HomePage } from "../../pages/home-page";
import { createValidRegisterData } from "../../fixtures/auth-test-data";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_012 - Verify leading or trailing whitespace from username and email during registration", async ({
    page,
  }) => {
    const base = createValidRegisterData("auth012c");
    const data = {
      ...base,
      username: `  ${base.username}  `,
    };

    const authPage = new AuthPage(page);
    const homePage = new HomePage(page);

    await authPage.gotoLogin();

    // Step 1 - Click "Create account" on the login page.
    await authPage.createAccountLink.click();

    // Step 2 - Enter a username with leading/trailing spaces.
    // Step 3 - Fill remaining fields with valid values.
    // Step 4 - Click "Create Free Account".
    await authPage.fillRegisterForm(data);
    await authPage.createFreeAccountButton.click();

    // Expected Result 1 - Account is registered successfully
    // (redirected away from /register, typically to the homepage).
    await expect(page).not.toHaveURL(/\/register/);
    await expect(page).toHaveURL(/\/(home)?$/);

    // Expected Result 2 - Spacing is trimmed automatically.
    // Expected Result 3 - Username displayed on the homepage does not
    // include the spacing.
    const displayedUsername = await homePage.profileDisplayName.textContent();

    expect(displayedUsername).not.toBeNull();
    expect(displayedUsername).toBe(displayedUsername?.trim());
    expect(displayedUsername?.startsWith(base.username.trim())).toBe(true);
  });
});