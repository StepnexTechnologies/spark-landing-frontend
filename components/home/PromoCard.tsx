"use client";

import {motion} from "framer-motion";
import Image from "next/image";
import {PROMO_CONFIG} from "@/lib/promo/config";

interface PromoCardProps {
  className?: string;
  href?: string;
}

const DEFAULT_HREF =
  "https://beta.creator.sparkonomy.com/auth?service=earn&lang=hi-Latn";

export default function PromoCard({className, href = DEFAULT_HREF}: PromoCardProps) {
  const banner = PROMO_CONFIG.homepageBanner;
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`pointer-events-auto relative overflow-hidden block w-full px-4 py-3 cursor-pointer ${className ?? ""}`}
      style={{
        background:
          "linear-gradient(90deg, rgba(61, 88, 219, 0) 2.15%, rgba(110, 99, 255, 0.36) 30.53%, rgba(110, 99, 255, 0.36) 62.34%, rgba(61, 88, 219, 0) 96.24%)",
      }}
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.7, ease: "easeOut"}}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-y-6 w-[60%] mix-blend-screen"
        style={{
          background:
            "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.06) 65%, transparent 100%)",
          filter: "blur(24px)",
        }}
        initial={{left: "-60%"}}
        animate={{left: "100%"}}
        transition={{
          duration: 3.2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 1.4,
        }}
      />
      <div className="relative flex items-center gap-3 max-w-md mx-auto">
        <div className="shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/15">
          <Image
            src="/promo/Hinglish Icon.png"
            alt=""
            width={24}
            height={24}
            className="w-6 h-6 object-contain"
          />
        </div>
        <div className="flex flex-col gap-0.5 text-left">
          <p className="text-white font-bold text-[14px] leading-tight tracking-[-0.02em]">
            {banner.headline}
          </p>
          <p className="text-white/80 text-[12px] leading-snug">
            {banner.subheadline}
            {banner.cta && <> <span className="italic">{banner.cta}</span></>}
          </p>
        </div>
      </div>
    </motion.a>
  );
}
