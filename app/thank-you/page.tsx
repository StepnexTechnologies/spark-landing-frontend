"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ThankYou() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // In a real application, you would fetch this count from your backend
    setCount(Math.floor(Math.random() * 1000) + 1);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl lg:text-6xl mb-8 text-center relative z-10"
      >
        You&apos;re Spark #{count}—welcome aboard!
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-xl md:text-2xl text-center mb-8 relative z-10"
      >
        We&apos;re excited to have you join our journey to ignite AI innovation.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative z-10"
      >
        <Link
          href="/"
          className="text-purple-500 hover:text-purple-400 transition-colors duration-300"
        >
          &larr; Back to Home
        </Link>
      </motion.div>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500 rounded-full"
            initial={{ opacity: 0, x: "50%", y: "50%" }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0.5],
              x: ["50%", `${Math.random() * 100}%`, `${Math.random() * 100}%`],
              y: ["50%", `${Math.random() * 100}%`, `${Math.random() * 100}%`],
            }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              times: [0, 0.2, 1],
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>
    </main>
  );
}
