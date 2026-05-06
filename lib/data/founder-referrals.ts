// Founder-friend referral pairs. Each entry seeds a statically-generated route
// at /creator/<slug>. Add a new pair = append an entry; no UI code changes.
export type FounderReferral = {
  slug: string;
  friend: { name: string; image: string };
  founder: { name: string; image: string; title: string; quote: string };
};

export const FOUNDER_REFERRALS: readonly FounderReferral[] = [
  {
    slug: "guneet-priya",
    friend: {
      name: "Priya",
      image: "/promo/founder-ref/priya.jpg",
    },
    founder: {
      name: "Guneet",
      image: "/promo/founder-ref/guneet.jpg",
      title: "Founder, Sparkonomy",
      quote:
        "Because Priya introduced us - your first year is FREE, on me.",
    },
  },
];

export function getFounderReferral(slug: string): FounderReferral | null {
  return FOUNDER_REFERRALS.find((r) => r.slug === slug) ?? null;
}

export function getAllFounderReferralSlugs(): string[] {
  return FOUNDER_REFERRALS.map((r) => r.slug);
}
