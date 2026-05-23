"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import StoryContent1 from "./stories/StoryContent1";

// Stories 2–4 are not the LCP candidate (story 1 is the only one painted at
// hydration) so they stream in on demand.
const StoryContent2 = dynamic(() => import("./stories/StoryContent2"), { ssr: false });
const StoryContent3 = dynamic(() => import("./stories/StoryContent3"), { ssr: false });
const StoryContent4 = dynamic(() => import("./stories/StoryContent4"), { ssr: false });

const STORY_INTERVAL_MS = 2000;

const STORY_COMPONENTS = [StoryContent1, StoryContent2, StoryContent3, StoryContent4] as const;

const STORY_IMAGES: Record<"en" | "hi-Latn", readonly string[]> = {
  en: [
    "/images/creator/earn/story-1.png",
    "/images/creator/earn/Story2.png",
    "/images/creator/earn/story-3.png",
    "/images/creator/earn/story-4.png",
  ],
  "hi-Latn": [
    "/images/creator/earn/story-1-hi-Latn.png",
    "/images/creator/earn/Story2-hi.png",
    "/images/creator/earn/story-3-hi-Latn.png",
    "/images/creator/earn/story-4-hi-Latn.png",
  ],
};

export default function HeroStoryCarousel() {
  const { i18n } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  const lang: "en" | "hi-Latn" = i18n.language?.startsWith("hi") ? "hi-Latn" : "en";
  const images = STORY_IMAGES[lang];

  // 2s loop. Reduced-motion users see the first story only — no rotation.
  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % STORY_COMPONENTS.length);
    }, STORY_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [prefersReducedMotion]);

  const ActiveStory = STORY_COMPONENTS[index];
  const activeImage = images[index];

  return (
    <div className="relative mx-auto w-full max-w-[360px] aspect-[360/640] mb-6 md:mb-8 rounded-[28px] overflow-hidden bg-black/40 p-[9px]">
      {/* Top-edge progress dots — 4 thin bars, the active one filling left-to-right
          on the same 2s cadence as the carousel rotation. */}
      <div className="absolute top-[17px] left-[17px] right-[17px] z-50 flex gap-1 pointer-events-none">
        {STORY_COMPONENTS.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden"
          >
            <motion.div
              className="h-full bg-white"
              initial={false}
              animate={{
                width:
                  i < index
                    ? "100%"
                    : i === index
                      ? prefersReducedMotion
                        ? "100%"
                        : ["0%", "100%"]
                      : "0%",
              }}
              transition={
                i === index && !prefersReducedMotion
                  ? { duration: STORY_INTERVAL_MS / 1000, ease: "linear" }
                  : { duration: 0 }
              }
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={index}
          className="absolute inset-[9px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <ActiveStory imageSrc={activeImage} priority={index === 0} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
