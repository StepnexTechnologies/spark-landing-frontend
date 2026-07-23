"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Heart, Send } from "lucide-react";
import AnimatedEmojis from "./stories/AnimatedEmojis";
import FloatingHearts from "./stories/FloatingHearts";
import {
  STORY_IMAGES,
  nextImageUrl,
  storySrcSet,
  type StoryLang,
} from "./storyImages";

const HEARTS_STORY_INDEX = 3; // Story 4 — gets the rising-hearts fountain
const HEARTS_TRIGGER_MS = 1400;

// Emoji sets per story — mirror the full-screen StoryContent1..4 bottom bars.
const STORY_EMOJIS: readonly (readonly string[])[] = [
  ["🙋🏼‍♂️", "🙋🏼‍♀️", "🙋🏻‍♂️", "🙋🏻‍♀️", "🙋🏾‍♀️", "🙋🏽", "🙋🏽‍♀️", "🙋‍♂️"],
  ["💔", "💔", "💔", "💔", "💔", "💔", "💔", "💔"],
  ["😤", "🤯", "😤", "🤯", "😤", "🤯", "😤", "🤯", "😤", "😫"],
  ["❤️", "❤️", "❤️", "❤️", "❤️", "❤️", "❤️", "❤️", "❤️", "❤️"],
];

// Per-story hold times — the last story lingers longer before looping.
const STORY_DURATIONS_MS = [2000, 2000, 2000, 4000];
const TOTAL_STORIES = STORY_DURATIONS_MS.length;

export default function HeroStoryCarousel() {
  const { i18n } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [heartTriggerCount, setHeartTriggerCount] = useState(0);

  const lang: StoryLang = i18n.language?.startsWith("hi") ? "hi-Latn" : "en";
  const images = STORY_IMAGES[lang];

  useEffect(() => {
    // Warm stories 2-4. These were <link rel="preload"> in the document head;
    // moving them here takes three image fetches out of the LCP window and off
    // the `load` event, while still giving them the whole hydration→rotation gap
    // to arrive so swaps never flash black. fetchpriority=low keeps them behind
    // the story-1 preload in the browser's queue. Same URL builder as the head
    // preload, so a cached variant is reused rather than refetched.
    const warm = () => {
      for (const src of images.slice(1)) {
        const img = document.createElement("img");
        img.decoding = "async";
        img.setAttribute("fetchpriority", "low");
        img.srcset = storySrcSet(src);
        img.src = nextImageUrl(src, 384);
      }
    };

    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(warm, { timeout: 2000 });
      return () => window.cancelIdleCallback?.(handle);
    }
    const id = window.setTimeout(warm, 300);
    return () => window.clearTimeout(id);
  }, [images]);

  useEffect(() => {
    // Hold story 1 until the page finishes loading before auto-advancing. This
    // keeps the hero visually stable through the first-paint window (so swaps
    // don't inflate Speed Index) and guarantees stories 2-4 have been preloaded
    // and decoded before they're shown (no black flash between stories on slow
    // connections). Fast connections fire 'load' within a second or two, so real
    // users still get prompt rotation; the fallback covers a stalled 'load'.
    let fallbackId: number | undefined;
    const start = () => {
      window.clearTimeout(fallbackId);
      setStarted(true);
    };
    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
      // Cap the wait so a slow 'load' (lots of third-party) never leaves the
      // carousel frozen — 4s is past the first-paint window but still prompt.
      fallbackId = window.setTimeout(start, 4000);
    }
    return () => {
      window.removeEventListener("load", start);
      window.clearTimeout(fallbackId);
    };
  }, []);

  useEffect(() => {
    // Advance regardless of prefers-reduced-motion: bailing out here froze the
    // carousel on story 1, hiding 3/4 of the content. Crucially this also fires
    // for anyone on iOS Low Power Mode (Safari reports reduced-motion then), so
    // a frozen hero was hitting a large slice of mobile traffic, not just users
    // who opted into reduced motion. Reduced motion is honoured by swapping the
    // images instantly (no slide) below, not by stopping rotation.
    if (!started) return;
    const timeoutId = window.setTimeout(() => {
      setIndex((i) => (i + 1) % TOTAL_STORIES);
    }, STORY_DURATIONS_MS[index]);
    return () => window.clearTimeout(timeoutId);
  }, [started, index]);

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
              <m.div
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
                    ? { duration: STORY_DURATIONS_MS[index] / 1000, ease: "linear" }
                    : { duration: 0 }
                }
              />
            </div>
          ))}
        </div>

        <div className="relative w-[210px] h-[312px] rounded-2xl overflow-hidden">
          {/* Story image — the outgoing story slides out left while the next
              slides in from the right, like swiping through social stories.
              initial={false} on AnimatePresence keeps the first story (the
              page's LCP element) static in the server HTML at full opacity, so
              it paints the instant it downloads instead of waiting for a
              framer-motion enter animation after hydration (an opacity:0→1
              enter here was adding seconds of render delay to LCP).
              width=192 → Next serves its w=384 srcset variant (≈half the
              bytes) for the 210px box; page.tsx preload mirrors it. */}
          <AnimatePresence initial={false}>
            <m.div
              key={index}
              className="absolute inset-0"
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.4,
                ease: [0.32, 0.72, 0, 1],
              }}
            >
              <Image
                src={activeImage}
                alt={`Story ${index + 1}`}
                width={192}
                height={285}
                priority={index === 0}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </m.div>
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
