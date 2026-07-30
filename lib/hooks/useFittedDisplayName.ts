import { useCallback, useRef, useState } from 'react';
import {
  fitDisplayNameLines,
  splitDisplayNameIntoLines,
  type DisplayNameFit,
} from '@/lib/portfolio/displayName';
import { useRemeasure } from '@/lib/hooks/useRemeasure';
import { createLineWidthMeasurer, getContentWidth } from '@/lib/portfolio/textMeasurement';

// The hero title's size ladder, as ratios of the base size: 64 → 54 → 44px on
// mobile. Ratios rather than fixed px so the desktop title, whose base is a
// viewport-derived size, steps down by the same proportions.
const SIZE_RATIOS = [1, 54 / 64, 44 / 64];

// Tight enough that a name reads as one stacked block. Matches the leading the
// title had at its largest fixed size (55px at 64px), and scales with each rung.
export const NAME_LINE_HEIGHT = 0.86;

const isSameFit = (a: DisplayNameFit | null, b: DisplayNameFit): boolean =>
  a !== null &&
  a.fontSize === b.fontSize &&
  a.lines.length === b.lines.length &&
  a.lines.every((line, i) => line === b.lines[i]);

/**
 * Sizes a creator's display name to the title it's rendered in: as large as it
 * can be on two lines, stepping down the ladder when they don't fit and only
 * spilling to a third line once the ladder runs out (see `fitDisplayNameLines`).
 *
 * Attach `ref` to the title element — it supplies both the width to fit into and
 * the font to measure with, so it must be the element the lines render in.
 *
 * `fit` is null until measured, which is the caller's cue to render its own
 * CSS-sized fallback. The first measurement runs before paint, so that fallback
 * is never actually seen.
 *
 * @param resolveBaseFontSize maps the title's content width to the top of the
 *   ladder. Must be referentially stable — declare it at module scope.
 */
export const useFittedDisplayName = (
  displayName: string,
  resolveBaseFontSize: (contentWidth: number) => number
) => {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const [fit, setFit] = useState<DisplayNameFit | null>(null);

  const remeasure = useCallback(() => {
    const title = ref.current;
    if (!title || !displayName) {
      setFit(null);
      return;
    }

    const maxWidth = getContentWidth(title);
    if (!(maxWidth > 0)) {
      setFit(null); // laid out at zero width — leave the CSS fallback in place
      return;
    }

    const measure = createLineWidthMeasurer(title);
    try {
      const base = resolveBaseFontSize(maxWidth);
      const next = fitDisplayNameLines(displayName, {
        sizes: SIZE_RATIOS.map(ratio => base * ratio),
        maxWidth,
        measure,
      });
      // Same result → same object, so a resize that doesn't change the outcome
      // (including the ResizeObserver's own initial callback) doesn't re-render.
      setFit(previous => (isSameFit(previous, next) ? previous : next));
    } finally {
      measure.dispose();
    }
  }, [displayName, resolveBaseFontSize]);

  useRemeasure(ref, remeasure);

  return {
    ref,
    fit,
    /** Pre-measurement lines, so the title still paints if measuring can't run. */
    fallbackLines: splitDisplayNameIntoLines(displayName),
  };
};
