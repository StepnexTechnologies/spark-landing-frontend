import { useEffect, useLayoutEffect, type RefObject } from 'react';

/**
 * Runs `remeasure` before the browser paints, then again whenever the measured
 * element is resized or the webfont finishes loading. Ported from the
 * creator-frontend portfolio.
 *
 * Measuring before paint is what keeps a fitted size from flashing: the element
 * renders once at its CSS fallback size, gets corrected in the layout effect, and
 * only then reaches the screen.
 *
 * `remeasure` must be referentially stable (wrap it in `useCallback`) — it is the
 * effect's dependency.
 */
export const useRemeasure = (ref: RefObject<HTMLElement | null>, remeasure: () => void): void => {
  useLayoutEffect(remeasure, [remeasure]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    const run = () => {
      if (!cancelled) remeasure();
    };

    // The title uses a webfont: the first measurement can land on fallback
    // metrics, which are wide enough to shrink text that would have fit at full
    // size. Re-measure once the real font is ready.
    if (typeof document !== 'undefined' && 'fonts' in document) {
      void document.fonts.ready.then(run);
    }

    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(run);
    observer?.observe(el);

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [ref, remeasure]);
};
