"use client";

import { NAME_LINE_HEIGHT, useFittedDisplayName } from "@/lib/hooks/useFittedDisplayName";

// Top of the size ladder in px. Mirrors the creator-frontend portfolio hero's
// mobile base (64px). Module scope so the hook's deps stay stable across renders.
const BASE_FONT_SIZE = () => 64;

interface PortfolioNameProps {
  displayName: string;
}

// The creator's name, rendered exactly like the portfolio hero: as large as it
// fits on two lines, stepping down the size ladder for longer names, breaking
// space-less handles at sensible boundaries, and truncating with an ellipsis
// once it spills past the line cap. Until measured (SSR / first paint) it renders
// the CSS-sized fallback below — never actually seen, since the first measure
// runs before paint.
export default function PortfolioName({ displayName }: PortfolioNameProps) {
  const { ref, fit, fallbackLines } = useFittedDisplayName(displayName, BASE_FONT_SIZE);
  const lines = fit ? fit.lines : fallbackLines;

  return (
    <h1
      ref={ref}
      style={fit ? { fontSize: `${fit.fontSize}px`, lineHeight: NAME_LINE_HEIGHT } : undefined}
      className="w-full text-center font-extrabold uppercase tracking-tight break-words text-white text-[clamp(2.75rem,15vw,64px)] leading-[0.86] drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]"
    >
      {displayName ? (
        lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))
      ) : (
        <span className="invisible">PLACEHOLDER</span>
      )}
    </h1>
  );
}
