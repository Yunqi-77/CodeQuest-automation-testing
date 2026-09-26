import test, { expect } from "@playwright/test";
import { AuthPage } from "../../pages/auth-page";
import { createValidRegisterData } from "../../fixtures/auth-test-data";

test.describe("CodeQuest Authentication", () => {
  test("TC_AUTH_010 - Verify password visibility toggle on register form", async ({
    page,
  }) => {
    const data = createValidRegisterData("auth010");

    const authPage = new AuthPage(page);

    await authPage.gotoLogin();

    // Step 1 - Click "Create account" on the login page.
    await authPage.createAccountLink.click();

    // Step 2 - Enter a value in "Password (8+ chars)" and the same value
    // in "Confirm password".
    await authPage.registerPasswordInput.fill(data.password);
    await authPage.confirmPasswordInput.fill(data.confirmPassword);

    // Sanity check - masked by default before any toggle click.
    await expect(authPage.registerPasswordInput).toHaveAttribute(
      "type",
      "password",
    );

    // Step 3 (first click) - Click the eye icon inside the Password field
    // once.
    await authPage.passwordVisibilityToggle.click();

    // Expected Result 1 - The password visibility toggle icon changes from
    // Eye -> EyeOff, and the actual password is displayed.
    await expect(authPage.registerPasswordInput).toHaveAttribute(
      "type",
      "text",
    );
    // Icon-name assumption based on the lucide-react class pattern already
    // used elsewhere in the page objects (e.g. HomePage's
    // "svg.lucide-users" for the learner-count icon) - adjust this
    // selector if the real "EyeOff" icon uses a different class.
    await expect(
      authPage.passwordVisibilityToggle.locator("svg.lucide-eye-off"),
    ).toBeVisible();

    // Step 3 (second click) - Click it again.
    await authPage.passwordVisibilityToggle.click();

    // Expected Result 2 - When clicked again, the icon changes from
    // EyeOff -> Eye, and the password is masked.
    await expect(authPage.registerPasswordInput).toHaveAttribute(
      "type",
      "password",
    );
    await expect(
      authPage.passwordVisibilityToggle.locator("svg.lucide-eye"),
    ).toBeVisible();
  });
});
