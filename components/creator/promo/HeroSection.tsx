"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import PromoSignupCard from "./PromoSignupCard";
import { useSectionViewTracking } from "@/lib/hooks/useSectionViewTracking";

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
  /** Fires after the signup card has fully faded in. */
  onAnimationComplete?: () => void;
}

export default function HeroSection({
  onAnimationComplete,
}: HeroSectionProps = {}) {
  const { t } = useTranslation("creatorPromo");
  const sectionRef = useRef<HTMLElement>(null);
  useSectionViewTracking(sectionRef, "promo_hero", { event: "promo_hero_view" });

  // Stable ref so effects don't re-fire when the parent re-renders.
  const onCompleteRef = useRef(onAnimationComplete);
  useEffect(() => {
    onCompleteRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

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

  const [titleTyped, setTitleTyped] = useState(0);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [subTyped, setSubTyped] = useState(0);
  const [showCard, setShowCard] = useState(false);

  // Title typewriter
  useEffect(() => {
    if (titleTyped >= titleLen) return;
    const delay = titleTyped === 0 ? TYPE_INITIAL_DELAY_MS : TYPE_SPEED_MS;
    const id = window.setTimeout(() => setTitleTyped((n) => n + 1), delay);
    return () => window.clearTimeout(id);
  }, [titleTyped, titleLen]);

  // Mount the subtitle once the title is done
  useEffect(() => {
    if (titleTyped < titleLen || titleLen === 0) return;
    const id = window.setTimeout(() => setShowSubtitle(true), SUBTITLE_PAUSE_MS);
    return () => window.clearTimeout(id);
  }, [titleTyped, titleLen]);

  // Subtitle typewriter
  useEffect(() => {
    if (!showSubtitle) return;
    if (subTyped >= subLen) return;
    const id = window.setTimeout(() => setSubTyped((n) => n + 1), TYPE_SPEED_MS);
    return () => window.clearTimeout(id);
  }, [showSubtitle, subTyped, subLen]);

  // Fade in the card once the subtitle finishes typing
  useEffect(() => {
    if (!showSubtitle || subTyped < subLen) return;
    const id = window.setTimeout(() => setShowCard(true), CARD_PAUSE_MS);
    return () => window.clearTimeout(id);
  }, [showSubtitle, subTyped, subLen]);

  // Notify the parent once the card has fully faded in
  useEffect(() => {
    if (!showCard) return;
    const id = window.setTimeout(
      () => onCompleteRef.current?.(),
      CARD_FADE_MS + 100
    );
    return () => window.clearTimeout(id);
  }, [showCard]);

  // Deep-link: skip the staged reveal so the scroll target exists immediately.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#signup") return;
    setTitleTyped(titleLen);
    setShowSubtitle(true);
    setSubTyped(subLen);
    setShowCard(true);
    onCompleteRef.current?.();
    requestAnimationFrame(() => {
      document
        .getElementById("promo-hero-card")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [titleLen, subLen]);

  // Title slices
  const tVisible1 = Math.min(titleTyped, titlePart1.length);
  const tVisible2 = Math.max(0, titleTyped - titlePart1.length);
  const isTitleTyping = titleTyped < titleLen;

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
  const isSubTyping = showSubtitle && subTyped < subLen;

  const subtitlePlain = `${subParts.pre} ${subParts.hi}${subParts.post}`;

  return (
    <section
      ref={sectionRef}
      className="relative pt-6 md:pt-12 pb-10 md:pb-16 px-5 md:px-20 overflow-hidden"
    >
      <div className="max-w-[760px] mx-auto">
        {/* Apni Boli, Apna Bill chip — paints instantly on first SSR frame so
            it (along with the nav above) is the LCP candidate. The h1 below
            still typewriters in, but it no longer holds back the largest
            paint. */}
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

        {/* Headline — typewriter. Reserve space so the subtitle/card don't jump. */}
        <h1 className="text-[30px] font-bold text-white text-center leading-tight mb-4 md:mb-5 max-w-[640px] mx-auto min-h-[2.4em]">
          <span aria-hidden="true">
            {titlePart1.slice(0, tVisible1)}
            {tVisible1 >= titlePart1.length && titlePart2 ? (
              <>
                <br className="hidden md:block" />
                {titlePart2.slice(0, tVisible2)}
              </>
            ) : null}
            {isTitleTyping && (
              <span className="inline-block w-[2px] h-[0.9em] bg-white align-middle ml-0.5 animate-pulse" />
            )}
          </span>
          <span className="sr-only">{titleRaw.replace("<0/>", " ")}</span>
        </h1>

        {/* Subheadline — typewriter. Highlights paint as the cursor reaches them. */}
        <p className="text-[16px] font-normal text-white text-center mb-8 md:mb-10 max-w-[640px] mx-auto leading-relaxed min-h-[5em] md:min-h-[3.6em]">
          <span aria-hidden="true">
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
              <span className="inline-block w-[2px] h-[1em] bg-white align-middle ml-0.5 animate-pulse" />
            )}
          </span>
          <span className="sr-only">{subtitlePlain}</span>
        </p>

        {/* Signup card — fades in last */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={showCard ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: CARD_FADE_MS / 1000, ease: "easeOut" }}
        >
          <PromoSignupCard play={showCard} />
        </motion.div>
      </div>
    </section>
  );
}
