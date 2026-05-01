"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import PromoSignupCard from "./PromoSignupCard";
import { useSectionViewTracking } from "@/lib/hooks/useSectionViewTracking";

export default function HeroSection() {
  const { t } = useTranslation("creatorPromo");
  const sectionRef = useRef<HTMLElement>(null);
  useSectionViewTracking(sectionRef, "promo_hero", { event: "promo_hero_view" });

  // Smooth-scroll the OTP card into view if the user lands deep with #signup.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#signup") {
      document.getElementById("promo-hero-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  return (
    <section ref={sectionRef} className="relative pt-6 md:pt-12 pb-10 md:pb-16 px-5 md:px-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="max-w-[760px] mx-auto"
      >
        {/* Apni Boli, Apna Bill chip */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <Image
            src="/promo/Hinglish-icon-gradeint.png"
            alt=""
            width={64}
            height={64}
            className="w-16 h-16 shrink-0"
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

        {/* Headline */}
        <h1 className="text-[30px] font-bold text-white text-center leading-tight mb-4 md:mb-5 max-w-[640px] mx-auto">
          <Trans
            i18nKey="hero.title"
            t={t}
            components={[<br key="title-break" className="hidden md:block" />]}
          />
        </h1>

        {/* Subheadline */}
        <p className="text-[16px] font-normal text-white text-center mb-8 md:mb-10 max-w-[640px] mx-auto leading-relaxed">
          <Trans
            i18nKey="hero.subtitle"
            t={t}
            components={[
              <span
                key="highlight-1"
                className="font-bold text-primary"
                style={{
                  backgroundImage:
                    "linear-gradient(100deg, transparent 0, transparent 0.2em, #FFCC00 0.35em, #FFCC00 calc(100% - 0.35em), transparent calc(100% - 0.2em), transparent 100%)",
                  padding: "0.15em 0.5em",
                  boxDecorationBreak: "clone",
                  WebkitBoxDecorationBreak: "clone",
                }}
              />,
              <br key="break" />,
              <span
                key="highlight-2"
                className="font-bold text-primary"
                style={{
                  backgroundImage:
                    "linear-gradient(100deg, transparent 0, transparent 0.2em, #FFCC00 0.35em, #FFCC00 calc(100% - 0.35em), transparent calc(100% - 0.2em), transparent 100%)",
                  padding: "0.15em 0.5em",
                  boxDecorationBreak: "clone",
                  WebkitBoxDecorationBreak: "clone",
                }}
              />,
              <br key="desktop-break" className="hidden md:block" />,
            ]}
          />
        </p>

        <PromoSignupCard />
      </motion.div>
    </section>
  );
}
