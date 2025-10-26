"use client";

import {motion} from "framer-motion";
import {StoryProgressBarProps} from "./types";

export default function StoryProgressBar({
  currentIndex,
  totalStories,
  progress,
}: StoryProgressBarProps) {
  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-2 z-50 mt-2">
      <div className="flex gap-1">
        {Array.from({ length: totalStories }).map((_, index) => (
          <div
            key={index}
            className="flex-1 h-[2.5px] bg-white/30 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: "0%" }}
              animate={{
                width:
                  index < currentIndex
                    ? "100%"
                    : index === currentIndex
                    ? `${progress}%`
                    : "0%",
              }}
              transition={{
                duration: index === currentIndex ? 0.1 : 0.3,
                ease: "linear",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
