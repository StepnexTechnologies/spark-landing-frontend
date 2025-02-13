"use client";

import type React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "./Vortex";
import EmailCapture from "./EmailCapture";
import Footer from "./Footer";

const Hero: React.FC = () => {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-between relative overflow-hidden bg-black">
      <div className="w-full max-w-6xl mx-auto flex-1">
        <LampContainer>
          <div className="z-10 text-center relative flex flex-col min-h-[60vh] justify-between">
            <div className="flex-1 flex flex-col items-center justify-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-8 sm:mb-12 text-white tracking-wide mt-20"
                style={{
                  textShadow:
                    "0 0 20px rgba(56, 189, 248, 0.5), 0 0 40px rgba(56, 189, 248, 0.25)",
                }}
              >
                IGNITING NOW...
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-8 sm:mb-12 text-white uppercase tracking-wider"
              >
                sparkonomy
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white mb-12 sm:mb-16"
              >
                Developing AI to spark livelihoods globally
              </motion.div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="px-4 sm:px-6 md:px-8">
                <EmailCapture />
              </div>
            </div>
            <div className="mt-auto">
              <Footer />
            </div>
          </div>
        </LampContainer>
      </div>
    </section>
  );
};

export default Hero;
