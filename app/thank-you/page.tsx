"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LampContainer } from "@/components/Vortex";

export default function ThankYou() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(Math.floor(Math.random() * 100) + 1);
  }, []);

  return (
    <LampContainer>
      <main className="flex flex-col items-center justify-center text-white relative overflow-hidden">
        <motion.h1
          initial={{ opacity: 0.5, y: 50, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            ease: "easeOut",
          }}
          className="text-6xl md:text-7xl mb-6 tracking-tight font-bold"
        >
          Thank You!
        </motion.h1>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-3xl md:text-4xl lg:text-5xl mb-6 text-center relative z-10 bg-[rgba(35,33,57,0.5)] px-6 py-2 rounded-full backdrop-blur-sm"
        >
          You&apos;re Spark #{count}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="ml-2"
          >
            ✨
          </motion.span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl text-center mb-8 relative z-10 text-gray-300 max-w-2xl"
        >
          We&apos;re excited to have you join our journey to ignite AI
          innovation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="relative z-10"
        >
          <Link
            href="/"
            className="text-purple-300 hover:text-white transition-all duration-300 flex items-center gap-2 bg-[rgba(35,33,57,0.5)] px-4 py-2 rounded-lg hover:bg-[rgba(35,33,57,0.7)]"
          >
            <motion.span
              animate={{ x: [-2, 0, -2] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              &larr;
            </motion.span>
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </main>
    </LampContainer>
  );
}
