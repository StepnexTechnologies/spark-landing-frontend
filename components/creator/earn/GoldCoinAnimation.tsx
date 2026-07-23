"use client";

import { m, useReducedMotion } from "framer-motion";

interface GoldCoinAnimationProps {
  size?: number;
  // Glyph in the centre of the coin. Defaults to ₹ (used by the legacy /promo
  // floating bar voucher) — the earn hero passes "S" for the Sparkonomy mark.
  symbol?: string;
  // Disables the bob/rotate loop and the corner sparkle. Use for decorative
  // corner coins where a moving glyph next to body copy would be distracting.
  static?: boolean;
}

export default function GoldCoinAnimation({
  size = 56,
  symbol = "₹",
  static: staticCoin = false,
}: GoldCoinAnimationProps = {}) {
  const prefersReducedMotion = useReducedMotion();
  const animate = !prefersReducedMotion && !staticCoin;
  // Tighten the text size when the symbol is more than one character so longer
  // glyphs still fit inside the coin face without clipping the rim.
  const fontSize = symbol.length === 1 ? 22 : 18;

  return (
    <div
      className="relative shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <m.div
        className="relative"
        style={{ width: size, height: size, willChange: "transform" }}
        animate={animate ? { y: [0, -2, 0], rotate: [0, 6, 0, -6, 0] } : undefined}
        transition={animate ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
          <defs>
            <radialGradient id="goldCoinFill" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FFE680" />
              <stop offset="55%" stopColor="#F5B400" />
              <stop offset="100%" stopColor="#8C6500" />
            </radialGradient>
            <linearGradient id="goldCoinRim" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFD24A" />
              <stop offset="100%" stopColor="#7A5500" />
            </linearGradient>
          </defs>

          <circle cx="32" cy="32" r="30" fill="url(#goldCoinRim)" />
          <circle cx="32" cy="32" r="26" fill="url(#goldCoinFill)" />
          <circle cx="32" cy="32" r="20" fill="none" stroke="#B8861A" strokeWidth="1.2" opacity="0.55" />

          <text
            x="32"
            y="40"
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={fontSize}
            fontWeight="800"
            fill="#5B3A00"
          >
            {symbol}
          </text>

          {/* Specular highlight */}
          <ellipse cx="24" cy="22" rx="8" ry="4" fill="#FFFFFF" opacity="0.55" />
        </svg>

        {animate && (
          <m.span
            aria-hidden
            className="absolute -top-1 -right-1 text-[10px]"
            animate={{ opacity: [0, 1, 0], scale: [0.6, 1.1, 0.6] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              repeatDelay: 1.4,
              ease: "easeInOut",
            }}
          >
            ✨
          </m.span>
        )}
      </m.div>
    </div>
  );
}
