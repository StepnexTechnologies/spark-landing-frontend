"use client";

import {motion} from "framer-motion";
import {StoryPanelProps} from "./types";
// import StoryProgressBar from "./StoryProgressBar";
import {useEffect, useRef} from "react";
import {XIcon} from "lucide-react";

export default function StoryPanel({
  currentIndex,
  totalStories,
  onNext,
  onPrevious,
  onClose,
  children,
  isPaused,
  onPauseChange,
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
      className="relative w-full h-full cursor-pointer"
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
      {children}
      {/* Close button overlay - positioned to match the X icon in story content */}
      <button
        className="absolute top-[41px] right-3 z-50 text-white text-3xl p-2"
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
