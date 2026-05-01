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
  const inView = useInView(sectionRef, {margin: "0px"});
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
                  priority={activeIndex === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Phone frame overlay */}
          <Image
            src="/promo/landing-promo/Phone-layout.png"
            alt=""
            fill
            sizes="212px"
            className="object-contain pointer-events-none select-none z-10"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
