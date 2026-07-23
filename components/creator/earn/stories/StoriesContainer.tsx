"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import {useSearchParams} from "next/navigation";
import {AnimatePresence, motion} from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
// import { StoriesContainerProps } from "./types";
import StoryPanel from "./StoryPanel";
import StoryProgressBar from "./StoryProgressBar";
import StoryContent1 from "./StoryContent1";
// Stories 2-4 only appear after user interaction (auto-advance or click), so
// they stay out of the initial bundle. Story 1 is the LCP candidate and must
// ship inline.
const StoryContent2 = dynamic(() => import("./StoryContent2"), { ssr: false });
const StoryContent3 = dynamic(() => import("./StoryContent3"), { ssr: false });
const StoryContent4 = dynamic(() => import("./StoryContent4"), { ssr: false });
import {track} from "@/lib/analytics/track";

const STORY_DURATION = 2500; // fallback for any story without an explicit duration
const STORY_DURATIONS = [5000, 3000, 3000, 4000];

// Image paths for each language
const storyImages = {
  en: [
    "/images/creator/earn/story-1.png",
    "/images/creator/earn/story-4.png",
    "/images/creator/earn/story-3.png",
    "/images/creator/earn/story-2.png",
  ],
  "hi-Latn": [
    "/images/creator/earn/story-1-hi-Latn.png",
    "/images/creator/earn/story-2-hi-Latn.png",
    "/images/creator/earn/story-3-hi-Latn.png",
    "/images/creator/earn/story-4-hi-Latn.png",
  ],
};

const storyComponents = [StoryContent1, StoryContent2, StoryContent3, StoryContent4];

export default function StoriesContainer({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const searchParams = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  // 1 = advancing (new story slides in from the right), -1 = going back
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  // Becomes true after hydration; gates the hidden image preloader so it
  // doesn't compete with story 1's LCP image on the very first paint.
  const [warmupStarted, setWarmupStarted] = useState(false);
  const startedAt = useRef<number>(0);

  useEffect(() => {
    startedAt.current = performance.now();
    track("story_start", { story_index: 0 });
  }, []);

  // Warm up everything the next stories need. Without this, the first
  // advance shows a blank panel: the dynamic chunk for StoryContent2 and its
  // image only start downloading once the slide-in animation has begun
  // (mobile renders only the active story, so nothing prefetches them).
  useEffect(() => {
    import("./StoryContent2");
    import("./StoryContent3");
    import("./StoryContent4");
    setWarmupStarted(true);
  }, []);

  // Get language from URL params, default to 'en'
  const langParam = searchParams.get("lang");
  const lang = langParam === "hi-Latn" ? "hi-Latn" : "en";
  const images = storyImages[lang];

  const stories = storyComponents.map((component, index) => ({
    id: index + 1,
    component,
    duration: STORY_DURATIONS[index] ?? STORY_DURATION,
    imageSrc: images[index],
  }));

  const currentStory = stories[currentIndex];
  const previousStory = stories[currentIndex >= 0 ? currentIndex - 1 : 0];
  const nextStory = stories[currentIndex < stories.length - 1 ? currentIndex + 1 : stories.length - 1];

  const CurrentStoryComponent = currentStory?.component;
  const PreviousStoryComponent = previousStory?.component;
  const NextStoryComponent = nextStory?.component;

  // Handle story progression via requestAnimationFrame — cheaper than a 20Hz
  // setInterval that was re-rendering the progress bar + story tree every 50ms
  // (Lighthouse flagged this as a major TBT + long-task contributor on mobile).
  useEffect(() => {
    if (isPaused || !isVisible) return;

    const duration = currentStory?.duration ?? STORY_DURATION;
    let rafId = 0;
    let startTs = 0;
    let advanced = false;

    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const elapsed = ts - startTs;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        if (!advanced) {
          advanced = true;
          advance("auto");
        }
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [currentIndex, isPaused, currentStory?.duration, isVisible]);

  const advance = useCallback((trigger: "auto" | "click") => {
    if (currentIndex < stories.length - 1) {
      track("story_advance", {
        from_index: currentIndex,
        to_index: currentIndex + 1,
        trigger,
      });
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      track("story_complete", {
        total_duration_ms: Math.round(performance.now() - startedAt.current),
        trigger,
      });
      sessionStorage.setItem("storiesViewed", "true");
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
      }, 300);
    }
  }, [currentIndex, onComplete, stories.length]);

  const handleNext = useCallback(() => advance("click"), [advance]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      track("story_back", {
        from_index: currentIndex,
        to_index: currentIndex - 1,
      });
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  const handleClose = useCallback(() => {
    track("story_close", { exit_index: currentIndex });
    // Mark stories as viewed even if closed early
    sessionStorage.setItem("storiesViewed", "true");
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  }, [onComplete, currentIndex]);

  return (
    <>
      {/* Hidden preloader: fetches upcoming story images into the browser
          cache. Props must match the <Image> in StoryContent* exactly so the
          browser resolves the same /_next/image URL. */}
      {warmupStarted && (
        <div aria-hidden className="absolute w-0 h-0 overflow-hidden" style={{ visibility: "hidden" }}>
          {images.slice(1).map((src) => (
            <Image
              key={src}
              src={src}
              alt=""
              width={362}
              height={595}
              sizes="(max-width: 640px) 90vw, 362px"
              loading="eager"
              fetchPriority="low"
            />
          ))}
        </div>
      )}
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Desktop Layout - Instagram Style */}
          <div className="hidden md:flex items-center justify-center h-full bg-[#212529]">
            {/* Left Side Story (Blurred) */}
            <div
              className="absolute scale-75 left-[10%] bottom-[25%] w-[292px] h-[580px] opacity-10 blur-sm cursor-pointer hover:opacity-20 transition-opacity"
              onClick={handlePrevious}
            >
              {currentIndex > 0 && (
                  <div className="relative w-[390px] h-[773px] bg-[#212529] rounded-3xl overflow-hidden pointer-events-none">
                      <StoryProgressBar
                          currentIndex={currentIndex - 1}
                          totalStories={stories.length}
                          progress={progress}
                      />
                      <StoryPanel
                          currentIndex={currentIndex - 1}
                          totalStories={stories.length}
                          onNext={handleNext}
                          onPrevious={handlePrevious}
                          onClose={handleClose}
                          isPaused={isPaused}
                          onPauseChange={setIsPaused}
                          direction={direction}
                      >
                          <PreviousStoryComponent imageSrc={previousStory?.imageSrc} priority={false} />
                      </StoryPanel>
                  </div>
              )}
            </div>

            {/* Center Story (Active) */}
            <div className="relative w-[390px] h-[773px] bg-[#212529] rounded-3xl overflow-hidden">
              <StoryProgressBar
                currentIndex={currentIndex}
                totalStories={stories.length}
                progress={progress}
              />
              <StoryPanel
                currentIndex={currentIndex}
                totalStories={stories.length}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onClose={handleClose}
                isPaused={isPaused}
                onPauseChange={setIsPaused}
                direction={direction}
              >
                <CurrentStoryComponent imageSrc={currentStory?.imageSrc} priority />
              </StoryPanel>
            </div>

            {/* Right Side Story (Blurred) */}
              <div
                className="absolute scale-75 right-[10%] bottom-[25%] w-[292px] h-[580px] opacity-10 blur-sm cursor-pointer hover:opacity-20 transition-opacity"
                onClick={handleNext}
              >
                  {currentIndex < 3 && (
                      <div className="relative w-[390px] h-[773px] bg-[#212529] rounded-3xl overflow-hidden pointer-events-none">
                          <StoryProgressBar
                              currentIndex={currentIndex + 1}
                              totalStories={stories.length}
                              progress={progress}
                          />
                          <StoryPanel
                              currentIndex={currentIndex + 1}
                              totalStories={stories.length}
                              onNext={handleNext}
                              onPrevious={handlePrevious}
                              onClose={handleClose}
                              isPaused={isPaused}
                              onPauseChange={setIsPaused}
                              direction={direction}
                          >
                              <NextStoryComponent imageSrc={nextStory?.imageSrc} priority={false} />
                          </StoryPanel>
                      </div>
                  )}
              </div>
          </div>

          {/* Mobile Layout - Fullscreen */}
          <div className="md:hidden relative w-full h-full">
            <StoryProgressBar
              currentIndex={currentIndex}
              totalStories={stories.length}
              progress={progress}
            />
            <StoryPanel
              currentIndex={currentIndex}
              totalStories={stories.length}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onClose={handleClose}
              isPaused={isPaused}
              onPauseChange={setIsPaused}
              direction={direction}
            >
              <CurrentStoryComponent imageSrc={currentStory?.imageSrc} priority />
            </StoryPanel>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
