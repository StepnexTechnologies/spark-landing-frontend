// Off-screen text measurement: what a string *would* render as, at a size it
// isn't currently rendered at. Used to size text to its content — pick the
// largest font size a name still fits in (see `useFittedDisplayName`).
// Ported from the creator-frontend portfolio.
//
// The measurer clones the font off the real element the text renders in —
// family, weight, casing, letter-spacing, wrapping — so it lands on the same
// glyph widths the user sees. Cloning beats reconstructing a canvas font string:
// `tracking-tighter`, `uppercase` and the webfont's real metrics come for free.
//
// Measurements are cached per (size, text). Callers must `dispose()` when done.

/** Measures `text` at `fontSize` — width in px, or line count, per the factory. */
export interface TextMeasurer {
  (text: string, fontSize: number): number;
  dispose: () => void;
}

const OFFSCREEN = 'position:fixed;top:-9999px;left:0;visibility:hidden;pointer-events:none;';

/** Content-box width — what the text actually has to fit into. */
export const getContentWidth = (el: HTMLElement): number => {
  const style = window.getComputedStyle(el);
  return el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
};

// Line-height as a ratio of font size, so it keeps scaling as sizes are tried.
// `normal` doesn't resolve to a number — fall back to a typical ratio.
const getLineHeightRatio = (style: CSSStyleDeclaration): number => {
  const lineHeight = parseFloat(style.lineHeight);
  const fontSize = parseFloat(style.fontSize);
  return Number.isFinite(lineHeight) && fontSize > 0 ? lineHeight / fontSize : 1.2;
};

const createNode = (source: HTMLElement, css: string): HTMLElement => {
  const style = window.getComputedStyle(source);
  const node = document.createElement('div');
  node.setAttribute('aria-hidden', 'true');
  node.style.cssText = OFFSCREEN + css;

  node.style.fontFamily = style.fontFamily;
  node.style.fontWeight = style.fontWeight;
  node.style.fontStyle = style.fontStyle;
  node.style.fontStretch = style.fontStretch;
  node.style.textTransform = style.textTransform;
  node.style.wordBreak = style.wordBreak;
  node.style.overflowWrap = style.overflowWrap;

  // Computed letter-spacing is px, resolved against the source's *current* font
  // size. Re-express it in em so it keeps scaling as each size is tried.
  const letterSpacing = parseFloat(style.letterSpacing);
  const fontSize = parseFloat(style.fontSize);
  node.style.letterSpacing =
    Number.isFinite(letterSpacing) && fontSize > 0 ? `${letterSpacing / fontSize}em` : 'normal';

  document.body.appendChild(node);
  return node;
};

const withCache = (
  node: HTMLElement,
  measure: (text: string, fontSize: number) => number
): TextMeasurer => {
  const cache = new Map<string, number>();

  const measurer = (text: string, fontSize: number): number => {
    const key = `${fontSize}|${text}`;
    const cached = cache.get(key);
    if (cached !== undefined) return cached;

    const measured = measure(text, fontSize);
    cache.set(key, measured);
    return measured;
  };
  measurer.dispose = () => node.remove();

  return measurer;
};

/** Rendered width of `text` on a single unwrapped line, in px. */
export const createLineWidthMeasurer = (source: HTMLElement): TextMeasurer => {
  const node = createNode(source, 'white-space:pre;');

  return withCache(node, (text, fontSize) => {
    node.style.fontSize = `${fontSize}px`;
    node.textContent = text;
    return node.getBoundingClientRect().width;
  });
};

/** How many lines `text` wraps to inside `source`'s width. */
export const createLineCountMeasurer = (source: HTMLElement): TextMeasurer => {
  const ratio = getLineHeightRatio(window.getComputedStyle(source));
  const node = createNode(
    source,
    `white-space:normal;width:${getContentWidth(source)}px;line-height:${ratio};`
  );

  return withCache(node, (text, fontSize) => {
    node.style.fontSize = `${fontSize}px`;
    node.textContent = text;
    // A bare block of text is exactly `lines × line-height` tall.
    return Math.round(node.getBoundingClientRect().height / (fontSize * ratio));
  });
};
