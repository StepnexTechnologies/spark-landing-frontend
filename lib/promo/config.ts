// Central config for the site-wide promo banner.
//
// To run a new promo:
//   1. Leave `enabled: true` (manual kill-switch — flip to `false` to force-disable
//      regardless of dates; useful for testing or pulling a live promo).
//   2. Set `start` / `end`. The promo auto-activates at 00:00:00 on `start` and
//      auto-deactivates after 23:59:59.999 on `end` (both inclusive). Use the
//      `dateRange()` helper below so you don't have to remember the time fields.
//   3. Update `terms.url` to the new promo's T&C page
//   4. Update `homepageBanner` copy (the homepage footer banner — not i18n'd)
//   5. Update the `promo.*` keys in `public/locales/<lang>/creatorEarn.json`
//      (drives the creator/earn hero banner copy)
//
// All consumers read from this single object — no other file should hard-code
// promo dates, copy, or URLs.

export interface PromoConfig {
  enabled: boolean;
  start: Date;
  end: Date;
  terms: {
    url: string;
  };
  // Homepage footer banner — not localized (the homepage doesn't run through i18next).
  homepageBanner: {
    headline: string;
    subheadline: string;
  };
}

// Builds an inclusive [start-of-day, end-of-day] window from calendar dates so
// callers don't have to remember to set times. Months are 0-indexed (Jan = 0).
function dateRange(
  start: { year: number; month: number; day: number },
  end: { year: number; month: number; day: number },
): { start: Date; end: Date } {
  return {
    start: new Date(start.year, start.month, start.day, 0, 0, 0, 0),
    end: new Date(end.year, end.month, end.day, 23, 59, 59, 999),
  };
}

// Summer Sign-up Daily Vouchers Promo: 2nd May 2026 – 31st May 2026.
const SUMMER_SIGNUP_WINDOW = dateRange(
  { year: 2026, month: 3, day: 1 },
  { year: 2026, month: 4, day: 31 },
);

export const PROMO_CONFIG: PromoConfig = {
  enabled: true,
  start: SUMMER_SIGNUP_WINDOW.start,
  end: SUMMER_SIGNUP_WINDOW.end,
  terms: {
    // Each promo ships its own T&C page; set this to that page's URL when enabling a promo.
    url: "/summer-promo/terms",
  },
  homepageBanner: {
    headline: "Work happens in Hinglish. Why is invoicing still in English?",
    subheadline: "Introducing India's first Hinglish invoicing for creators",
  },
};

export function isPromoActiveAt(date: Date = new Date()): boolean {
  if (!PROMO_CONFIG.enabled) return false;
  return date >= PROMO_CONFIG.start && date <= PROMO_CONFIG.end;
}
