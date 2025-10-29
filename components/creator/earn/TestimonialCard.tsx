"use client";

import {motion} from "framer-motion";
import Image from "next/image";
import {Check} from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  handle: string;
  avatarUrl: string;
  highlighted?: boolean;
  index: number;
}

export default function TestimonialCard({
  quote,
  name,
  handle,
  avatarUrl,
  highlighted = false,
  index,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`
        p-6 rounded-[32px] bg-gradient-to-br from-white/10 via-white/0 to-black/10 border border-white/20 backdrop-blur-[2px]
        ${highlighted ? "bg-white/10" : "bg-transparent"}
        max-w-[284px] md:max-w-[364px]
      `}
    >
      {/* Quote */}
      <p className="text-white text-[15px] leading-normal text-center mb-3 h-[124px] flex items-center justify-center">
        &ldquo;{quote}&rdquo;
      </p>

      {/* User Info */}
      <div className="flex items-center gap-3 px-0 py-4">
        {/* Avatar */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <Image src={avatarUrl} alt={name} fill className="object-cover" />
        </div>

        {/* Name and Handle */}
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-1">
            <span className="text-white font-medium text-[14px] leading-normal">
              {name}
            </span>
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
          </div>
          <span className="text-white leading-5 text-[12px]">{handle}</span>
        </div>
      </div>
    </motion.div>
  );
}
