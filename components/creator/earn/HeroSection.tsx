"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CTAButton from "./CTAButton";

export default function HeroSection() {
  const { t, ready } = useTranslation("creatorEarn");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Creator Week promo window: April 20 — April 27, 2026 (inclusive).
  // TODO: flip FORCE_CREATOR_WEEK back to false before shipping — it bypasses the date gate.
  const isCreatorWeek = (() => {
    const FORCE_CREATOR_WEEK = true;
    const now = new Date();
    const start = new Date(2026, 3, 20);
    const end = new Date(2026, 3, 28); // exclusive upper bound
    return FORCE_CREATOR_WEEK || (now >= start && now < end);
  })();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollPosition / (windowHeight * 0.4), 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted || !ready) {
    return null;
  }

  return (
    <section className="relative pt-8 md:pt-16 pb-12 md:pb-20 px-5 md:px-20 overflow-hidden">
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
                className="rounded-[26px] backdrop-blur-[2px] w-full h-full transition-all duration-300"
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
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* Creator Week Special Promo */}
        {isCreatorWeek && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative overflow-hidden mt-[30px] md:mt-10 -mx-5 md:-mx-20 px-4 py-4"
            style={{
              background:
                "linear-gradient(90deg, rgba(61, 88, 219, 0.12) 2.15%, rgba(129, 52, 175, 0.6) 48.84%, rgba(61, 88, 219, 0.12) 96.24%)",
            }}
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-y-8 w-[60%] mix-blend-screen"
              style={{
                background:
                  "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.06) 65%, transparent 100%)",
                filter: "blur(24px)",
              }}
              initial={{ left: "-60%" }}
              animate={{ left: "100%" }}
              transition={{
                duration: 3.2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 1.4,
              }}
            />
            <div className="relative text-center max-w-[560px] md:max-w-none mx-auto">
              <h2 className="text-[18px] font-bold text-white leading-tight mb-1 md:whitespace-nowrap">
                {t("creatorWeek.heading")}
              </h2>
              <p className="text-white text-[14px] md:text-lg mb-1 md:whitespace-nowrap">
                {t("creatorWeek.descriptionBefore")}{" "}
                <span className="font-bold">{t("creatorWeek.descriptionAmount")}</span>{" "}
                <span className="font-normal">{t("creatorWeek.descriptionPlan")}</span>{" "}
                <span className="font-bold">{t("creatorWeek.descriptionFree")}</span>
              </p>
              <p className="text-white/90 text-[12px] mb-4">
                {t("creatorWeek.special")}
              </p>
              <div className="flex justify-center">
                <Suspense fallback={<div className="h-12" />}>
                  <CTAButton buttonText={t("creatorWeek.cta")} />
                </Suspense>
              </div>
            </div>
          </motion.div>
        )}

        {/* Get Early Access Button — hidden during Creator Week promo */}
        {!isCreatorWeek && (
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
