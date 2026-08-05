/**
 * HTML entity decoding for WordPress-sourced text.
 *
 * The WP REST API returns `title.rendered` / `excerpt.rendered` as HTML, so an
 * apostrophe arrives as `&#8217;`. That is fine when the string is fed to
 * `dangerouslySetInnerHTML`, but anywhere we render it as plain text (React
 * text nodes, breadcrumbs, `metadata`, JSON-LD, `alt`/`title` attributes) the
 * entity leaks through literally as "Creator&#8217;s".
 */

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  // Plain space rather than U+00A0 — these strings end up in meta tags and
  // truncated labels where a non-breaking space is more trouble than it's worth.
  nbsp: " ",
  ensp: " ",
  emsp: " ",
  thinsp: " ",
  shy: "",
  hellip: "…",
  rsquo: "’",
  lsquo: "‘",
  sbquo: "‚",
  rdquo: "”",
  ldquo: "“",
  bdquo: "„",
  ndash: "–",
  mdash: "—",
  minus: "−",
  bull: "•",
  middot: "·",
  copy: "©",
  reg: "®",
  trade: "™",
  euro: "€",
  pound: "£",
  yen: "¥",
  cent: "¢",
  deg: "°",
  laquo: "«",
  raquo: "»",
  times: "×",
  divide: "÷",
  plusmn: "±",
  frac12: "½",
  frac14: "¼",
  frac34: "¾",
  dagger: "†",
  permil: "‰",
  prime: "′",
  Prime: "″",
  larr: "←",
  rarr: "→",
  uarr: "↑",
  darr: "↓",
  harr: "↔",
  infin: "∞",
  ne: "≠",
  le: "≤",
  ge: "≥",
};

/**
 * Decode HTML entities in a string. Handles every numeric/hex entity plus the
 * named entities WordPress actually emits.
 *
 * Single pass on purpose: decoding `&amp;` and `&#38;` in separate passes would
 * turn double-encoded input like `&amp;lt;` into a real `<`.
 */
export function decodeEntities(text: string): string {
  return text.replace(
    /&(#[Xx][0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g,
    (match, body: string) => {
      if (body[0] === "#") {
        const isHex = body[1] === "x" || body[1] === "X";
        const code = parseInt(isHex ? body.slice(2) : body.slice(1), isHex ? 16 : 10);
        // Reject out-of-range and surrogate code points — String.fromCodePoint
        // throws on those, and a malformed entity shouldn't crash a page render.
        if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return match;
        if (code >= 0xd800 && code <= 0xdfff) return match;
        return String.fromCodePoint(code);
      }
      return NAMED_ENTITIES[body] ?? match;
    }
  );
}

/**
 * Strip HTML tags and decode entities, leaving plain text safe to render as a
 * React text node or drop into `metadata`.
 */
export function htmlToText(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, ""));
}
