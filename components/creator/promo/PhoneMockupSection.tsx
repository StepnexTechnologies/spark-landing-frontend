"use client";

import {useEffect, useRef, useState} from "react";
import {AnimatePresence, motion, useInView, useReducedMotion} from "framer-motion";
import Image from "next/image";
import {useSectionViewTracking} from "@/lib/hooks/useSectionViewTracking";

const SCREENS = [
  "/promo/landing-promo/Screen_1.png",
  "/promo/landing-promo/Screen_2.png",
  "/promo/landing-promo/Screen_3.png",
];

const SLIDE_INTERVAL_MS = 5000;

export default function PhoneMockupSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {amount: 0.6});
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  useSectionViewTracking(sectionRef, "promo_phone_mockup");

  useEffect(() => {
    if (prefersReducedMotion || !inView) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % SCREENS.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [inView, prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="relative py-5 md:py-0 px-5">
      <div className="flex justify-center">
        <motion.div
          initial={{opacity: 0, y: 24}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: "-50px"}}
          transition={{duration: 0.5}}
          className="relative w-[212px] h-[433px]"
        >
          {/* Screen viewport — 190x412 inside the 212x433 phone frame (11px x bezel, ~10.5px y bezel) */}
          <div className="absolute inset-x-[11px] top-[10px] bottom-[11px] rounded-[34px] overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIndex}
                initial={{x: "100%", opacity: 0}}
                animate={{x: 0, opacity: 1}}
                exit={{x: "-100%", opacity: 0}}
                transition={{duration: 0.4, ease: "easeInOut"}}
                className="absolute inset-0"
              >
                <Image
                  src={SCREENS[activeIndex]}
                  alt=""
                  fill
                  sizes="212px"
                  className="object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Phone frame overlay — section is below the fold so we lazy-load. */}
          <Image
            src="/promo/landing-promo/Phone-layout.png"
            alt=""
            fill
            sizes="212px"
            className="object-contain pointer-events-none select-none z-10"
            loading="lazy"
            decoding="async"
          />
        </motion.div>
      </div>

      {/* Partner Logos */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true, margin: "-50px"}}
        transition={{duration: 0.6, delay: 0.2}}
        className="mt-8 flex items-center justify-center"
      >
        <Image
          src="/logos/Meta_White.png"
          alt="Built with Meta"
          height={32}
          width={120}
          className="h-[32px] w-auto object-contain pr-4 border-r border-white"
        />
        <Image
          src="/logos/Yt_White.png"
          alt="Developed with YouTube"
          height={32}
          width={120}
          className="h-[32px] w-auto object-contain pl-4"
        />
      </motion.div>
    </section>
  );
}
