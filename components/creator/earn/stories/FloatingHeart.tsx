"use client";

import {motion} from "framer-motion";
import {useEffect} from "react";

interface FloatingHeartProps {
  id: string;
  onComplete: (id: string) => void;
  delay?: number;
}

const heartColors = [
  { fill: "#FF0000", opacity: 1 },       // Bright red
  { fill: "#FF1744", opacity: 0.9 },     // Red
  { fill: "#FF6B9D", opacity: 0.8 },     // Pink
  { fill: "#FFC0CB", opacity: 0.7 },     // Light pink
  { fill: "#FFB6C1", opacity: 0.6 },     // Light pink
];

export default function FloatingHeart({ id, onComplete, delay = 0 }: FloatingHeartProps) {
  // Random values for natural movement
  const randomX = Math.random() * 100 - 50; // -50 to 50px horizontal drift
  const randomRotate = Math.random() * 40 - 20; // -20 to 20 degrees rotation
  const randomScale = 0.5 + Math.random() * 1; // 0.5 to 1.5 scale (bigger variation)
  const duration = 2.5 + Math.random() * 1.5; // 2.5 to 4 seconds
  const randomColor = heartColors[Math.floor(Math.random() * heartColors.length)];
  const heartSize = 16 + Math.random() * 32; // 16px to 48px

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(id);
    }, (duration + delay) * 1000);

    return () => clearTimeout(timer);
  }, [id, onComplete, duration, delay]);

  return (
    <motion.div
      className="absolute pointer-events-none"
      initial={{
        y: 0,
        x: 0,
        opacity: randomColor.opacity,
        scale: randomScale,
        rotate: 0,
      }}
      animate={{
        y: -400,
        x: randomX,
        opacity: 0,
        rotate: randomRotate,
      }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94], // Ease-out
        opacity: {
          duration: duration * 0.7,
          delay: delay + duration * 0.3, // Start fading earlier
        },
      }}
      style={{ width: heartSize, height: heartSize }}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill={randomColor.fill}
          opacity={randomColor.opacity}
        />
      </svg>
    </motion.div>
  );
}
