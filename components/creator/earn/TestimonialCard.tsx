"use client";

import {motion} from "framer-motion";
import Image from "next/image";

interface TestimonialCardProps {
  quote: string;
  name: string;
  handle: string;
  avatarUrl: string;
  highlighted?: boolean;
  index: number;
  // When true, render the card statically (no fade-in / slide-up). Use this
  // for cards inside a carousel where overflow:hidden + a small peek can
  // prevent whileInView from firing for off-center slides on initial render.
  disableEntryAnimation?: boolean;
}

export default function TestimonialCard({
  quote,
  name,
  handle,
  avatarUrl,
  highlighted = false,
  index,
  disableEntryAnimation = false,
}: TestimonialCardProps) {
  const motionProps = disableEntryAnimation
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" },
        transition: { duration: 0.6, delay: index * 0.1 },
      };

  return (
    <motion.div
      {...motionProps}
      className={`
        p-3 rounded-[24px] bg-gradient-to-br from-white/10 via-white/0 to-black/10 border border-[#FFFFFF33] backdrop-blur-[2px]
        ${highlighted ? "bg-white/10" : "bg-transparent"}
        min-w-[315px] md:max-w-[364px] flex flex-col gap-4
      `}
    >
      {/* Quote */}
      <p className="text-white text-base leading-[1.2] text-center italic min-h-[77px] flex items-center justify-center">
        &ldquo;{quote}&rdquo;
      </p>

      {/* User Info */}
      <div className="flex items-center justify-center gap-3">
        {/* Avatar */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <Image src={avatarUrl} alt={name} fill className="object-cover" />
        </div>

        {/* Name and Handle */}
        <div className="flex flex-col">
          <span className="text-white font-medium text-base leading-normal">
            {name}
          </span>
          <span className="text-white font-normal leading-5 text-sm">{handle}</span>
        </div>
      </div>
    </motion.div>
  );
}
