"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import PromoSignupCard from "./PromoSignupCard";
import { useSectionViewTracking } from "@/lib/hooks/useSectionViewTracking";

const HIGHLIGHT_STYLE: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(100deg, transparent 0, transparent 0.2em, #FFCC00 0.35em, #FFCC00 calc(100% - 0.35em), transparent calc(100% - 0.2em), transparent 100%)",
  padding: "0.15em 0.5em",
  boxDecorationBreak: "clone",
  WebkitBoxDecorationBreak: "clone",
};

export default function HeroSection() {
  const { t } = useTranslation("creatorPromo");
  const sectionRef = useRef<HTMLElement>(null);
  useSectionViewTracking(sectionRef, "promo_hero", { event: "promo_hero_view" });

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

  // Deep-link: scroll to the signup card if the URL is #signup.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#signup") return;
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

        {/* Signup card — paints immediately at hydration so it qualifies as
            the LCP element without waiting on a wrapper fade-in. The card's
            interior beats (counter, gift-card bloom, button bounce) still
            play once the page hydrates. */}
        <PromoSignupCard play />
      </div>
    </section>
  );
}
