"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CTAButton from "./CTAButton";

export default function HeroSection() {
  const { t } = useTranslation("creatorEarn");
  const [scrollProgress, setScrollProgress] = useState(0);

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

  return (
    <section className="relative pt-8 md:pt-16 pb-12 md:pb-20 px-5 md:px-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-[1440px] mx-auto"
      >
        {/* Heading */}
        <h1 className="text-[32px] md:text-[52px] font-bold text-white text-center leading-tight mb-8 md:mb-12 max-w-[350px] md:max-w-[740px] mx-auto whitespace-pre-line">
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
              src="/images/creator/earn/hero-illustration.png"
              alt="Happy woman pointing at phone showing invoice"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* Get Early Access Button */}
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
      </motion.div>
    </section>
  );
}
