"use client";
import { useState, useRef, useEffect } from "react";
import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightIcon, Sparkles } from "lucide-react";
import { useSubmitEmail } from "@/lib/hooks/useSubmitEmail";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
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
                animate={{
                  boxShadow: isFocused
                    ? "0 0 20px rgba(108,99,255,0.3)"
                    : "0 0 0px rgba(108,99,255,0)",
                }}
                className="absolute inset-0 rounded-full transition-all duration-300"
              />

              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Get Early Access, Leave Your Email"
                className="w-full px-4 pr-12 py-3 bg-black/50 backdrop-blur-sm border-2 border-[#6C63FF] rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-white transition-all duration-300 text-sm sm:text-base"
                required
              />

              <div className="absolute right-2 flex items-center">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: loading
                      ? "0 0 10px rgba(255,255,255,0.5)"
                      : ["0 0 10px #6C63FF", "0 0 20px #6C63FF", "0 0 10px #6C63FF"],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="bg-[#6C63FF] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center overflow-hidden"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <ArrowRightIcon />
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
              className="text-xs sm:text-sm text-gray-400 mt-2 text-center italic"
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
              className="flex items-center justify-center gap-2 text-purple-400"
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
