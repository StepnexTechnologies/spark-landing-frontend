"use client";

import { useRef } from "react";
import { useSectionViewTracking } from "@/lib/hooks/useSectionViewTracking";

// Placeholder clip shown when the API doesn't hand us a creator video — i.e.
// the "someone wants a portfolio like @X" version. When a video URL is provided
// (the "claim your own portfolio" version) it plays that instead.
const PLACEHOLDER_VIDEO = "/videos/portfolio-hero-placeholder.mp4";

interface HeroSectionProps {
  // API-provided hero video for the portfolio being claimed. Falls back to the
  // placeholder clip when null/undefined.
  videoUrl?: string | null;
  // Optional poster frame while the video buffers.
  posterUrl?: string | null;
}

// Hero = the video band only (relative, h-[50vh]). The identity + card + the
// rest of the sections are rendered by the page in ONE container positioned
// relative to this section (see PortfolioPage), so they overlay the video and
// stack together.
export default function HeroSection({ videoUrl, posterUrl }: HeroSectionProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionViewTracking(sectionRef, "portfolio_hero", { event: "portfolio_hero_view" });

  const src = videoUrl || PLACEHOLDER_VIDEO;

  return (
    <section ref={sectionRef} className="relative h-[60vh] overflow-hidden">
      {/* Video backdrop — creator's clip from the API, or the placeholder.
          keyed on src so switching versions remounts + reloads. The bottom is
          masked to transparent so the video dissolves into the page background
          instead of ending on a hard edge. */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 78%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 78%, transparent 100%)",
        }}
      >
        <video
          key={src}
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          poster={posterUrl ?? undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        {/* Legibility overlay so the white text + card read over the video. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/80" />
      </div>
    </section>
  );
}
