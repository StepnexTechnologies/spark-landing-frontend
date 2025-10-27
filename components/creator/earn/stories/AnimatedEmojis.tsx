"use client";

import {motion} from "framer-motion";

interface AnimatedEmojisProps {
  emojis: string[];
  className?: string;
}

export default function AnimatedEmojis({ emojis, className = "" }: AnimatedEmojisProps) {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {emojis.map((emoji, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, scale: 0, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1 + 0.5,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="inline-block"
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}