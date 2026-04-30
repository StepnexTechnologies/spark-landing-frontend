"use client";

import {useEffect, useRef, useState} from "react";
import {AnimatePresence, motion, useInView, useReducedMotion} from "framer-motion";
import Image from "next/image";
import {useSectionViewTracking} from "@/lib/hooks/useSectionViewTracking";

const SCREENS = [
  "/promo/landing-promo/Screen 1.png",
  "/promo/landing-promo/screen 2.png",
  "/promo/landing-promo/screen 3.png",
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
          className="relative w-[172px] h-[353px]"
        >
          {/* Screen viewport — 154x335 centered inside the 172x353 phone frame (9px bezel) */}
          <div className="absolute inset-[9px] rounded-[28px] overflow-hidden">
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
                  sizes="172px"
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
            sizes="172px"
            className="object-contain pointer-events-none select-none z-10"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
