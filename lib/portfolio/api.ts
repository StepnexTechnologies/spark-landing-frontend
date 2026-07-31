import type { PortfolioUserDetailsResponse } from "@/types/portfolio";

// 10s matches the other API helpers in this repo (lib/auth/fetch.ts,
// lib/hooks/useSubmitEmail.tsx) so failure-mode UX is consistent.
const TIMEOUT_MS = 10_000;

/**
 * `GET /v1/portfolios/{slug}/sections/user_details` — the public portfolio
 * section that carries the hero backdrop media (video / still / poster /
 * focal point) plus the creator's display name and headline.
 *
 * Public endpoint: no auth, no cookies — hence no `credentials: "include"`
 * (mirrors `axiosInstancePublic` in creator-frontend, which sets
 * `withCredentials: false`). The slug is the only input; the route accepts
 * either a UUID or a slug.
 *
 * Returns `null` rather than throwing when the portfolio doesn't exist, the
 * request times out, or the network fails — the hero has a placeholder for
 * every one of those cases, so there's nothing for a caller to handle.
 *
 * TO CHECK: only exercised against a 404 so far. The response shape below is
 * taken from the creator app's contract (SectionEnvelope<'user_details',
 * UserDetailsData>) rather than from an observed 200 on this host — verify a
 * real slug returns `{ data: { hero_video_url, ... } }` and that the field
 * names still match types/portfolio.ts. Because every failure collapses to
 * `null`, a shape mismatch degrades quietly to the placeholder clip.
 */
export async function fetchPortfolioUserDetails(
  slug: string,
  signal?: AbortSignal,
): Promise<PortfolioUserDetailsResponse | null> {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  if (!base || !slug) return null;

  // Compose the caller's signal (unmount / slug change) with our own timeout so
  // either can abort the request.
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort);
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(
      `${base}/v1/portfolios/${encodeURIComponent(slug)}/sections/user_details`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      },
    );

    // 404 = no such portfolio (or the section isn't confirmed yet). Treated the
    // same as "no media" — the placeholder clip covers it.
    if (!res.ok) return null;

    const parsed = (await res.json()) as PortfolioUserDetailsResponse;
    return parsed?.data ? parsed : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener("abort", onAbort);
  }
}
