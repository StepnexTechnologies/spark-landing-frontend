"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import PromoSignupCard from "./PromoSignupCard";
import { useSectionViewTracking } from "@/lib/hooks/useSectionViewTracking";

// Staged hero typewriter constants — only consulted when enableTypewriter
// is true (the canonical /creator/promo route). The campaign aliases
// /creator/promo-f and /creator/promo-w skip the whole sequence so their
// LCP card paints at FCP.
const TYPE_INITIAL_DELAY_MS = 450;
const TYPE_SPEED_MS = 28;
const SUBTITLE_PAUSE_MS = 350;
const CARD_PAUSE_MS = 350;
const CARD_FADE_MS = 600;

const HIGHLIGHT_STYLE: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(100deg, transparent 0, transparent 0.2em, #FFCC00 0.35em, #FFCC00 calc(100% - 0.35em), transparent calc(100% - 0.2em), transparent 100%)",
  padding: "0.15em 0.5em",
  boxDecorationBreak: "clone",
  WebkitBoxDecorationBreak: "clone",
};

interface HeroSectionProps {
  // Threaded down to PromoSignupCard. "f" variant tweaks the hero card's
  // animation behavior for /creator/promo-f only — see PromoSignupCard.
  // "w" variant strips entry animations on /creator/promo-w (sparkles + Get
  // OTP bounce kept).
  variant?: "f" | "w";
  // When true, plays the staged title→subtitle typewriter → card fade-in
  // sequence. Off everywhere except /creator/promo.
  enableTypewriter?: boolean;
}

export default function HeroSection({ variant, enableTypewriter = false }: HeroSectionProps = {}) {
  const { t } = useTranslation("creatorPromo");
  const sectionRef = useRef<HTMLElement>(null);
  useSectionViewTracking(sectionRef, "promo_hero", { event: "promo_hero_view" });

  // Title — split on the desktop <br> placeholder.
  const titleRaw = t("hero.title");
  const [titlePart1, titlePart2 = ""] = useMemo(
    () => titleRaw.split("<0/>"),
    [titleRaw]
  );
  const titleLen = titlePart1.length + titlePart2.length;

  // Subtitle — "PRE<3/><0>HI</0>POST".
  const subtitleRaw = t("hero.subtitle");
  const subParts = useMemo(() => {
    const m = subtitleRaw.match(
      /^([\s\S]*?)(<3\/>)?<0>([\s\S]*?)<\/0>([\s\S]*)$/
    );
    if (!m) return { pre: subtitleRaw, hasBreak: false, hi: "", post: "" };
    return { pre: m[1], hasBreak: !!m[2], hi: m[3], post: m[4] };
  }, [subtitleRaw]);
  const subLen =
    subParts.pre.length + subParts.hi.length + subParts.post.length;

  // When enableTypewriter is false these stay at their terminal values
  // (titleTyped = titleLen, subTyped = subLen, showSubtitle/showCard = true)
  // so the static-render branch can use them directly without diverging.
  const [titleTyped, setTitleTyped] = useState(enableTypewriter ? 0 : titleLen);
  const [showSubtitle, setShowSubtitle] = useState(!enableTypewriter);
  const [subTyped, setSubTyped] = useState(enableTypewriter ? 0 : subLen);
  const [showCard, setShowCard] = useState(!enableTypewriter);

  // Slow-network / Data Saver / reduced-motion detection. We keep the staged
  // reveal playing (it's brand copy, not chrome) but on a slow connection or
  // low-end phone it starts immediately and types faster, so 4G / iOS users
  // aren't left staring at a blank headline + blinking cursor. Detected on
  // mount; the typing effects below depend on the derived timings, so the
  // moment this flips they reschedule with the fast values (the pending
  // slow-timing timer is cleared by the effect cleanup).
  const [isSlow, setIsSlow] = useState(false);
  useEffect(() => {
    if (!enableTypewriter) return;
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const slowNet =
      !!conn &&
      (conn.saveData === true ||
        ["slow-2g", "2g", "3g"].includes(conn.effectiveType ?? ""));
    if (reduceMotion || slowNet) setIsSlow(true);
  }, [enableTypewriter]);

  // Fast-device defaults vs. slow-device overrides. Slow drops the initial
  // delay to zero (instant first char) and roughly halves the per-char + pause
  // timings so the whole sequence resolves quickly.
  const initialDelay = isSlow ? 0 : TYPE_INITIAL_DELAY_MS;
  const typeSpeed = isSlow ? 12 : TYPE_SPEED_MS;
  const subtitlePause = isSlow ? 120 : SUBTITLE_PAUSE_MS;
  const cardPause = isSlow ? 120 : CARD_PAUSE_MS;
  const cardFade = isSlow ? 250 : CARD_FADE_MS;

  // Title typewriter
  useEffect(() => {
    if (!enableTypewriter) return;
    if (titleTyped >= titleLen) return;
    const delay = titleTyped === 0 ? initialDelay : typeSpeed;
    const id = window.setTimeout(() => setTitleTyped((n) => n + 1), delay);
    return () => window.clearTimeout(id);
  }, [enableTypewriter, titleTyped, titleLen, initialDelay, typeSpeed]);

  // Mount the subtitle once the title is done
  useEffect(() => {
    if (!enableTypewriter) return;
    if (titleTyped < titleLen || titleLen === 0) return;
    const id = window.setTimeout(() => setShowSubtitle(true), subtitlePause);
    return () => window.clearTimeout(id);
  }, [enableTypewriter, titleTyped, titleLen, subtitlePause]);

  // Subtitle typewriter
  useEffect(() => {
    if (!enableTypewriter) return;
    if (!showSubtitle) return;
    if (subTyped >= subLen) return;
    const id = window.setTimeout(() => setSubTyped((n) => n + 1), typeSpeed);
    return () => window.clearTimeout(id);
  }, [enableTypewriter, showSubtitle, subTyped, subLen, typeSpeed]);

  // Fade in the card once the subtitle finishes typing
  useEffect(() => {
    if (!enableTypewriter) return;
    if (!showSubtitle || subTyped < subLen) return;
    const id = window.setTimeout(() => setShowCard(true), cardPause);
    return () => window.clearTimeout(id);
  }, [enableTypewriter, showSubtitle, subTyped, subLen, cardPause]);

  // Deep-link: skip the staged reveal so the scroll target exists immediately.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#signup") return;
    if (enableTypewriter) {
      setTitleTyped(titleLen);
      setShowSubtitle(true);
      setSubTyped(subLen);
      setShowCard(true);
    }
    requestAnimationFrame(() => {
      document
        .getElementById("promo-hero-card")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [enableTypewriter, titleLen, subLen]);

  // Title slices
  const tVisible1 = Math.min(titleTyped, titlePart1.length);
  const tVisible2 = Math.max(0, titleTyped - titlePart1.length);
  const isTitleTyping = enableTypewriter && titleTyped < titleLen;

  // Subtitle slices
  const sPre = Math.min(subTyped, subParts.pre.length);
  const sHi = Math.max(
    0,
    Math.min(subTyped - subParts.pre.length, subParts.hi.length)
  );
  const sPost = Math.max(
    0,
    subTyped - subParts.pre.length - subParts.hi.length
  );
  const isSubTyping = enableTypewriter && showSubtitle && subTyped < subLen;

  return (
    <section
      ref={sectionRef}
      className="relative pt-6 md:pt-12 pb-10 md:pb-16 px-5 md:px-20 overflow-hidden"
    >
      <div className="max-w-[760px] mx-auto">
        {/* Apni Boli, Apna Bill chip — paints instantly on first SSR frame. */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <Image
            src="/promo/Hinglish-icon-gradeint.png"
            alt=""
            width={64}
            height={64}
            className="w-16 h-16 shrink-0"
            priority
            fetchPriority="high"
          />
          <span
            className="font-bold text-[32px] leading-none text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(162.34deg, #DD2A7B 4.78%, #9747FF 89.95%)",
            }}
          >
            {t("hero.tagChip")}
          </span>
        </div>

        {enableTypewriter ? (
          <>
            {/* Headline — typewriter. min-h reserves space so the subtitle/card don't jump. */}
            <h1 className="text-[30px] font-bold text-white text-center leading-tight mb-4 md:mb-5 max-w-[640px] mx-auto min-h-[2.4em]">
              {titlePart1.slice(0, tVisible1)}
              {tVisible1 >= titlePart1.length && titlePart2 ? (
                <>
                  <br className="hidden md:block" />
                  {titlePart2.slice(0, tVisible2)}
                </>
              ) : null}
              {isTitleTyping && (
                <span
                  aria-hidden="true"
                  className="inline-block w-[2px] h-[0.9em] bg-white align-middle ml-0.5 animate-pulse"
                />
              )}
            </h1>

            {/* Subheadline — typewriter. Highlight paints as the cursor reaches it. */}
            <p className="text-[16px] font-normal text-white text-center mb-8 md:mb-10 max-w-[640px] mx-auto leading-relaxed min-h-[5em] md:min-h-[3.6em]">
              {subParts.pre.slice(0, sPre)}
              {sPre >= subParts.pre.length && (
                <>
                  {subParts.hasBreak && <br className="hidden md:block" />}
                  <span className="font-bold text-primary" style={HIGHLIGHT_STYLE}>
                    {subParts.hi.slice(0, sHi)}
                  </span>
                </>
              )}
              {sHi >= subParts.hi.length && subParts.post.slice(0, sPost)}
              {isSubTyping && (
                <span
                  aria-hidden="true"
                  className="inline-block w-[2px] h-[1em] bg-white align-middle ml-0.5 animate-pulse"
                />
              )}
            </p>

            {/* Signup card — fades in last */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={showCard ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: cardFade / 1000, ease: "easeOut" }}
            >
              <PromoSignupCard play={showCard} variant={variant} />
            </motion.div>
          </>
        ) : (
          <>
            {/* Headline — full text rendered statically so it paints at FCP. */}
            <h1 className="text-[30px] font-bold text-white text-center leading-tight mb-4 md:mb-5 max-w-[640px] mx-auto">
              {titlePart1}
              {titlePart2 && (
                <>
                  <br className="hidden md:block" />
                  {titlePart2}
                </>
              )}
            </h1>

            {/* Subheadline — full text + yellow highlight rendered statically. */}
            <p className="text-[16px] font-normal text-white text-center mb-8 md:mb-10 max-w-[640px] mx-auto leading-relaxed">
              {subParts.pre}
              {subParts.hasBreak && <br className="hidden md:block" />}
              <span className="font-bold text-primary" style={HIGHLIGHT_STYLE}>
                {subParts.hi}
              </span>
              {subParts.post}
            </p>

            {/* Signup card — paints immediately at hydration so it qualifies as
                the LCP element without waiting on a wrapper fade-in. The card's
                interior beats (counter, gift-card bloom, button bounce) still
                play once the page hydrates. */}
            <PromoSignupCard play variant={variant} />
          </>
        )}
      </div>
    </section>
  );
}
