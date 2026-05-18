"use client";

import { motion } from "framer-motion";
import { Sparkle } from "lucide-react";

interface FlippingCoinProps {
  size: number;
  perspective?: number;
  className?: string;
  // Show the golden shine behind the coin and the twinkle burst. Default true.
  glint?: boolean;
  // 'normal' = 2.5s/rotation, 'fast' = 0.4s/rotation. Interpolated via CSS var.
  spinSpeed?: "normal" | "fast";
  // Duration (ms) over which the spin speed change is interpolated.
  spinTransitionMs?: number;
}

const COIN_FRONT_SRC = "/images/creator/earn/Coin%20front.png";
const COIN_BACK_SRC = "/images/creator/earn/Coin_back.png";

const TWINKLES = [
  { topPct: 12, leftPct: 22, sizeFactor: 0.2, delayMs: 0 },
  { topPct: 28, leftPct: 84, sizeFactor: 0.24, delayMs: 80 },
  { topPct: 64, leftPct: 8, sizeFactor: 0.16, delayMs: 160 },
  { topPct: 78, leftPct: 70, sizeFactor: 0.2, delayMs: 40 },
  { topPct: -2, leftPct: 56, sizeFactor: 0.14, delayMs: 220 },
  { topPct: 50, leftPct: 104, sizeFactor: 0.13, delayMs: 120 },
  { topPct: 102, leftPct: 38, sizeFactor: 0.15, delayMs: 200 },
] as const;

export default function FlippingCoin({
  size,
  perspective = 400,
  className,
  glint = true,
  spinSpeed = "normal",
  spinTransitionMs = 600,
}: FlippingCoinProps) {
  const isFast = spinSpeed === "fast";

  return (
    <div
      className={`relative flex-shrink-0 ${className ?? ""}`}
      style={{ perspective: `${perspective}px`, width: size, height: size }}
    >
      {glint && !isFast && (
        <div
          aria-hidden
          className="pointer-events-none absolute animate-coin-shine rounded-full"
          style={{
            top: "-50%",
            left: "-50%",
            right: "-50%",
            bottom: "-50%",
            background:
              "radial-gradient(circle, rgba(255,232,160,0.65) 0%, rgba(255,205,90,0.4) 20%, rgba(241,182,39,0.2) 42%, rgba(241,182,39,0.07) 65%, rgba(241,182,39,0) 92%)",
            filter: "blur(8px)",
          }}
        />
      )}
      <motion.div
        className="animate-coin-flip w-full h-full relative [transform-style:preserve-3d]"
        style={{ animationDuration: "var(--coin-duration, 2.5s)" }}
        initial={{ ["--coin-duration" as string]: isFast ? "0.4s" : "2.5s" }}
        animate={{ ["--coin-duration" as string]: isFast ? "0.4s" : "2.5s" }}
        transition={{ duration: spinTransitionMs / 1000, ease: "easeIn" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={COIN_FRONT_SRC}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-contain"
          style={{ backfaceVisibility: "hidden" }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={COIN_BACK_SRC}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-contain"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        />
      </motion.div>
      {glint &&
        !isFast &&
        TWINKLES.map((t, i) => {
          const tSize = Math.max(6, Math.round(size * t.sizeFactor));
          return (
            <span
              key={i}
              aria-hidden
              className="pointer-events-none absolute text-[#FFE8A0] animate-coin-twinkle"
              style={{
                top: `${t.topPct}%`,
                left: `${t.leftPct}%`,
                width: tSize,
                height: tSize,
                marginTop: -tSize / 2,
                marginLeft: -tSize / 2,
                animationDelay: `${t.delayMs}ms`,
                filter: "drop-shadow(0 0 4px rgba(255,210,90,0.85))",
              }}
            >
              <Sparkle className="w-full h-full fill-current" strokeWidth={0} />
            </span>
          );
        })}
    </div>
  );
}
