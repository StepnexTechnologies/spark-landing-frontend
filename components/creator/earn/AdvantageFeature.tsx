"use client";

import {motion} from "framer-motion";
import Image from "next/image";

interface AdvantageFeatureProps {
  title: string;
  description: string;
  iconUrl: string;
  hasMoneyIcon?: boolean;
  index: number;
}

export default function AdvantageFeature({
  title,
  description,
  iconUrl,
  hasMoneyIcon = false,
  index,
}: AdvantageFeatureProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex flex-row md:flex-col gap-3.5 items-center md:justify-center text-center md:text-left pb-3 border-b border-white/20 w-full md:max-w-none"
    >
      {/* Icon Container */}
      <div className="relative w-[65px] h-[79px] flex-shrink-0">
        <Image src={iconUrl} alt={title} fill className="object-contain" />
        {hasMoneyIcon && (
          <div className="absolute top-1 left-[23px] w-[41px] h-[17px] rotate-180 scale-y-[-1]">
            <Image
              src="https://www.figma.com/api/mcp/asset/e9252177-37c7-44e2-b1f8-40a878147f92"
              alt=""
              fill
              className="object-contain"
            />
          </div>
        )}
      </div>

      {/* Text Content */}
      <div className="flex flex-col items-start md:items-center justify-center gap-3.5 max-w-[247px]">
        <h3 className="text-2xl font-semibold text-white leading-normal">
          {title}
        </h3>
        <p className="text-sm text-white text-left md:text-center">{description}</p>
      </div>
    </motion.div>
  );
}
