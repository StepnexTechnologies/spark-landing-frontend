// How a creator's display name breaks into the stacked title the portfolio hero
// renders — e.g. "JOHN" / "DOE". Ported from the creator-frontend portfolio.
//
// Two splitters share one tokenizer:
//
//   • `splitDisplayNameIntoLines` — character-budget split for a fixed-size
//     fallback.
//   • `fitDisplayNameLines` — measurement-driven split for the hero, which also
//     picks its own font size off a ladder (see `useFittedDisplayName`).
//
// Line breaks happen on TEXT words only — emoji/symbol-only tokens (✨, 🌟,
// decorative punctuation) are glued onto an adjacent word instead of claiming
// their own line. Without this a creator whose display_name is "✨ سعودي
// ريبورترز ✨" stacked into 4 lines (one per space-separated token); now the
// sparkles ride inline with the nearest word.
//
// A word too wide to sit on a line by itself gets broken up: at natural case /
// letter-digit boundaries when it has them ("INDIANFOOD" / "CHANNEL"), and into
// balanced character chunks when it doesn't ("INDIANFOO" / "DCHANNEL"). A
// space-less handle like "IndianFoodChannel" is the reason — it has no
// whitespace to break on, and the title measures to its widest unbreakable word,
// so CSS wrapping never kicks in on its own.

// ─── shared tokenizer ────────────────────────────────────────────────────────

// A token counts as "text" if it has at least one letter or digit; anything else
// (pure emoji/symbols) is decoration that shouldn't force a line break.
const hasText = (token: string) => /\p{L}|\p{N}/u.test(token);

/** The words a title is allowed to break between, with decoration glued on. */
export const toDisplayWords = (displayName: string): string[] => {
  const tokens = displayName.split(/\s+/).filter(Boolean);
  const words: string[] = [];
  let pending = ''; // leading decoration held until the first text word appears

  for (const token of tokens) {
    if (hasText(token)) {
      words.push(pending ? `${pending} ${token}` : token);
      pending = '';
    } else if (words.length > 0) {
      words[words.length - 1] += ` ${token}`;
    } else {
      pending = pending ? `${pending} ${token}` : token;
    }
  }
  // display_name was emoji-only (no text word ever opened a line) — keep it.
  if (pending) words.push(pending);

  return words;
};

// Split by code point, not UTF-16 unit, so a hard chunk never lands in the
// middle of an emoji surrogate pair.
const toChars = (text: string): string[] => Array.from(text);

const LOWER = /\p{Ll}/u;
const UPPER = /\p{Lu}/u;
const LETTER = /\p{L}/u;
const DIGIT = /\p{N}/u;

// Where a single word may be broken when it is too wide to stand on one line.
// Scanned rather than regex-split: a lookbehind split is a SyntaxError on iOS
// Safari < 16.4, and a sentinel-and-split loses the real spaces that decoration
// gluing leaves inside a word.
const isSubWordBoundary = (prev: string, char: string): boolean =>
  (LOWER.test(prev) && UPPER.test(char)) || // camelCase:    Indian|Food
  (LETTER.test(prev) && DIGIT.test(char)) || // letter→digit: Creator|2024
  (DIGIT.test(prev) && LETTER.test(char)); // digit→letter: 24|Seven

/** Sub-word pieces a single word may be broken at, in order. */
const toSubWords = (word: string): string[] => {
  const chars = toChars(word);
  const parts: string[] = [];
  let current = chars[0] ?? '';

  for (let i = 1; i < chars.length; i++) {
    if (isSubWordBoundary(chars[i - 1], chars[i])) {
      parts.push(current);
      current = chars[i];
    } else {
      current += chars[i];
    }
  }
  if (current) parts.push(current);

  return parts;
};

// ─── character-budget split (fixed-size fallback) ────────────────────────────

// Max characters per rendered line. Sized to the narrowest title width (~11
// uppercase bold glyphs) so wrapped lines don't re-overflow. Names at or under
// this length stay on a single line, unchanged.
const MAX_LINE_LENGTH = 11;

// Break a boundary-less run into the fewest near-equal chunks that each fit max
// (e.g. a 17-char word → two 9/8 lines, not an 11/6 split).
const chunkEvenly = (word: string, max: number): string[] => {
  const chars = toChars(word);
  const count = Math.ceil(chars.length / max);
  const size = Math.ceil(chars.length / count);
  const chunks: string[] = [];
  for (let i = 0; i < chars.length; i += size) chunks.push(chars.slice(i, i + size).join(''));
  return chunks;
};

// Wrap one word to <= max chars, preferring sub-word boundaries and
// hard-chunking any sub-word still too long on its own.
const wrapLongWord = (word: string, max: number): string[] => {
  if (toChars(word).length <= max) return [word];

  const lines: string[] = [];
  let current = '';
  for (const part of toSubWords(word)) {
    if (toChars(part).length > max) {
      // Too long to pack even alone — flush what's buffered, then hard-chunk it.
      if (current) lines.push(current);
      current = '';
      lines.push(...chunkEvenly(part, max));
    } else if (!current) {
      current = part;
    } else if (toChars(current).length + toChars(part).length <= max) {
      current += part; // still fits — glued back, since this was one word
    } else {
      lines.push(current);
      current = part;
    }
  }
  if (current) lines.push(current);
  return lines;
};

/** One line per word, wrapping any word too long for a fixed-width title. */
export const splitDisplayNameIntoLines = (displayName: string): string[] =>
  toDisplayWords(displayName).flatMap(word => wrapLongWord(word, MAX_LINE_LENGTH));

// ─── measurement-driven fit (portfolio hero) ─────────────────────────────────
//
// The hero renders the name as large as it can: two lines at the top of the size
// ladder, stepping down a rung whenever those two lines don't fit the title's
// width, and only spilling onto a third line once the ladder runs out. So
// "Chirag Kumar Bansal" is too wide for two lines at 64px, fits them at 54px,
// and lands there — rather than dropping to a third line at full size.

/** Renders the width of `text` at `fontSize`, in px. */
export type MeasureText = (text: string, fontSize: number) => number;

export interface DisplayNameFit {
  /** Font size in px, picked off `sizes`. */
  fontSize: number;
  lines: string[];
}

export interface FitDisplayNameOptions {
  /** Candidate font sizes in px, largest first. */
  sizes: number[];
  /** Content-box width the title has to fit into, in px. */
  maxWidth: number;
  measure: MeasureText;
  /** Lines allowed at the smallest size before the name is truncated. */
  maxLines?: number;
}

// A piece is an atom of a line: a whole word, or a fragment of a word too wide to
// stand on its own. `glued` fragments rejoin without the space a word gets.
interface Piece {
  text: string;
  glued: boolean;
}

const joinPieces = (pieces: Piece[]): string =>
  pieces.map((piece, i) => (i > 0 && !piece.glued ? ' ' : '') + piece.text).join('');

const ELLIPSIS = '…';

// Longest prefix of `chars` (at least one, so callers always make progress) whose
// rendered width fits.
const fittingPrefixLength = (
  chars: string[],
  fontSize: number,
  maxWidth: number,
  measure: MeasureText
): number => {
  let low = 1;
  let high = chars.length;
  let best = 1;
  while (low <= high) {
    const mid = (low + high) >> 1;
    if (measure(chars.slice(0, mid).join(''), fontSize) <= maxWidth) {
      best = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return best;
};

// Boundary-less run that overflows: split into the fewest near-equal chunks that
// each fit, so a 17-char handle breaks 9/8 rather than 14/3. Glyph widths vary,
// so the even split can still overshoot — add a chunk and retry, then fall back
// to greedy prefixes, which always fit.
const chunkToWidth = (
  text: string,
  fontSize: number,
  maxWidth: number,
  measure: MeasureText
): string[] => {
  const chars = toChars(text);
  let count = Math.max(2, Math.ceil(measure(text, fontSize) / maxWidth));

  for (let attempt = 0; attempt < 4 && count <= chars.length; attempt++, count++) {
    const size = Math.ceil(chars.length / count);
    const chunks: string[] = [];
    for (let i = 0; i < chars.length; i += size) chunks.push(chars.slice(i, i + size).join(''));
    if (chunks.every(chunk => measure(chunk, fontSize) <= maxWidth)) return chunks;
  }

  const chunks: string[] = [];
  let rest = chars;
  while (rest.length > 0) {
    const length = fittingPrefixLength(rest, fontSize, maxWidth, measure);
    chunks.push(rest.slice(0, length).join(''));
    rest = rest.slice(length);
  }
  return chunks;
};

// Every word that fits a line stays whole; the ones that don't are broken down
// until each piece fits.
const toPieces = (
  words: string[],
  fontSize: number,
  maxWidth: number,
  measure: MeasureText
): Piece[] =>
  words.flatMap(word => {
    if (measure(word, fontSize) <= maxWidth) return [{ text: word, glued: false }];

    const fragments = toSubWords(word).flatMap(sub =>
      measure(sub, fontSize) <= maxWidth ? [sub] : chunkToWidth(sub, fontSize, maxWidth, measure)
    );
    return fragments.map((text, i) => ({ text, glued: i > 0 }));
  });

// The two-line split whose wider line is narrowest — the layout with the best
// chance of fitting, and the most balanced-looking one when several do. Null when
// no split fits, which is the signal to drop a rung down the ladder.
const bestTwoLineSplit = (
  pieces: Piece[],
  fontSize: number,
  maxWidth: number,
  measure: MeasureText
): string[] | null => {
  if (pieces.length === 1) {
    const [only] = pieces;
    return measure(only.text, fontSize) <= maxWidth ? [only.text] : null;
  }

  let best: { lines: string[]; widest: number } | null = null;
  for (let split = 1; split < pieces.length; split++) {
    const top = joinPieces(pieces.slice(0, split));
    const bottom = joinPieces(pieces.slice(split));
    const widest = Math.max(measure(top, fontSize), measure(bottom, fontSize));
    if (widest > maxWidth) continue;
    // `<=` keeps the later split on a tie, which leaves the extra word on the top
    // line: "CHIRAG KUMAR" / "BANSAL" rather than "CHIRAG" / "KUMAR BANSAL".
    if (!best || widest <= best.widest) best = { lines: [top, bottom], widest };
  }
  return best?.lines ?? null;
};

const packIntoLines = (
  pieces: Piece[],
  fontSize: number,
  maxWidth: number,
  measure: MeasureText
): Piece[][] => {
  const lines: Piece[][] = [];
  let current: Piece[] = [];

  for (const piece of pieces) {
    const candidate = [...current, piece];
    if (current.length > 0 && measure(joinPieces(candidate), fontSize) > maxWidth) {
      lines.push(current);
      current = [piece];
    } else {
      current = candidate;
    }
  }
  if (current.length > 0) lines.push(current);

  return lines;
};

const truncateToWidth = (
  text: string,
  fontSize: number,
  maxWidth: number,
  measure: MeasureText
): string => {
  if (measure(text, fontSize) <= maxWidth) return text;

  const chars = toChars(text);
  let low = 0;
  let high = chars.length;
  let best = ELLIPSIS;
  while (low <= high) {
    const mid = (low + high) >> 1;
    const candidate = chars.slice(0, mid).join('').trimEnd() + ELLIPSIS;
    if (measure(candidate, fontSize) <= maxWidth) {
      best = candidate;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return best;
};

/**
 * Largest ladder size at which the name fits two lines, with the lines to render
 * at it. Falls through to `maxLines` at the smallest size — truncating the last
 * line — when two lines never fit.
 */
export const fitDisplayNameLines = (
  displayName: string,
  { sizes, maxWidth, measure, maxLines = 3 }: FitDisplayNameOptions
): DisplayNameFit => {
  const words = toDisplayWords(displayName);
  const smallest = sizes[sizes.length - 1];
  if (words.length === 0 || maxWidth <= 0) return { fontSize: smallest, lines: words };

  for (const fontSize of sizes) {
    const twoLines = bestTwoLineSplit(
      toPieces(words, fontSize, maxWidth, measure),
      fontSize,
      maxWidth,
      measure
    );
    if (twoLines) return { fontSize, lines: twoLines };
  }

  // Two lines don't fit even at the bottom of the ladder — spill onto further
  // lines, and truncate once past the cap.
  const packed = packIntoLines(
    toPieces(words, smallest, maxWidth, measure),
    smallest,
    maxWidth,
    measure
  );
  if (packed.length <= maxLines) return { fontSize: smallest, lines: packed.map(joinPieces) };

  const kept = packed.slice(0, maxLines - 1).map(joinPieces);
  const overflow = joinPieces(packed.slice(maxLines - 1).flat());
  return {
    fontSize: smallest,
    lines: [...kept, truncateToWidth(overflow, smallest, maxWidth, measure)],
  };
};
