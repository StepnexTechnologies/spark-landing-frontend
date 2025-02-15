"use client";
import { motion } from "framer-motion";
import type React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";

export function AuroraBackgroundDemo({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="flex h-screen items-center justify-center"
        >
          {children}
        </motion.div>
      </AuroraBackground>
    </div>
  );
}
