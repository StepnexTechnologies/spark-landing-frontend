"use client";

import {motion} from "framer-motion";
import {useEffect, useMemo} from "react";

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
  // Memoize random values so they don't change on re-render (prevents glitching)
  const animationProps = useMemo(() => ({
    randomX: Math.random() * 60 - 30, // -30 to 30px horizontal drift
    randomRotate: Math.random() * 20 - 10, // -10 to 10 degrees rotation
    randomScale: 0.7 + Math.random() * 0.6, // 0.7 to 1.3 scale
    duration: 3 + Math.random() * 1, // 3 to 4 seconds
    color: heartColors[Math.floor(Math.random() * heartColors.length)],
  }), [id]); // Only recalculate if id changes

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(id);
    }, (animationProps.duration + delay) * 1000);

    return () => clearTimeout(timer);
  }, [id, onComplete, animationProps.duration, delay]);

  return (
    <motion.div
      className="absolute pointer-events-none"
      initial={{
        y: 0,
        x: 0,
        opacity: animationProps.color.opacity,
        scale: animationProps.randomScale,
        rotate: 0,
      }}
      animate={{
        y: -420,
        x: animationProps.randomX,
        opacity: 0,
        rotate: animationProps.randomRotate,
      }}
      transition={{
        duration: animationProps.duration,
        delay: delay,
        ease: [0.33, 0.01, 0.23, 1], // Smoother cubic-bezier curve
        opacity: {
          duration: animationProps.duration * 0.8,
          delay: delay + animationProps.duration * 0.4, // Start fading later for smoother appearance
          ease: "easeOut",
        },
      }}
      style={{
        width: 32, // Fixed base size - variation comes from scale only
        height: 32,
        willChange: "transform, opacity", // GPU acceleration hint
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill={animationProps.color.fill}
          opacity={animationProps.color.opacity}
        />
      </svg>
    </motion.div>
  );
}
