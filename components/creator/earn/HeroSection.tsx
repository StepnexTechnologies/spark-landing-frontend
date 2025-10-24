"use client";

import {motion} from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative pt-24 md:pt-32 pb-12 md:pb-20 px-5 md:px-20 overflow-hidden">
      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-[1440px] mx-auto"
      >
        {/* Main Heading */}
        <h1 className="text-[32px] md:text-[52px] font-bold text-white text-center leading-tight mb-8 md:mb-12 max-w-[350px] md:max-w-[740px] mx-auto">
          India&apos;s 1st, invoicing AI exclusively for Creators. Now in Private Beta.⚡️
        </h1>

        {/* Image Container with Glassmorphic Background */}
        <div className="relative w-full max-w-[356px] md:max-w-[821px] mx-auto">
          {/* Glassmorphic Card */}
          <div className="absolute inset-0 rounded-[26px] md:rounded-[60px] bg-white/16 backdrop-blur-sm p-[10px] md:p-[23px]">
            <div className="w-full h-full rounded-[22px] md:rounded-[50px] bg-white/16 backdrop-blur-[2px]" />
          </div>

          {/* Woman with Phone Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative z-10 pt-4 md:pt-8"
          >
            <div className="relative w-[340px] h-[273px] md:w-[784px] md:h-[630px] mx-auto">
              <Image
                src="/images/creator/earn/hero-illustration.png"
                alt="Happy woman pointing at phone showing invoice"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
