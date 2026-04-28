"use client";

import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import LogoCarousel from "@/components/LogoCarousel";
import {useIsPromoActive} from "@/lib/hooks/useIsPromoActive";
import {PROMO_CONFIG} from "@/lib/promo/config";

interface FooterProps {
  minimal?: boolean;
}

export default function Footer({ minimal = false }: FooterProps) {
  const [mounted, setMounted] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onHeroReady = () => setHeroReady(true);
    window.addEventListener('hero-ready', onHeroReady);
    return () => window.removeEventListener('hero-ready', onHeroReady);
  }, []);

  const isPromoActive = useIsPromoActive();
  const banner = PROMO_CONFIG.homepageBanner;

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: minimal ? 0 : 4, duration: 0.5, ease: "easeInOut" }}
      className={
        minimal
          ? "relative w-full select-none z-10 mt-auto pt-8"
          : "fixed bottom-0 w-full left-0 right-0 select-none z-50"
      }
    >
      {!minimal && mounted && isPromoActive && heroReady && (
        <motion.a
          href="https://beta.creator.sparkonomy.com/auth?service=earn"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto relative overflow-hidden block w-full px-2 py-2 mb-[30px] text-center cursor-pointer"
          style={{
            background:
              "linear-gradient(90deg, rgba(61, 88, 219, 0) 2.15%, rgba(110, 99, 255, 0.36) 30.53%, rgba(110, 99, 255, 0.36) 62.34%, rgba(61, 88, 219, 0) 96.24%)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-y-6 w-[60%] mix-blend-screen"
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
          <p className="relative text-white font-bold text-[14px] leading-tight text-center tracking-[-0.04em]">
            {banner.headline}
          </p>
          <p className="relative mt-2 text-white text-[12px] leading-snug flex items-center justify-center gap-2">
            <Image
              src="/promo/Hinglish Icon.png"
              alt=""
              width={20}
              height={20}
              className="inline-block w-5 h-5 object-contain"
            />
            <span>{banner.subheadline}</span>
          </p>
          <p className="relative mt-1 text-white text-[12px] leading-snug text-center">
            {banner.tagline} <em>{banner.taglineEmphasis}</em>
          </p>
        </motion.a>
      )}
      {!minimal && heroReady && (
        <motion.a
          href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto block text-center text-base font-normal italic text-zinc-400 hover:text-white transition-colors duration-300 mb-[30px] select-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          ✨ Spotlighted by Google Gemini ✨
        </motion.a>
      )}
      <div className="flex flex-col items-center space-y-2 w-full px-10 md:px-14 lg:px-20 pb-4">
        {!minimal && heroReady && (
          <motion.div
            className="pointer-events-auto mb-[30px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <LogoCarousel />
          </motion.div>
        )}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 text-[12px] md:text-[14px] text-gray-500 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {/* Left Column */}
          <div className="flex flex-row justify-center items-center md:items-start space-y-1 md:justify-self-start">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link href="/about" className="hover:underline hover:text-purple-400">About Us</Link>
              <Link href="/contact" className="hover:underline hover:text-purple-400">Contact Us</Link>
              <Link href="/blogs" className="hover:underline hover:text-purple-400">Blogs</Link>
            </div>
          </div>

          {/* Center Column - Copyright (always centered) */}
          <div className="flex items-center justify-center space-x-1 md:justify-self-center">
            {/*<Info className="w-3 h-3" />*/}
            <span className="text-center">© 2025-2026 Sparkonomy Pte. Ltd. All rights reserved</span>
          </div>

          {/* Right Column */}
          <div className="flex items-center justify-center md:justify-end space-x-2 md:space-x-4 md:justify-self-end">
            <Link href="/legal/privacy-policy" className="hover:underline hover:text-purple-400">Privacy Policy</Link>
            <Link href="/legal/terms" className="hover:underline hover:text-purple-400">Terms of Service</Link>
            <Link href="/legal/refund-policy" className="hover:underline hover:text-purple-400">Refunds</Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
