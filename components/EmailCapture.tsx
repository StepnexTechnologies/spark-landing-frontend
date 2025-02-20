"use client";
import { useState, useRef, useEffect } from "react";
import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useSubmitEmail } from "@/lib/hooks/useSubmitEmail";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { submitEmail, loading, error, responseNumber } = useSubmitEmail();

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    const { number, message } = await submitEmail(email);
    console.log("Received number from server:", number);
    console.log("Received message from server:", message);

    if (number !== null) {
      localStorage.setItem("waitlistResponse", message);
      window.location.href = `/thank-you?waitlist_id=${number}`;
    }
  };

  const glowVariants = {
    initial: {
      boxShadow: "0 0 50px rgba(108,99,255,0.5), 0 0 80px rgba(108,99,255,0.3)",
    },
    hover: {
      boxShadow: [
        "0 0 60px rgba(108,99,255,0.7), 0 0 100px rgba(108,99,255,0.4), 0 0 140px rgba(108,99,255,0.3)",
        "0 0 80px rgba(108,99,255,0.8), 0 0 120px rgba(108,99,255,0.5), 0 0 160px rgba(108,99,255,0.4)",
        "0 0 60px rgba(108,99,255,0.7), 0 0 100px rgba(108,99,255,0.4), 0 0 140px rgba(108,99,255,0.3)",
      ],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
    focus: {
      boxShadow:
        "0 0 80px rgba(108,99,255,0.9), 0 0 120px rgba(108,99,255,0.6), 0 0 160px rgba(108,99,255,0.4)",
    },
  };

  const buttonGlowVariants = {
    animate: {
      boxShadow: loading
        ? "0 0 30px rgba(255,255,255,0.6)"
        : [
            "0 0 30px rgba(108,99,255,0.7)",
            "0 0 50px rgba(108,99,255,0.8)",
            "0 0 30px rgba(108,99,255,0.7)",
          ],
      scale: loading ? 1 : [1, 1.05, 1],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto relative mb-6">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative group"
          >
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-violet-600/20 to-purple-600/20 rounded-2xl blur-lg -z-10"
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            <div className="relative flex items-center">
              <motion.div
                initial="initial"
                animate={[
                  isHovered ? "hover" : "initial",
                  isFocused ? "focus" : "",
                ].filter(Boolean)}
                variants={glowVariants}
                className="absolute inset-0 rounded-full transition-all duration-300"
              />

              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                placeholder="Get Early Access, By Invitation"
                className="w-full px-6 pr-14 py-4 bg-black/50 backdrop-blur-sm border-2 border-[#6C63FF] rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-white transition-all duration-300 text-base sm:text-lg"
                required
              />

              <div className="absolute right-3 flex items-center">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  variants={buttonGlowVariants}
                  animate="animate"
                  className="bg-[#6C63FF] text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center overflow-hidden"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7" />
                  )}
                </motion.button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm sm:text-base text-red-400 mt-3 text-center italic"
              >
                {error}
              </motion.p>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base text-gray-400 mt-3 text-center italic select-none"
            >
              No spam. Just sparks.
            </motion.p>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <motion.div
              className="flex items-center justify-center gap-3 text-purple-400 select-none"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
              <p className="text-white text-lg sm:text-xl">
                {responseNumber !== null
                  ? `Your lucky number: ${responseNumber}`
                  : "Igniting your journey..."}
              </p>
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
