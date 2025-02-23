"use client";
import { useState, useRef} from "react";
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
      boxShadow:
        "0 0 35px rgba(108,99,255,0.7), 0 0 70px rgba(108,99,255,0.4), 0 0 100px rgba(108,99,255,0.2)",
    },
    hover: {
      boxShadow: [
        "0 0 40px rgba(108,99,255,0.8), 0 0 80px rgba(108,99,255,0.6), 0 0 120px rgba(108,99,255,0.4)",
        "0 0 50px rgba(108,99,255,0.9), 0 0 100px rgba(108,99,255,0.7), 0 0 150px rgba(108,99,255,0.5)",
        "0 0 40px rgba(108,99,255,0.8), 0 0 80px rgba(108,99,255,0.6), 0 0 120px rgba(108,99,255,0.4)",
      ],
      transition: {
        duration: 2.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
    focus: {
      boxShadow:
        "0 0 60px rgba(108,99,255,1), 0 0 100px rgba(108,99,255,0.8), 0 0 150px rgba(108,99,255,0.5)",
    },
  };

  // Synchronized button glow animation
  const buttonGlowVariants = {
    animate: {
      boxShadow: loading
        ? "0 0 25px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4)"
        : [
            "0 0 25px rgba(108,99,255,0.8), 0 0 40px rgba(108,99,255,0.5)",
            "0 0 35px rgba(108,99,255,0.9), 0 0 50px rgba(108,99,255,0.6)",
            "0 0 25px rgba(108,99,255,0.8), 0 0 40px rgba(108,99,255,0.5)",
          ],
      transition: {
        duration: 2.5,
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
            <div className="relative flex items-center">
              <motion.div
                initial="initial"
                animate={[
                  isHovered ? "focus" : "initial",
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
                placeholder="By Invitation, Leave Your Email"
                className="w-full px-4 pr-12 py-3 bg-black/50 backdrop-blur-sm border-2 border-[#6C63FF] rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-white transition-all duration-300 text-[16px]"
                required
                // Adding autocomplete off can also help prevent autofocus issues
                autoComplete="on"
              />

              <div className="absolute right-2 flex items-center">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  variants={buttonGlowVariants}
                  className="bg-[#6C63FF] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center overflow-hidden"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <ArrowRight />
                  )}
                </motion.button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xs sm:text-sm text-red-400 mt-2 text-center italic"
              >
                {error}
              </motion.p>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs sm:text-sm text-gray-400 mt-2 text-center italic select-none"
            >
              No spam. Just sparks.
            </motion.p>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-3"
          >
            <motion.div
              className="flex items-center justify-center gap-2 text-purple-400 select-none"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <Sparkles className="w-5 h-5" />
              <p className="text-white text-lg">
                {responseNumber !== null
                  ? `Your lucky number: ${responseNumber}`
                  : "Igniting your journey..."}
              </p>
              <Sparkles className="w-5 h-5" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
