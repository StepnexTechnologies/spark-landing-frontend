"use client";

import type React from "react";
import {useState} from "react";
import {motion} from "framer-motion";
import {ArrowRight, TrendingUp} from "lucide-react";

interface CampaignTrackerCTAProps {
  isVisible: boolean;
}

export default function CampaignTrackerCTA({ isVisible }: CampaignTrackerCTAProps) {
  const [isHovered, setIsHovered] = useState(false);

  const glowVariants = {
    initial: {
      boxShadow: "0 0 30px rgba(108,99,255,0.6), 0 0 60px rgba(108,99,255,0.3), 0 0 90px rgba(108,99,255,0.1)",
    },
    hover: {
      boxShadow: [
        "0 0 40px rgba(108,99,255,0.8), 0 0 80px rgba(108,99,255,0.5), 0 0 120px rgba(108,99,255,0.3)",
        "0 0 60px rgba(108,99,255,1), 0 0 100px rgba(108,99,255,0.7), 0 0 150px rgba(108,99,255,0.4)",
        "0 0 40px rgba(108,99,255,0.8), 0 0 80px rgba(108,99,255,0.5), 0 0 120px rgba(108,99,255,0.3)",
      ],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  };

  const handleClick = () => {
    // Replace with actual Campaign Tracker landing page URL
    window.open("https://beta.brand.sparkonomy.com/rtct", "_blank");
  };

  return (
    <div
      className="relative pointer-events-auto transition-all duration-700 mb-8"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      <motion.div
        className="relative group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Glow effect background */}
        <motion.div
          initial="initial"
          animate={isHovered ? "hover" : "initial"}
          variants={glowVariants}
          className="absolute inset-0 rounded-2xl transition-all duration-300"
        />

        {/* Main button container */}
        <motion.div
          className="relative bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] hover:from-[#7C73FF] hover:to-[#9B6CF6] 
                     rounded-2xl px-8 py-4 sm:px-10 sm:py-5 border border-[#6C63FF]/30 backdrop-blur-sm
                     transition-all duration-300 group"
        >
          {/* Content container */}
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            {/* Icon */}
            <motion.div
              animate={{ 
                rotate: isHovered ? [0, -10, 10, -5, 0] : 0,
                scale: isHovered ? 1.1 : 1 
              }}
              transition={{ 
                duration: 0.6,
                ease: "easeInOut"
              }}
              className="flex-shrink-0"
            >
              <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </motion.div>

            {/* Text content */}
            <div className="flex flex-col items-center text-center">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white 
                           group-hover:text-white transition-colors duration-300">
                Track Your Campaign Success
              </h3>
              <p className="text-sm sm:text-base text-purple-100 opacity-90 mt-1 
                          group-hover:opacity-100 transition-opacity duration-300">
                Launch the new Campaign Tracker
              </p>
            </div>

            {/* Arrow icon */}
            <motion.div
              animate={{ 
                x: isHovered ? 5 : 0,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ 
                duration: 0.3,
                ease: "easeOut"
              }}
              className="flex-shrink-0"
            >
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white/90 group-hover:text-white" />
            </motion.div>
          </div>

          {/* Subtle animated accent line */}
          <motion.div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-white/20 rounded-full"
            initial={{ width: 0 }}
            animate={{ 
              width: isHovered ? "80%" : "40%",
              opacity: isHovered ? 0.6 : 0.3
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </motion.div>

        {/* Floating particles effect */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-purple-300 rounded-full"
                style={{
                  left: `${20 + (i * 12)}%`,
                  top: "50%",
                }}
                initial={{ 
                  opacity: 0,
                  scale: 0,
                  y: 0
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [-20, -40, -60],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 2,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}