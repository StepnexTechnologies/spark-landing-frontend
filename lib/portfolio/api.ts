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
 * every one of those cases, so there's nothing for a caller to handle. Note the
 * flip side: a shape mismatch degrades just as quietly, so if the backend ever
 * renames a `hero_*` field the hero silently reverts to the placeholder rather
 * than erroring. types/portfolio.ts is the contract to re-check first.
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
