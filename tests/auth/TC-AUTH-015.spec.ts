import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import { HomePage } from "../../pages/home-page";
import { createValidRegisterData } from "../../fixtures/auth-test-data";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_015 - Verify handling of an excessively long username value", async ({
    page,
  }) => {
    const data = {
      ...createValidRegisterData("auth015"),
      username: "a".repeat(101), // well beyond typical length
    };

    const authPage = new AuthPage(page);
    const homePage = new HomePage(page);

    await authPage.gotoLogin();

    // Step 1 - Click "Create account" on the login page.
    await authPage.createAccountLink.click();

    // Step 2 - Enter a username well beyond typical length (100+
    // characters).
    // Step 3 - Click "Create Free Account".
    await authPage.fillRegisterForm(data);
    await authPage.createFreeAccountButton.click();
    await page.waitForLoadState("networkidle");

    // Expected Result 1 - The account is created successfully (redirected
    // away from /register, to the home page).
    await expect(page).not.toHaveURL(/\/register/);
    await expect(homePage.welcomeHeading).toBeVisible();

    // Expected Result 2 - The long username is displayed properly and
    // fits within the designated column without affecting the layout.
    // NOTE: the QA test plan flags this case as FAIL - long usernames
    // currently appear to break the layout. This assertion encodes the
    // *expected*, correct behavior, so this test should fail until that
    // bug is fixed.
    await expect(homePage.profileHandle).toBeVisible();

    const handleBox = await homePage.profileHandle.boundingBox();
    const cardBox = await homePage.profileSummaryCard.boundingBox();
    expect(handleBox).not.toBeNull();
    expect(cardBox).not.toBeNull();

    // The handle's right edge should stay within its containing card's
    // right edge - if the long value overflows, the box extends past it.
    expect(handleBox!.x + handleBox!.width).toBeLessThanOrEqual(
      cardBox!.x + cardBox!.width + 1, // +1px tolerance for sub-pixel rounding
    );

    // No horizontal scrollbar should appear on the page as a side effect
    // of the long value.
    const hasHorizontalOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});
