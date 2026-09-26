import { expect, Locator, Page } from "@playwright/test";

/**
 * Base class for all authenticated CodeQuest pages.
 * Holds the navbar locators shared by Home, Profile, Tracks, and
 * Leaderboard, since they all render the same <header>.
 */
export class BasePage {
  readonly page: Page;

  // ==================== NAVBAR (shared across authenticated pages) ====================
  readonly logoLink: Locator;            // "CodeQuest" brand link -> "/"
  readonly homeNavLink: Locator;
  readonly tracksNavLink: Locator;
  readonly leaderboardNavLink: Locator;
  readonly profileNavLink: Locator;
  readonly navLevelBadge: Locator;       // small level number badge next to the XP bar
  readonly navXpLabel: Locator;          // "0 XP" text next to the level badge
  readonly navXpBarFill: Locator;        // the filled portion of the mini XP bar
  // Username/avatar are dynamic per account, so this targets the single
  // button in the navbar rather than matching on text.
  readonly userMenuButton: Locator;
  // "Log out" item inside the dropdown opened by userMenuButton.
  // Assumed to render as a plain button rather than a proper
  // role="menuitem" - adjust once the real dropdown markup is confirmed.
  readonly logoutMenuItem: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logoLink = page.locator("header").getByRole("link", { name: "CodeQuest" });
    this.homeNavLink = page.locator("header").getByRole("link", { name: "Home" });
    this.tracksNavLink = page.locator("header").getByRole("link", { name: "Tracks" });
    this.leaderboardNavLink = page.locator("header").getByRole("link", { name: "Leaderboard" });
    this.profileNavLink = page.locator("header").getByRole("link", { name: "Profile" });
    this.navLevelBadge = page.locator("header .level-badge");
    this.navXpLabel = page.locator("header").getByText(/^\d+ XP$/);
    this.navXpBarFill = page.locator("header .xp-bar-fill");
    this.userMenuButton = page.locator("header").getByRole("button");
    this.logoutMenuItem = page.getByRole("button", { name: "Log out" });
  }

  /**
   * Asserts that the given nav link is the currently "active" one.
   * The app has no `aria-current`/active class to key off — active vs.
   * inactive is purely an inline-style difference, so this checks the
   * computed background color that the active link renders with.
   * (Ideally get engineering to add `aria-current="page"` to the active
   * link instead — more robust, and better for accessibility too.)
   */
  async expectNavLinkActive(link: Locator) {
    await expect(link).toHaveCSS("background-color", "rgba(124, 58, 237, 0.2)");
  }

  async expectNavLinkInactive(link: Locator) {
    await expect(link).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  }

  /**
   * Opens the navbar user menu and clicks "Log out". Callers should await
   * whatever the app does afterward (e.g. redirect to /login) as needed.
   */
  async logout() {
    await this.userMenuButton.click();
    await this.logoutMenuItem.click();
  }
}