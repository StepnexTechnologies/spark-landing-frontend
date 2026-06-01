"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Heart, Send } from "lucide-react";
import AnimatedEmojis from "./stories/AnimatedEmojis";
import FloatingHearts from "./stories/FloatingHearts";

const HEARTS_STORY_INDEX = 3; // Story 4 — gets the rising-hearts fountain
const HEARTS_TRIGGER_MS = 1400;

// Emoji sets per story — mirror the full-screen StoryContent1..4 bottom bars.
const STORY_EMOJIS: readonly (readonly string[])[] = [
  ["🙋🏼‍♂️", "🙋🏼‍♀️", "🙋🏻‍♂️", "🙋🏻‍♀️", "🙋🏾‍♀️", "🙋🏽", "🙋🏽‍♀️", "🙋‍♂️"],
  ["💔", "💔", "💔", "💔", "💔", "💔", "💔", "💔"],
  ["😤", "🤯", "😤", "🤯", "😤", "🤯", "😤", "🤯", "😤", "😫"],
  ["❤️", "❤️", "❤️", "❤️", "❤️", "❤️", "❤️", "❤️", "❤️", "❤️"],
];

const STORY_INTERVAL_MS = 2000;
const TOTAL_STORIES = 4;

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
  const [heartTriggerCount, setHeartTriggerCount] = useState(0);

  const lang: "en" | "hi-Latn" = i18n.language?.startsWith("hi") ? "hi-Latn" : "en";
  const images = STORY_IMAGES[lang];

  useEffect(() => {
    // Advance regardless of prefers-reduced-motion: bailing out here froze the
    // carousel on story 1, hiding 3/4 of the content. Crucially this also fires
    // for anyone on iOS Low Power Mode (Safari reports reduced-motion then), so
    // a frozen hero was hitting a large slice of mobile traffic, not just users
    // who opted into reduced motion. Reduced motion is honoured by swapping the
    // images instantly (no crossfade) below, not by stopping rotation.
    let intervalId: number | undefined;
    let fallbackId: number | undefined;
    const start = () => {
      if (intervalId !== undefined) return;
      window.clearTimeout(fallbackId);
      intervalId = window.setInterval(() => {
        setIndex((i) => (i + 1) % TOTAL_STORIES);
      }, STORY_INTERVAL_MS);
    };
    // Hold story 1 until the page finishes loading before auto-advancing. This
    // keeps the hero visually stable through the first-paint window (so swaps
    // don't inflate Speed Index) and guarantees stories 2-4 have been preloaded
    // and decoded before they're shown (no black flash between stories on slow
    // connections). Fast connections fire 'load' within a second or two, so real
    // users still get prompt rotation; the 6s fallback covers a stalled 'load'.
    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
      fallbackId = window.setTimeout(start, 6000);
    }
    return () => {
      window.removeEventListener("load", start);
      window.clearTimeout(fallbackId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, []);

  // Hearts fountain only runs while the hearts story is active.
  useEffect(() => {
    if (index !== HEARTS_STORY_INDEX) return;
    setHeartTriggerCount((c) => c + 1);
    const id = window.setInterval(() => {
      setHeartTriggerCount((c) => c + 1);
    }, HEARTS_TRIGGER_MS);
    return () => window.clearInterval(id);
  }, [index]);

  const activeImage = images[index];
  const isHeartsStory = index === HEARTS_STORY_INDEX;

  return (
    <div className="relative mx-auto w-fit px-2 py-1.5 mb-6 md:mb-8 rounded-[18.5px] bg-black">
      <div className="flex flex-col gap-1.5 w-[210px]">
        {/* Progress bars — sit above the image, not over it */}
        <div className="flex gap-1 pointer-events-none">
          {Array.from({ length: TOTAL_STORIES }).map((_, i) => (
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

        <div className="relative w-[210px] h-[312px] rounded-2xl overflow-hidden">
          {/* Story image */}
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: "easeInOut" }}
            >
              <Image
                src={activeImage}
                alt={`Story ${index + 1}`}
                width={210}
                height={312}
                priority={index === 0}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom bar — type bar + heart + send */}
        <div className="flex items-center gap-[9px]">
          <div className="flex-1 min-w-0 overflow-hidden border border-white/50 rounded-full px-2 py-0.5 flex items-center">
            <AnimatedEmojis key={index} emojis={[...STORY_EMOJIS[index]]} className="text-[9px]" />
          </div>
          <Heart
            width={13.5}
            height={13.5}
            className={isHeartsStory ? "text-[#FF0000]" : "text-white"}
            fill={isHeartsStory ? "#FF0000" : "none"}
          />
          <Send width={13.5} height={13.5} className="text-white" />
        </div>
      </div>

      {/* Rising hearts fountain — Story 4 only. FloatingHearts is sized for
          the 390×773 panel, so scale it down to match this 210-wide frame.
          Rendered outside the image's overflow-hidden box so hearts can
          rise from the heart icon and past the image. */}
      {isHeartsStory && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ transform: "scale(0.55)", transformOrigin: "bottom right" }}
        >
          <FloatingHearts triggerCount={heartTriggerCount} />
        </div>
      )}
    </div>
  );
}
