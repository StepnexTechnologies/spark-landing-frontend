"use client";

import { useEffect, useRef } from "react";
import { useSectionViewTracking } from "@/lib/hooks/useSectionViewTracking";

// Placeholder clip shown when the API doesn't hand us any creator media — i.e.
// the "someone wants a portfolio like @X" version. When the portfolio's own
// media is available (the "claim your own portfolio" version) it plays that
// instead.
const PLACEHOLDER_VIDEO = "/videos/portfolio-hero-placeholder.mp4";

interface HeroSectionProps {
  // Hero backdrop media from `user_details` (see lib/portfolio/api.ts). The
  // fallback chain mirrors the creator app's portfolio hero:
  //   hero_video_url → hero_image_url (still) → placeholder clip.
  videoUrl?: string | null;
  // Poster frame while the video buffers; the still falls in behind it.
  posterUrl?: string | null;
  // Still backdrop used when the creator has no hero video.
  imageUrl?: string | null;
  // Normalised 0–1 coords → `object-position`, so the subject stays in frame
  // when the media is cropped to the band.
  focalPoint?: { x: number; y: number } | null;
}

// Hero = the video band only (relative, h-[50vh]). The identity + card + the
// rest of the sections are rendered by the page in ONE container positioned
// relative to this section (see PortfolioPage), so they overlay the video and
// stack together.
export default function HeroSection({
  videoUrl,
  posterUrl,
  imageUrl,
  focalPoint,
}: HeroSectionProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  useSectionViewTracking(sectionRef, "portfolio_hero", { event: "portfolio_hero_view" });

  // A still is only used when the creator has no hero video at all — otherwise
  // it (and the poster) just cover the video while it buffers.
  const src = videoUrl || (imageUrl ? null : PLACEHOLDER_VIDEO);
  const poster = posterUrl ?? imageUrl ?? undefined;
  const objectPosition = focalPoint
    ? `${focalPoint.x * 100}% ${focalPoint.y * 100}%`
    : "center";

  // A playing video repaints its layer every frame, and the nav's backdrop-blur
  // has to re-sample that region each time. Off screen none of it is visible but
  // the browser keeps paying for it — so pause once the hero scrolls away.
  // (Same treatment as the creator app's portfolio hero.)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

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
        {src ? (
          <video
            ref={videoRef}
            key={src}
            // Decorative, muted background loop with no audible track — hidden
            // from assistive tech.
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition }}
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundPosition: objectPosition,
            }}
          />
        )}
        {/* Legibility overlay so the white text + card read over the video. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/80" />
      </div>
    </section>
  );
}
