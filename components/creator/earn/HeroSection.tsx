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

          {/* Woman with Phone Image */}
          <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
          >
              <div className={"absolute flex w-full max-w-[356px] md:max-w-[821px] left-1 mt-[36px]"}>
                <div className="rounded-[32px] p-[10px] bg-gradient-to-br from-white/20 via-white/0 to-black/10 border border-white/20 backdrop-blur-lg shadow-[10px_10px_30px_rgba(0,0,0,0.2),-10px_-10px_30px_rgba(255,255,255,0.1)]">
                  {/* Inner Glassmorphic Container */}
                  <div className="rounded-[26px] bg-white/15 backdrop-blur-[2px] w-[356px] h-[227px] md:p-8"/>
                </div>
              </div>
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
      </motion.div>
    </section>
  );
}
