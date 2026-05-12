"use client";

import { useEffect, useState } from "react";

// Backdrop for the founder-invite page. Two stacked fixed layers pinned to
// the viewport:
//
//   1. Base — the designer's HTML mockup gradient (5 radials + linear),
//      shown for the whole page.
//   2. Black fade overlay — opacity-transitions in once the FAQ section
//      enters the viewport, painting the bottom band of the viewport black
//      so the FAQ + footer area sits on a solid ground (matches the
//      bg-black + top-only-gradient pattern used on /creator/earn).
//
// The page marks its FAQ wrapper with data-backdrop-fade-trigger; this
// component finds it on mount and observes its intersection.

const GRADIENT_BG = [
  "radial-gradient(ellipse 500px 380px at 10% 4%, rgba(139,75,230,0.42), transparent 65%)",
  "radial-gradient(ellipse 440px 340px at 92% 12%, rgba(214,58,142,0.48), transparent 60%)",
  "radial-gradient(ellipse 480px 380px at 50% 45%, rgba(232,80,150,0.52), transparent 65%)",
  "radial-gradient(ellipse 380px 280px at 6% 80%, rgba(168,37,158,0.42), transparent 70%)",
  "radial-gradient(ellipse 420px 320px at 94% 90%, rgba(90,30,120,0.35), transparent 65%)",
  "linear-gradient(180deg, #2A0A3A 0%, #5B1F7A 30%, #A8259E 58%, #D63A8E 75%, #5B1F7A 88%, #2A0A3A 100%)",
].join(", ");

// Black fade overlay. Transparent in the top half of the viewport so the
// underlying gradient is fully visible up there; ramps to solid black over
// the bottom ~55% so the FAQ + footer feel grounded.
const BLACK_FADE_OVERLAY =
  "linear-gradient(180deg, transparent 0%, transparent 35%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.85) 80%, #000 100%)";

const STAGE_WIDTH = 390;

export default function FounderInviteBackdrop() {
  // True once the element marked [data-backdrop-fade-trigger] is in view.
  // Until then the black overlay stays at opacity: 0.
  const [showBlack, setShowBlack] = useState(false);

  useEffect(() => {
    const target = document.querySelector("[data-backdrop-fade-trigger]");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowBlack(entry.isIntersecting),
      // rootMargin negative-bottom delays the trigger so the fade only
      // kicks in when the section is meaningfully visible, not when its
      // top edge first peeks into the viewport.
      { threshold: 0, rootMargin: "0px 0px -20% 0px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      {/* Base gradient — always rendered. */}
      <div
        className="absolute left-1/2 top-0 h-full"
        style={{
          width: STAGE_WIDTH,
          // Inline transform composes the centering shift with GPU-promotion
          // in a single value so nothing in globals.css can override it.
          transform: "translate3d(-50%, 0, 0)",
          backgroundImage: GRADIENT_BG,
        }}
      />

      {/* Black-fade overlay — fades in once FAQ is visible. */}
      <div
        className="absolute left-1/2 top-0 h-full"
        style={{
          width: STAGE_WIDTH,
          transform: "translate3d(-50%, 0, 0)",
          backgroundImage: BLACK_FADE_OVERLAY,
          opacity: showBlack ? 1 : 0,
          transition: "opacity 600ms ease-out",
        }}
      />
    </div>
  );
}
