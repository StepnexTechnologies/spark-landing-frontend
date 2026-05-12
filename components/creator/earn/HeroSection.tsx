"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import CTAButton from "./CTAButton";
import { useSectionViewTracking } from "@/lib/hooks/useSectionViewTracking";
import { useIsPromoActive } from "@/lib/hooks/useIsPromoActive";
import { PROMO_CONFIG } from "@/lib/promo/config";
import { track } from "@/lib/analytics/track";
import { appendUtmTo, readUtmParams } from "@/lib/utm";

export default function HeroSection() {
  const { t, i18n } = useTranslation("creatorEarn");
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  useSectionViewTracking(sectionRef, "earn_hero", { event: "earn_hero_view" });

  const isPromoActive = useIsPromoActive();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref");
  // UTM appending touches sessionStorage, so gate on hydration to avoid
  // SSR/client href mismatch (same pattern as CTAButton).
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const promoSignupHref = (() => {
    const url = new URL("https://beta.creator.sparkonomy.com/auth");
    url.searchParams.set("service", "earn");
    url.searchParams.set("lang", i18n.language?.startsWith("hi") ? "hi-Latn" : "en");
    if (referralCode) url.searchParams.set("ref", referralCode);
    if (hydrated) {
      appendUtmTo(url, readUtmParams(new URLSearchParams(searchParams.toString())));
    }
    return url.toString();
  })();

  // rAF-throttled scroll handler — prevents a setState + forced reflow on every
  // wheel event, which Lighthouse flagged as a major TBT contributor on mobile.
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const progress = Math.min(window.scrollY / (window.innerHeight * 0.4), 1);
        setScrollProgress(progress);
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative pt-8 md:pt-16 pb-12 md:pb-20 px-5 md:px-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-[1440px] mx-auto"
      >
        {/* Heading */}
        <h1 className="text-[32px] md:text-[52px] font-bold text-white text-center leading-tight mb-8 md:mb-12 max-w-[350px] md:max-w-[620px] mx-auto whitespace-pre-line">
          {t("hero.title")}
        </h1>

        {/* Glassmorphic Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative w-[340px] md:w-[784px] h-[273px] md:h-[630px] mx-auto"
        >
          {/* Glass Layer */}
          <div className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-[356px] md:w-[800px] h-[227px] md:h-[520px]">
            <div className="rounded-[32px] p-[10px] bg-gradient-to-br from-white/20 via-white/0 to-black/10 border border-white/20 backdrop-blur-lg shadow-[10px_10px_30px_rgba(0,0,0,0.2),-10px_-10px_30px_rgba(255,255,255,0.1)] h-full">
              <div
                className="rounded-[26px] w-full h-full transition-all duration-300"
                style={{
                  background: `linear-gradient(to bottom,
                    rgba(255, 255, 255, 0.15) 0%,
                    rgba(255, 255, 255, 0.15) ${scrollProgress * 100}%,
                    rgba(221, 42, 123, 0.3) ${scrollProgress * 100}%,
                    rgba(151, 71, 255, 0.3) 100%)`,
                }}
              />
            </div>
          </div>

          {/* Image with Margin */}
          <div className="relative w-full h-full z-10 m-3 md:m-6">
            <Image
              src="/images/creator/earn/hero-illustration-2.png"
              alt="Happy woman pointing at phone showing invoice"
              fill
              sizes="(max-width: 768px) 340px, 784px"
              className="object-contain"
              priority
              fetchPriority="high"
            />
          </div>
        </motion.div>

        {/* Promo banner — copy comes from i18n (`promo.*`), T&C URL from PROMO_CONFIG. */}
        {isPromoActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative mt-[30px] md:mt-10 mx-auto w-full max-w-[420px] md:max-w-[560px]"
          >
            <div
              className="relative overflow-hidden rounded-[24px] px-5 py-5 md:px-7 md:py-6 border border-white/20 backdrop-blur-lg"
              style={{
                background:
                  "linear-gradient(90deg, rgba(61, 88, 219, 0.12) 2.15%, rgba(129, 52, 175, 0.6) 48.84%, rgba(61, 88, 219, 0.12) 96.24%)",
              }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-y-8 w-[60%] mix-blend-screen animate-shimmer-sweep"
                style={{
                  background:
                    "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.06) 65%, transparent 100%)",
                  filter: "blur(24px)",
                }}
              />

              <h2 className="relative text-white font-bold text-[32px] leading-tight text-center">
                {t("promo.heading")}
              </h2>

              <div className="relative mt-2 flex items-center gap-4">
                <Image
                  src="/promo/icon.png"
                  alt=""
                  width={72}
                  height={72}
                  className="shrink-0 w-[72px] h-[72px] object-contain opacity-90"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-[16px] font-normal leading-snug">
                    {t("promo.subheading")}
                  </p>
                  <p className="mt-2 text-white text-[12px] font-normal leading-snug">
                    {t("promo.tagline")}
                  </p>
                  {PROMO_CONFIG.terms.url ? (
                    <a
                      href={PROMO_CONFIG.terms.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-white/90 text-[10px] font-normal underline hover:text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t("promo.terms")}
                    </a>
                  ) : (
                    <span className="mt-1 inline-block text-white/90 text-[10px] font-normal underline">
                      {t("promo.terms")}
                    </span>
                  )}
                </div>
              </div>

              <Link
                href={promoSignupHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  track("earn_cta_click", {
                    cta: "beta_signup",
                    label: t("promo.cta"),
                    referral_code: referralCode ?? null,
                  })
                }
                className="relative overflow-hidden mt-5 flex items-center justify-center w-full rounded-full bg-white px-6 py-3 text-[#9747FF] font-bold text-[16px] shadow-[0_8px_20px_rgba(0,0,0,0.18)] hover:bg-white/95 transition-colors"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 w-[60%] animate-shimmer-sweep"
                  style={{
                    background:
                      "linear-gradient(115deg, transparent 0%, rgba(151, 71, 255, 0.18) 35%, rgba(129, 52, 175, 0.45) 50%, rgba(151, 71, 255, 0.18) 65%, transparent 100%)",
                    filter: "blur(8px)",
                    // Same keyframe as the card shimmer, but lagged so the beam
                    // appears to travel from the top of the card down onto the
                    // button — mimicking one continuous diagonal sweep.
                    animationDelay: "0.2s",
                  }}
                />
                <span className="relative">{t("promo.cta")}</span>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Default CTA — hidden while a promo banner is showing. */}
        {!isPromoActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center mt-8 md:mt-12"
          >
            <Suspense fallback={<div className="h-12" />}>
              <CTAButton buttonText={t("nav.getEarlyAccess")} />
            </Suspense>
          </motion.div>
        )}

        {/* Partner Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex items-center justify-center mt-12"
        >
          <Image
            src="/logos/Meta_White.png"
            alt="Meta"
            height={40}
            width={120}
            className="h-[40px] w-auto object-contain pr-4 border-r border-white"
          />
          <Image
            src="/logos/Yt_White.png"
            alt="YouTube"
            height={40}
            width={120}
            className="h-[40px] w-auto object-contain pl-4"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
