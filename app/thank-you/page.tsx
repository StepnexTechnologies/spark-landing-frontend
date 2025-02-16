"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { LampContainer } from "@/components/Vortex";
import Footer from "@/components/Footer";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { useSearchParams } from "next/navigation";

export default function ThankYou() {
  const searchParams = useSearchParams();
  const number = searchParams.get("waitlist_id");

  if (number == null) {
    window.location.href = `/`;
  }
  const responseMessage = localStorage.getItem("waitlistResponse");
  console.log(responseMessage)

  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  return (
    <div className="w-screen h-screen overflow-hidden" ref={containerRef}>
      <AuroraBackground>
        <LampContainer className="z-0">
          <motion.div
            className="flex flex-col items-center justify-center space-y-8 md:space-y-12 relative mt-32 md:mt-48"
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            >
              Thank You!
            </motion.h1>

            <motion.div
              className="text-xl md:text-3xl lg:text-4xl text-center bg-[rgba(35,33,57,0.5)] px-6 py-3 md:px-8 md:py-4 rounded-full backdrop-blur-sm text-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            >
              You&apos;re Spark #{number}
              <motion.span
                className="ml-2 inline-block"
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
              >
                ✨
              </motion.span>
            </motion.div>

            <motion.p
              className="text-base md:text-lg lg:text-xl text-center text-gray-300 max-w-2xl px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            >
              {/*We&apos;re excited to have you join our journey to ignite AI*/}
              {/*innovation.*/}
              {responseMessage == 'You have been added to the waitlist!' ? `We're excited to have you join our journey to ignite AI
              innovation.`: responseMessage == 'Already in the waitlist' ? `We love your enthusiasm and you're already in the queue...` : `Oops an unexpected error occurred, we'll fix it right away!`}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
              className="mt-6 md:mt-8"
            >
              <Link
                href="/"
                className="text-purple-300 hover:text-white transition-all duration-300 flex items-center gap-2 bg-[rgba(35,33,57,0.5)] px-6 py-3 md:px-8 md:py-4 rounded-full hover:bg-[rgba(35,33,57,0.7)] group text-sm md:text-base"
              >
                <motion.span
                  animate={{ x: [-2, 0, -2] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                  className="group-hover:translate-x-[-4px] transition-transform duration-300"
                >
                  &larr;
                </motion.span>
                <span>Back to Home</span>
              </Link>
            </motion.div>
          </motion.div>
        </LampContainer>
        <Footer />
      </AuroraBackground>
    </div>
  );
}
