"use client";

import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import Image from "next/image";
import EmailCapture from "@/components/EmailCapture";
import HomeFooterLinks from "@/components/home/HomeFooterLinks";
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
          : "relative w-full left-0 right-0 select-none z-50 md:fixed md:bottom-0 pointer-events-none"
      }
    >
      {!minimal && mounted && isPromoActive && heroReady && (
        <motion.a
          href="https://beta.creator.sparkonomy.com/auth?service=earn&lang=hi-Latn"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto relative overflow-hidden block w-full px-2 py-2 mt-[105px] mb-[105px] text-center cursor-pointer"
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
          <p className="relative mt-3 text-white text-[12px] leading-snug flex items-center justify-center gap-2">
            <Image
              src="/promo/Hinglish Icon.png"
              alt=""
              width={20}
              height={20}
              className="inline-block w-5 h-5 object-contain"
            />
            <span>{banner.subheadline}</span>
          </p>
        </motion.a>
      )}
      {!minimal && heroReady && (
        <motion.a
          href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto block text-center text-base font-normal italic text-zinc-400 hover:text-white transition-colors duration-300 select-none mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          ✨ Spotlighted by Google Gemini ✨
        </motion.a>
      )}
      <div className="flex flex-col items-center w-full px-2 md:px-14 lg:px-20 pb-[max(1rem,env(safe-area-inset-bottom))] pointer-events-none">
        {!minimal && heroReady && (
          <motion.div
            className="pointer-events-auto w-full mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <EmailCapture />
          </motion.div>
        )}
        {(minimal || heroReady) && <HomeFooterLinks />}
      </div>
    </motion.footer>
  );
}
