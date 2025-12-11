"use client";

import {Suspense} from "react";
import {motion} from "framer-motion";
import CTAButton from "./CTAButton";

export default function VideoSection() {
  return (
    <section className="relative py-12 md:py-20 px-5 md:px-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-[1440px] mx-auto"
      >
        {/* Video Player Container */}
        {/*<div className="relative max-w-full md:max-w-[855px] mx-auto mb-6 md:mb-8">*/}
        {/*  /!* Outer Container with Gradient Background *!/*/}
        {/*  <div className="bg-white/10 rounded-[16px] md:rounded-[48px] p-2 md:p-4">*/}
        {/*    /!* Inner Video Container *!/*/}
        {/*    <div className="relative w-full aspect-[347/201] md:aspect-[823/470] bg-[#212529] rounded-[12px] md:rounded-[33px] overflow-hidden">*/}
        {/*      /!* Placeholder for video *!/*/}
        {/*      <div className="absolute inset-0 flex flex-col items-center justify-center">*/}
        {/*        /!* Play Button *!/*/}
        {/*        <motion.button*/}
        {/*          whileHover={{ scale: 1.1 }}*/}
        {/*          whileTap={{ scale: 0.95 }}*/}
        {/*          className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center hover:bg-white/20 transition-colors"*/}
        {/*        >*/}
        {/*          <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-white ml-1" />*/}
        {/*        </motion.button>*/}
        {/*          <p className={"text-white"}>Awaited</p>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/* Video Description */}
        {/*<motion.div*/}
        {/*  initial={{ opacity: 0, y: 10 }}*/}
        {/*  whileInView={{ opacity: 1, y: 0 }}*/}
        {/*  viewport={{ once: true }}*/}
        {/*  transition={{ duration: 0.6, delay: 0.2 }}*/}
        {/*  className="text-center mb-8 md:mb-12"*/}
        {/*>*/}
        {/*  <p className="text-xs md:text-2xl font-normal md:font-semibold text-white">*/}
        {/*    How to Use: Lorem ipsum is the best font for the design*/}
        {/*  </p>*/}
        {/*</motion.div>*/}

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center"
        >
            <Suspense fallback={null}>
              <CTAButton buttonText={"Completely Free, Start Now"}/>
            </Suspense>
        </motion.div>
      </motion.div>
    </section>
  );
}
