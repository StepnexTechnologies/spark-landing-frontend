// Central config for the site-wide promo (banner + celebration overlay).
//
// To run a new promo:
//   1. Set `enabled: true`
//   2. Set `start` / `end` (end is exclusive — promo runs while `now < end`)
//   3. Update `terms.url` to the new promo's T&C page
//   4. Update `celebration.image` (or set `celebration.enabled: false` to skip the overlay)
//   5. Update `homepageBanner` copy (the homepage footer marquee — not i18n'd)
//   6. Update the `promo.*` keys in `public/locales/<lang>/creatorEarn.json`
//      (drives the creator/earn hero banner copy)
//
// All consumers read from this single object — no other file should hard-code
// promo dates, copy, URLs, or image paths.

export interface PromoConfig {
  enabled: boolean;
  start: Date;
  end: Date;
  terms: {
    url: string;
  };
  celebration: {
    enabled: boolean;
    image: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
  };
  // Homepage footer marquee — not localized (the homepage doesn't run through i18next).
  homepageBanner: {
    headline: string;
    marquee: string;
  };
}

export const PROMO_CONFIG: PromoConfig = {
  enabled: false,
  start: new Date(2026, 3, 20),
  end: new Date(2026, 3, 28),
  terms: {
    // Each promo ships its own T&C page; set this to that page's URL when enabling a promo.
    url: "",
  },
  celebration: {
    enabled: true,
    image: {
      src: "/images/creator/earn/PROMO.png",
      alt: "Promo celebration",
      width: 600,
      height: 600,
    },
  },
  homepageBanner: {
    headline: "Your Freelancer to Founder move — on us!",
    marquee:
      "Send invoice → Get 12 month ₹3600 Pro Plan FREE, only in Creator Week (April 20-26)",
  },
};

export function isPromoActiveAt(date: Date = new Date()): boolean {
  if (!PROMO_CONFIG.enabled) return false;
  return date >= PROMO_CONFIG.start && date < PROMO_CONFIG.end;
}
