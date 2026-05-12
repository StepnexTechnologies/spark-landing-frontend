"use client";

import {motion} from "framer-motion";

interface SpotlightedNoteProps {
  className?: string;
  href?: string;
}

const DEFAULT_HREF =
  "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/";

export default function SpotlightedNote({
  className,
  href = DEFAULT_HREF,
}: SpotlightedNoteProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`pointer-events-auto block text-center text-base font-normal italic text-zinc-400 hover:text-white transition-colors duration-300 select-none ${className ?? ""}`}
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.7, ease: "easeOut"}}
    >
      ✨ Spotlighted by Google Gemini ✨
    </motion.a>
  );
}
