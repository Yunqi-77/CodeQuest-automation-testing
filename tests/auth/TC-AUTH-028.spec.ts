import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";

const EXISTING_ACC = {
  email: "playersky00@gmail.com",
  password: "Playersky00",
};

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_028 - Verify leading or trailing whitespace from email during login", async ({
    page,
  }) => {

    const authPage = new AuthPage(page);

    // Step 1 - Go to login page.
    await authPage.gotoLogin();

    // Step 2 - Clear pre-filled values.
    await authPage.emailInput.fill("");
    await authPage.passwordInput.fill("");

    // Step 3 - Enter a valid email with leading/trailing spaces and its
    // correct password.
    await authPage.emailInput.fill(`  ${EXISTING_ACC.email}  `);
    await authPage.passwordInput.fill(EXISTING_ACC.password);

    // Step 4 - Click "Sign In ->".
    await authPage.signInButton.click();

    // Expected Result 1 - Spacing is trimmed automatically (no native
    // validation error on the email field).
    const emailInvalid = await authPage.emailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid,
    );
    expect(emailInvalid).toBe(false);

    // Expected Result 2 - Login is successful (navigated away from /login).
    await expect(page).not.toHaveURL(/\/login/);
  });
});