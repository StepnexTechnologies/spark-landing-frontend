"use client";

import { useEffect, useState } from "react";
import { fetchPortfolioUserDetails } from "@/lib/portfolio/api";
import type { PortfolioUserDetails } from "@/types/portfolio";

interface PortfolioUserDetailsState {
  data: PortfolioUserDetails | null;
  /** `true` while the request is in flight. `false` when there's no slug to fetch. */
  loading: boolean;
}

/**
 * Fetches the `user_details` section for a public portfolio.
 *
 * This repo has no react-query (unlike creator-frontend, where the equivalent
 * is `usePublicPortfolioSection`), so this is a plain fetch-on-mount hook. The
 * request aborts on unmount and whenever the slug changes, and a stale response
 * can never overwrite a newer one — the `cancelled` guard drops it.
 *
 * Never rejects: `fetchPortfolioUserDetails` maps 404 / timeout / network
 * failure to `null`, which the hero renders as "no creator media" and falls
 * back to the bundled placeholder.
 */
export function usePortfolioUserDetails(
  slug: string | null | undefined,
): PortfolioUserDetailsState {
  const [state, setState] = useState<PortfolioUserDetailsState>({
    data: null,
    loading: Boolean(slug),
  });

  useEffect(() => {
    if (!slug) {
      setState({ data: null, loading: false });
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    setState({ data: null, loading: true });

    fetchPortfolioUserDetails(slug, controller.signal).then((response) => {
      if (cancelled) return;
      setState({ data: response?.data ?? null, loading: false });
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [slug]);

  return state;
}
