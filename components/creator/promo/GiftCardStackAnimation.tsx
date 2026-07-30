"use client";

import Image from "next/image";
import { m } from "framer-motion";

// "Flower" bloom: cards share a bottom-center pivot and start perfectly
// stacked. They burst out one-by-one into a wide upper-half fan (the
// "flower"), hold briefly, then collapse into the asymmetric stack pose
// that matches giftCard.png — black Amazon in front, fanning right
// through pink → yellow → hot-pink → purple.
const CARDS = [
  { src: "/promo/landing-promo/Gift Card-1.png",  bloom: -85, stack: -5,  z: 5 }, // black, front
  { src: "/promo/landing-promo/Gift Card -2.png", bloom: -42, stack: 6,   z: 4 },
  { src: "/promo/landing-promo/Gift Card -3.png", bloom: 0,   stack: 14,  z: 3 }, // yellow, top of bloom
  { src: "/promo/landing-promo/Gift Card-4.png",  bloom: 42,  stack: 22,  z: 2 },
  { src: "/promo/landing-promo/Gift Card-5.png",  bloom: 85,  stack: 30,  z: 1 }, // purple, back
] as const;

// Default card footprint matches the signup-card placement (48×62). The
// floating CTA overrides via props (48×38) for a squatter strip — the
// component scales its container off these so the layout stays tight.
const DEFAULT_CARD_W = 48;
const DEFAULT_CARD_H = 62;
// Extra container headroom above the cards so the bloom rotations don't
// clip. Empirically 16px gives a clean fan with the 30° max rotation.
const CONTAINER_HEADROOM = 16;
// Wait for the parent signup card to finish its 0.4s–1.0s fade-in before
// kicking off, otherwise the bloom plays under an invisible parent.
const DEFAULT_START_DELAY_MS = 1000;
const STAGGER_MS = 100;
// Per-card duration tuned so the whole bloom (4×stagger + per-card) lasts
// 2500ms — matching the ₹500 count-up duration so the two entry beats
// finish together. Sparkles then fire after both have settled.
const PER_CARD_MS = 2100;

// Emission points on the front voucher (corners + a center accent).
// Coordinates are offsets from the container center, in px.
const SPARKLES = [
  { x: -16, y: -20, size: 10, delay: 0 },    // upper-left
  { x:  14, y: -22, size:  8, delay: 0.15 }, // upper-right
  { x:   4, y:   2, size: 12, delay: 0.3 },  // center
  { x: -10, y:  18, size:  8, delay: 0.45 }, // lower-left
] as const;

// Default card size 48×62 matches the signup-card placement. Pass
// `cardWidth`/`cardHeight` to override (e.g. 48×38 for the floating CTA).
// `scale` shrinks/grows the whole animation proportionally on top of that.
//
// `play` gates the bloom + sparkles. When false, the cards sit perfectly
// stacked at rotation 0 (only the front Amazon card showing) and sparkles
// stay invisible. The bloom/sparkle delays are measured from the moment
// `play` flips true, so callers can hold the animation until the surrounding
// card is actually visible.
//
// `skipBloom` (used by /creator/promo-w) renders the cards directly in their
// final asymmetric stack pose with no bloom transition, while keeping the
// sparkles. Sparkles start almost immediately since there's no bloom to wait
// on.
export default function GiftCardStackAnimation({
  scale = 1,
  play = true,
  cardWidth = DEFAULT_CARD_W,
  cardHeight = DEFAULT_CARD_H,
  startDelayMs = DEFAULT_START_DELAY_MS,
  skipBloom = false,
}: {
  scale?: number;
  play?: boolean;
  cardWidth?: number;
  cardHeight?: number;
  startDelayMs?: number;
  skipBloom?: boolean;
} = {}) {
  const containerW = cardWidth * 2;
  const containerH = cardHeight + CONTAINER_HEADROOM;
  // Sparkles fire on the front voucher *after* the bloom has fully settled.
  // Last card delay = startDelayMs + (N-1)*STAGGER, plus its full duration.
  // When skipBloom is true the cards paint in their final pose immediately,
  // so sparkles only need a brief settle delay before kicking off.
  const cardsEndMs =
    startDelayMs + (CARDS.length - 1) * STAGGER_MS + PER_CARD_MS;
  const sparkleStartMs = skipBloom ? 200 : cardsEndMs + 200;
  return (
    <div
      className="relative shrink-0"
      style={{
        width: containerW * scale,
        height: containerH * scale,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          width: containerW,
          height: containerH,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
      {CARDS.map((card, i) => (
        <m.div
          key={card.src}
          className="absolute"
          style={{
            width: cardWidth,
            height: cardHeight,
            left: `calc(50% - ${cardWidth / 2}px)`,
            bottom: 2,
            transformOrigin: "50% 100%",
            zIndex: card.z,
          }}
          initial={skipBloom ? { rotate: card.stack, scale: 1 } : { rotate: 0, scale: 1 }}
          animate={
            skipBloom
              ? // /promo-w: cards paint directly in their final stack pose;
                // no bloom keyframes.
                { rotate: card.stack, scale: 1 }
              : play
                ? {
                    // 0%      → stack (perfectly overlapped, only black visible)
                    // 32%     → bloom (wide fan)
                    // 55%     → still bloom (hold)
                    // 100%    → final stack pose matching giftCard.png
                    rotate: [0, card.bloom, card.bloom, card.stack],
                    scale: [1, 1.05, 1.05, 1],
                  }
                : { rotate: 0, scale: 1 }
          }
          transition={
            skipBloom
              ? { duration: 0 }
              : {
                  duration: PER_CARD_MS / 1000,
                  times: [0, 0.32, 0.55, 1],
                  delay: (startDelayMs + i * STAGGER_MS) / 1000,
                  ease: [0.34, 1.2, 0.64, 1],
                }
          }
        >
          <Image
            src={card.src}
            alt=""
            width={cardWidth}
            height={cardHeight}
            className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
            loading="eager"
            decoding="async"
          />
        </m.div>
      ))}

      {/* Shining particles on top of the front (black) voucher. They sit
          above all cards via a high z-index and fire on a 2s loop once the
          bloom has settled. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 10 }}
      >
        {SPARKLES.map((s, i) => (
          <m.span
            key={i}
            className="absolute block"
            style={{
              left: `calc(50% + ${s.x}px)`,
              top: `calc(50% + ${s.y}px)`,
              width: s.size,
              height: s.size,
              marginLeft: -s.size / 2,
              marginTop: -s.size / 2,
            }}
            initial={{ opacity: 0, scale: 0.3, y: 0 }}
            animate={
              play
                ? {
                    // fade in fast, hold, fade out as it floats up — total 1s.
                    opacity: [0, 1, 1, 0],
                    scale: [0.3, 1.1, 1, 0.6],
                    y: [0, -6, -14, -22],
                    rotate: [0, 30, 60, 90],
                  }
                : { opacity: 0, scale: 0.3, y: 0, rotate: 0 }
            }
            transition={{
              duration: 1,
              times: [0, 0.25, 0.6, 1],
              delay: sparkleStartMs / 1000 + s.delay,
              repeat: Infinity,
              // Each sparkle's own cycle is duration (1s) + repeatDelay (1s)
              // = 2s, matching the "every 2 seconds" emission cadence.
              repeatDelay: 1,
              ease: "easeOut",
            }}
          >
            <SparkleIcon size={s.size} />
          </m.span>
        ))}
      </div>
      </div>
    </div>
  );
}

function SparkleIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      style={{
        display: "block",
        filter: "drop-shadow(0 0 3px rgba(255, 230, 130, 0.9))",
      }}
    >
      <path
        d="M6 0 L6.9 5.1 L12 6 L6.9 6.9 L6 12 L5.1 6.9 L0 6 L5.1 5.1 Z"
        fill="#fffbe6"
      />
    </svg>
  );
}
