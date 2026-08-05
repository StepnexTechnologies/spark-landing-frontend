"use client";

import {AnimatePresence, motion} from "framer-motion";
import {StoryPanelProps} from "./types";
// import StoryProgressBar from "./StoryProgressBar";
import {useEffect, useRef} from "react";
import {XIcon} from "lucide-react";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? "100%" : "-100%",
  }),
  center: { x: "0%" },
  exit: (direction: number) => ({
    x: direction >= 0 ? "-100%" : "100%",
  }),
};

export default function StoryPanel({
  currentIndex,
  totalStories,
  onNext,
  onPrevious,
  onClose,
  children,
  isPaused,
  onPauseChange,
  direction,
}: StoryPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click navigation
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const width = rect.width;

    // Click on left third = previous, right two-thirds = next
    if (clickX < width / 3) {
      onPrevious();
    } else {
      onNext();
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        onPrevious();
      } else if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        onNext();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onPrevious, onClose]);

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-full cursor-pointer overflow-hidden"
      onClick={handleClick}
      onMouseDown={() => onPauseChange(true)}
      onMouseUp={() => onPauseChange(false)}
      onMouseLeave={() => onPauseChange(false)}
      onTouchStart={() => onPauseChange(true)}
      onTouchEnd={() => onPauseChange(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="sync" initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { type: "tween", duration: 0.35, ease: [0.32, 0.72, 0, 1] } }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      {/* Close button overlay - positioned to match the X icon in story content */}
      <button
        className="absolute top-[16px] right-3 z-50 text-white text-3xl p-2"
        onClick={handleCloseClick}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        aria-label="Close stories"
      >
        <XIcon />
      </button>
    </motion.div>
  );
}
