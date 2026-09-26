import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Page Object for the CodeQuest /profile page.
 * Shares the same navbar + profile-summary-card layout as HomePage,
 * plus two page-specific panels: Achievements and Recent Activity.
 *
 * NOTE: the navbar locators here duplicate HomePage's — worth pulling
 * both into a shared NavbarComponent once you have 3+ authenticated
 * pages, so nav changes only need updating in one place.
 */
export class ProfilePage extends BasePage {

  // ==================== PAGE HEADING ====================
  readonly pageHeading: Locator;         // "My Profile"

  // ==================== PROFILE SUMMARY CARD ====================
  readonly profileSummaryCard: Locator;
  readonly avatarImage: Locator;
  readonly avatarLevelBadge: Locator;    // level number badge overlaid on the avatar
  readonly displayName: Locator;         // h2, e.g. "playersky00"
  readonly handle: Locator;              // "@yunqi_fae5"
  readonly rankBadge: Locator;           // "Beginner" / "Intermediate" / etc pill
  readonly levelProgressLabel: Locator;  // "Level 1 → 2"
  readonly xpToGoLabel: Locator;         // "100 XP to go"

  // ==================== ACHIEVEMENTS PANEL ====================
  readonly achievementsHeading: Locator;
  readonly achievementsEmptyTitle: Locator;    // "No achievements yet"
  readonly achievementsEmptySubtitle: Locator; // "Complete lessons to unlock them!"

  // ==================== RECENT ACTIVITY PANEL ====================
  readonly recentActivityHeading: Locator;
  readonly recentActivityEmptyTitle: Locator;    // "No activity yet"
  readonly recentActivityEmptySubtitle: Locator; // "Start a lesson to see your progress!"

  constructor(page: Page) {
    super(page);

    // ---- Page heading ----
    this.pageHeading = page.getByRole('heading', { name: 'My Profile' });

    // ---- Profile summary card ----
    this.profileSummaryCard = page.locator('.glass-card').filter({ hasText: '@' }).first();
    this.avatarImage = this.profileSummaryCard.locator('img');
    this.avatarLevelBadge = this.profileSummaryCard.locator('.level-badge');
    // Username/handle are dynamic per account, so scope structurally rather than by text.
    this.displayName = this.profileSummaryCard.locator('h2');
    this.handle = this.profileSummaryCard.locator('span', { hasText: '@' }).first();
    this.rankBadge = this.profileSummaryCard.getByText(/Beginner|Intermediate|Advanced|Expert/);
    this.levelProgressLabel = this.profileSummaryCard.getByText(/Level \d+ → \d+/);
    this.xpToGoLabel = this.profileSummaryCard.getByText(/XP to go/);

    // ---- Achievements panel ----
    const achievementsPanel = page.locator('.glass-card').filter({ hasText: 'Achievements' });
    this.achievementsHeading = achievementsPanel.getByRole('heading', { name: 'Achievements' });
    this.achievementsEmptyTitle = achievementsPanel.getByText('No achievements yet');
    this.achievementsEmptySubtitle = achievementsPanel.getByText('Complete lessons to unlock them!');

    // ---- Recent Activity panel ----
    const activityPanel = page.locator('.glass-card').filter({ hasText: 'Recent Activity' });
    this.recentActivityHeading = activityPanel.getByRole('heading', { name: 'Recent Activity' });
    this.recentActivityEmptyTitle = activityPanel.getByText('No activity yet');
    this.recentActivityEmptySubtitle = activityPanel.getByText('Start a lesson to see your progress!');
  }

  async gotoProfile() {
    await this.page.goto('/profile');
  }

  /** One numeric stat box in the profile summary (e.g. "Total XP", "Day Streak"). */
  statValue(label: string): Locator {
    return this.profileSummaryCard
      .locator('div')
      .filter({ hasText: label })
      .locator('div')
      .first();
  }
}