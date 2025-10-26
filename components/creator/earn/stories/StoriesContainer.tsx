"use client";

import {useCallback, useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
// import { StoriesContainerProps } from "./types";
import StoryPanel from "./StoryPanel";
import StoryProgressBar from "./StoryProgressBar";
import StoryContent1 from "./StoryContent1";
import StoryContent2 from "./StoryContent2";
import StoryContent3 from "./StoryContent3";
import StoryContent4 from "./StoryContent4";

const STORY_DURATION = 6000; // 6 seconds per story

const stories = [
  { id: 1, component: StoryContent1, duration: STORY_DURATION },
  { id: 2, component: StoryContent2, duration: STORY_DURATION },
  { id: 3, component: StoryContent3, duration: STORY_DURATION },
  { id: 4, component: StoryContent4, duration: STORY_DURATION },
];

export default function StoriesContainer({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const currentStory = stories[currentIndex];
  const CurrentStoryComponent = currentStory.component;

  // Handle story progression
  useEffect(() => {
    if (isPaused || !isVisible) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = (100 / currentStory.duration) * 50; // Update every 50ms
        if (prev >= 100) {
          clearInterval(interval);
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, currentStory.duration, isVisible]);

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      // Mark stories as viewed in localStorage
      localStorage.setItem("storiesViewed", "true");
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
      }, 300);
    }
  }, [currentIndex, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  const handleClose = useCallback(() => {
    // Mark stories as viewed even if closed early
    localStorage.setItem("storiesViewed", "true");
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  }, [onComplete]);

  return (
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
          <div className="hidden md:flex items-center justify-center h-full">
            {/* Left Side Story (Blurred) */}
            <div className="absolute left-[10%] w-[292px] h-[580px] opacity-20 blur-sm pointer-events-none">
              {currentIndex > 0 && (
                <div className="w-full h-full bg-[#212529] rounded-3xl" />
              )}
            </div>

            {/* Center Story (Active) */}
            <div className="relative w-[390px] h-[773px] bg-[#212529] rounded-3xl overflow-hidden shadow-2xl">
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
              >
                <CurrentStoryComponent />
              </StoryPanel>

              {/* Skip Button */}
              {/*<button*/}
              {/*  onClick={handleClose}*/}
              {/*  className="absolute top-16 right-4 text-white text-sm font-medium bg-black/30 px-4 py-2 rounded-full hover:bg-black/50 transition-colors z-50"*/}
              {/*>*/}
              {/*  Skip*/}
              {/*</button>*/}
            </div>

            {/* Right Side Story (Blurred) */}
            <div className="absolute right-[10%] w-[292px] h-[580px] opacity-20 blur-sm pointer-events-none">
              {currentIndex < stories.length - 1 && (
                <div className="w-full h-full bg-[#212529] rounded-3xl" />
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
            >
              <CurrentStoryComponent />
            </StoryPanel>

            {/* Skip Button */}
            {/*<button*/}
            {/*  onClick={handleClose}*/}
            {/*  className="absolute top-16 right-4 text-white text-sm font-medium bg-black/30 px-4 py-2 rounded-full active:bg-black/50 transition-colors z-50"*/}
            {/*>*/}
            {/*  Skip*/}
            {/*</button>*/}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
