import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base-page";

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export class AuthPage extends BasePage {
  // ==================== LOGIN PAGE ====================
  readonly loginHeading: Locator; // "Welcome back, hero"
  readonly loginSubheading: Locator; // "Continue your coding quest"
  readonly loginDivider: Locator; // "or sign in with email"

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly forgotPasswordLink: Locator; // "Forgot?"
  readonly signInButton: Locator; // "Sign In →"

  readonly createAccountLink: Locator; // "New here? Create account"

  // ==================== REGISTER PAGE ====================
  readonly registerHeading: Locator; // "Start your journey"
  readonly registerSubheading: Locator; // "Free forever · No credit card needed"
  readonly registerDivider: Locator; // "or with email"

  readonly usernameInput: Locator;
  readonly registerEmailInput: Locator;
  readonly registerPasswordInput: Locator; // "Password (8+ chars)"
  readonly confirmPasswordInput: Locator; // "Confirm password"
  readonly passwordVisibilityToggle: Locator; // eye icon, password field only
  readonly createFreeAccountButton: Locator; // "Create Free Account"

  readonly errorMessage: Locator;
  readonly loginLink: Locator; // "Already have an account? Log in"

  // ==================== SHARED ====================
  readonly googleSignInButton: Locator; // "Continue with Google" (both pages)

  constructor(page: Page) {
    super(page);

    // ---- Login page ----
    this.loginHeading = page.getByRole("heading", {
      name: "Welcome back, hero",
    });
    this.loginSubheading = page.getByText("Continue your coding quest");
    this.loginDivider = page.getByText("or sign in with email");

    // No id/name/data-testid on these inputs, so type + autocomplete
    // attributes are currently the most stable selectors available.
    this.emailInput = page.locator('input[type="email"][autocomplete="email"]');
    this.passwordInput = page.locator(
      'input[type="password"][autocomplete="current-password"]',
    );
    this.forgotPasswordLink = page.getByRole("link", { name: "Forgot?" });
    this.signInButton = page.getByRole("button", { name: /Sign In/ });

    this.createAccountLink = page.getByRole("link", { name: "Create account" });

    // ---- Register page ----
    this.registerHeading = page.getByRole("heading", {
      name: "Start your journey",
    });
    this.registerSubheading = page.getByText("Free forever");
    this.registerDivider = page.getByText("or with email");

    // Register inputs DO have distinct, human-readable placeholders,
    // so getByPlaceholder is more robust here than attribute matching.
    this.usernameInput = page.getByPlaceholder("Username");
    this.registerEmailInput = page.getByPlaceholder("Email address");
    this.registerPasswordInput = page.getByPlaceholder("Password (8+ chars)");
    this.confirmPasswordInput = page.getByPlaceholder("Confirm password");

    // Only the Password field has a visibility toggle (Confirm password does not).
    // Scope to the wrapping div so we don't accidentally grab an unrelated button.
    this.passwordVisibilityToggle = page
      .locator("form button")
      .filter({ has: page.locator("svg.lucide") })
      .first();
    this.createFreeAccountButton = page.getByRole("button", {
      name: "Create Free Account",
    });

    this.errorMessage = page.locator(
      '.auth-container div[style*="239, 68, 68"]',
    );
    this.loginLink = page.getByRole("link", { name: "Log in" });

    // ---- Shared ----
    this.googleSignInButton = page.getByRole("button", {
      name: "Continue with Google",
    });
  }

  async gotoLogin() {
    await this.page.goto("/login");
  }

  async fillRegisterForm(data: RegisterFormData) {
    await this.usernameInput.fill(data.username);
    await this.registerEmailInput.fill(data.email);
    await this.registerPasswordInput.fill(data.password);
    await this.confirmPasswordInput.fill(data.confirmPassword);
  }
}
