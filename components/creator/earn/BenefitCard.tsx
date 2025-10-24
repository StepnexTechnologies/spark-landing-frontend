"use client";

import {motion} from "framer-motion";
import Image from "next/image";

interface BenefitCardProps {
  title: string;
  description: string;
  imageUrl: string;
  decorativeImages?: Array<{ url: string; className: string }>;
}

export default function BenefitCard({
  title,
  description,
  imageUrl,
  decorativeImages = [],
}: BenefitCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-[358px] h-[412px] md:h-[436px] rounded-[32px]"
    >
      {/* Card Background */}
      <div className="absolute inset-0 rounded-[32px] bg-transparent" />

      {/* Image Container */}
      <div className="absolute left-4 top-4 right-4">
        {/* White Background with Opacity */}
        <div className="relative w-full h-[220px] rounded-[22px] bg-white/20 overflow-hidden">
          {/* Main Image */}
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-contain"
            />
          </div>

          {/* Decorative Images */}
          {decorativeImages.map((img, index) => (
            <div key={index} className={img.className}>
              <Image src={img.url} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Text Content */}
      <div className="absolute left-4 right-4 top-[250px] text-center text-white space-y-3.5">
        <h3 className="text-2xl font-semibold leading-normal">{title}</h3>
        <div
          className="text-sm leading-[1.4] px-2"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </motion.div>
  );
}
