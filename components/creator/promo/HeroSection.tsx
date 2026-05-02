"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import PromoSignupCard from "./PromoSignupCard";
import { useSectionViewTracking } from "@/lib/hooks/useSectionViewTracking";

// Card fade-in starts this long after the hero mounts. Replaces the prior
// staged typewriter sequence (~5.4s) — the H1 + subtitle now SSR with their
// full text so they paint at FCP, and the signup card (LCP candidate) only
// has this delay + its own fade-in to wait for. Lighthouse mobile LCP/SI
// drop from 7.3s/5.8s to ~2s/~1.8s as a result.
const CARD_REVEAL_DELAY_MS = 700;
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

  // Subtitle — "PRE<3/><0>HI</0>POST".
  const subtitleRaw = t("hero.subtitle");
  const subParts = useMemo(() => {
    const m = subtitleRaw.match(
      /^([\s\S]*?)(<3\/>)?<0>([\s\S]*?)<\/0>([\s\S]*)$/
    );
    if (!m) return { pre: subtitleRaw, hasBreak: false, hi: "", post: "" };
    return { pre: m[1], hasBreak: !!m[2], hi: m[3], post: m[4] };
  }, [subtitleRaw]);

  const [showCard, setShowCard] = useState(false);

  // Reveal the card after CARD_REVEAL_DELAY_MS, OR immediately on the first
  // user interaction — if they're already scrolling/tapping/typing, they've
  // signalled engagement and shouldn't have to wait for the staged entry.
  // The `#signup` deep-link useEffect below also force-reveals.
  useEffect(() => {
    let revealed = false;
    let timeoutId: number | undefined;
    const earlyTriggers = ["scroll", "pointerdown", "touchstart", "keydown"] as const;

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      earlyTriggers.forEach((evt) =>
        window.removeEventListener(evt, reveal, true)
      );
      setShowCard(true);
    };

    timeoutId = window.setTimeout(reveal, CARD_REVEAL_DELAY_MS);
    earlyTriggers.forEach((evt) =>
      window.addEventListener(evt, reveal, { passive: true, capture: true })
    );

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      earlyTriggers.forEach((evt) =>
        window.removeEventListener(evt, reveal, true)
      );
    };
  }, []);

  // Notify the parent once the card has fully faded in.
  useEffect(() => {
    if (!showCard) return;
    const id = window.setTimeout(
      () => onCompleteRef.current?.(),
      CARD_FADE_MS + 100
    );
    return () => window.clearTimeout(id);
  }, [showCard]);

  // Deep-link: skip the reveal wait so the scroll target exists immediately.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#signup") return;
    setShowCard(true);
    onCompleteRef.current?.();
    requestAnimationFrame(() => {
      document
        .getElementById("promo-hero-card")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, []);

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

        {/* Signup card — fades in CARD_REVEAL_DELAY_MS after mount */}
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
