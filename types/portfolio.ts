// Types for the public portfolio API (`/v1/portfolios/{slug}/sections/...`).
//
// This is the same backend surface the creator app reads
// (creator-frontend/src/types/publicPortfolio.ts). Only the `user_details`
// section is modelled here — it's all the landing page's claim flow needs.
// Keep the field names in sync with that file if the backend contract moves.

/** Every section endpoint returns its payload inside this envelope. */
export interface PortfolioSectionEnvelope<T extends string, D> {
  section_type: T;
  display_order: number;
  data: D;
  confirmed_at: string;
}

export interface PortfolioUserDetails {
  display_name: string;
  headline: string;
  location: string;
  /** Whether the creator has already claimed this portfolio. */
  is_claimed?: boolean;
  // Hero backdrop media (public GCS URLs). All optional — absent means fall
  // back down the chain in components/creator/portfolio/HeroSection.tsx.
  hero_image_url?: string | null;
  hero_video_url?: string | null;
  hero_video_poster_url?: string | null;
  /** Normalised 0–1 coordinates → CSS `object-position` on the hero media. */
  hero_focal_point?: { x: number; y: number } | null;
  hero_source?: "auto" | "manual";
}

export type PortfolioUserDetailsResponse = PortfolioSectionEnvelope<
  "user_details",
  PortfolioUserDetails
>;
