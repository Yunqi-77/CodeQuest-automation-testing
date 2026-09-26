import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Page Object for the CodeQuest authenticated homepage (/).
 *
 * The track cards are a repeated component (45+ of them across several
 * category sections), so rather than declaring one Locator per card,
 * this class exposes helper methods that key off stable, content-based
 * attributes (the card's `title` attribute, and label text for stats).
 */
export class HomePage extends BasePage {

  // ==================== WELCOME / PROFILE SUMMARY ====================
  readonly welcomeHeading: Locator;      // "Welcome back, <username>"
  readonly profileSummaryCard: Locator;  // the glass-card wrapping avatar/stats
  readonly profileDisplayName: Locator;  // h2 inside the summary card
  readonly profileHandle: Locator;       // "@handle" span
  readonly levelProgressLabel: Locator;  // "Level 1 → 2"

  // ==================== CONTINUE LEARNING ====================
  readonly continueLearningHeading: Locator;
  readonly viewAllTracksLink: Locator;   // "View all →"
  readonly categoryFilterButtons: Locator;   // all pill buttons (All Tracks, Fundamentals, ...)

  // ==================== FOOTER ====================
  readonly courseCountSummary: Locator;  // "45 total courses · 45 available now · ..."

  constructor(page: Page) {
    super(page);

    // ---- Welcome / profile summary ----
    // Username is dynamic, so match on the fixed "Welcome back," prefix only.
    this.welcomeHeading = page.getByRole('heading', { name: /Welcome back,/ });
    this.profileSummaryCard = page.locator('.glass-card').filter({ hasText: '@' }).first();
    this.profileDisplayName = this.profileSummaryCard.locator('h2');
    this.profileHandle = this.profileSummaryCard.locator('span', { hasText: '@' }).first();
    this.levelProgressLabel = page.getByText(/Level \d+ → \d+/);

    // ---- Continue Learning ----
    this.continueLearningHeading = page.getByRole('heading', { name: 'Continue Learning' });
    this.viewAllTracksLink = page.getByRole('link', { name: /View all/ });
    this.categoryFilterButtons = page.locator('section').first().getByRole('button');

    // ---- Footer ----
    this.courseCountSummary = page.getByText(/total courses/);
  }

  async gotoHome() {
    await this.page.goto('/');
  }

  /** One of the pill filter buttons above the track grid, e.g. "Backend", "Databases". */
  categoryFilterButton(label: string): Locator {
    return this.categoryFilterButtons.filter({ hasText: label });
  }

  /** One numeric stat box in the profile summary (e.g. "Total XP", "Day Streak"). */
  statValue(label: string): Locator {
    return this.profileSummaryCard
      .locator('div')
      .filter({ hasText: label })
      .locator('div')
      .first();
  }

  /** A category section heading, e.g. "Security", "Fundamentals" (shows "N course(s)"). */
  categorySectionHeading(category: string): Locator {
    return this.page.locator('.category-header').filter({ hasText: category }).getByRole('heading');
  }

  /** The number of courses shown next to a category heading, e.g. "1 course". */
  categorySectionCount(category: string): Locator {
    return this.page
      .locator('.category-header')
      .filter({ hasText: category })
      .getByText(/course/);
  }

  /**
   * A track card by its title attribute, e.g. trackCard('JavaScript'), trackCard('HTML').
   * Matches the outer <a href="/tracks/..."> so `.click()` navigates as expected.
   */
  trackCard(name: string): Locator {
    return this.page.locator(`a:has(.track-card[title="${name}"])`);
  }

  trackCardBadge(name: string): Locator {
    // Difficulty pill, e.g. "Beginner" / "Intermediate", inside the card.
    return this.trackCard(name).locator('.track-card span').filter({ hasText: /Beginner|Intermediate|Advanced/ });
  }

  trackCardDescription(name: string): Locator {
    return this.trackCard(name).locator('p');
  }

  trackCardDuration(name: string): Locator {
    return this.trackCard(name).getByText(/^~\d+h$/);
  }

  trackCardLearnerCount(name: string): Locator {
    return this.trackCard(name).locator('svg.lucide-users + *, span:has(svg.lucide-users)').last();
  }

  trackCardStartButton(name: string): Locator {
    return this.trackCard(name).getByText('Start');
  }
}