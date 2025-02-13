"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Here you would typically send the email to your backend
    setTimeout(() => {
      window.location.href = "/thank-you";
    }, 2000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto relative mb-6"
    >
      <div className="relative group">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Get Early Access, Leave Your Email"
          className="w-full px-4 pr-12 py-3 bg-transparent border-2 border-[#6C63FF] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-white transition-all duration-300 text-sm sm:text-base"
          required
        />
        <motion.button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#6C63FF] hover:bg-[#5b54d6] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-md transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
        >
          &gt;
        </motion.button>
      </div>
      <p className="text-xs sm:text-sm text-gray-400 mt-2 text-center">
        No spam. Just sparks.
      </p>
    </form>
  );
}
