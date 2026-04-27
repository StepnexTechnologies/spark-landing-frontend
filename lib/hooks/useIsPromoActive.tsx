"use client";

import { useEffect, useState } from "react";
import { isPromoActiveAt } from "@/lib/promo/config";

// Returns true while the configured promo window is active.
// Driven entirely by `PROMO_CONFIG` in `lib/promo/config.ts` — set `enabled: true`
// and configure `start` / `end` there to turn a promo on. Returns false on the
// server and on first render (avoids hydration mismatch on date-dependent UI).
export function useIsPromoActive(): boolean {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isPromoActiveAt());
  }, []);

  return active;
}
