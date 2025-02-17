"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAnimation } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { LampContainer } from "@/components/Vortex";
import { AuroraBackground } from "@/components/ui/aurora-background";
import dynamic from "next/dynamic";

// Dynamically import Footer with no SSR
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export default function ThankYou() {
  const searchParams = useSearchParams();
  const number = searchParams?.get("waitlist_id");
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!number) {
      window.location.href = `/`;
      return;
    }
    controls.start({ opacity: 1, y: 0 });

    // Get message from localStorage
    const storedMessage = localStorage.getItem("waitlistResponse");
    setMessage(storedMessage || "");
  }, [controls, number]);

  const getResponseMessage = () => {
    if (message === "You have been added to the waitlist!") {
      return "We're excited to have you join our journey to ignite AI innovation.";
    } else if (message === "Already in the waitlist") {
      return "We love your enthusiasm and you're already in the queue...";
    }
    return "Oops an unexpected error occurred, we'll fix it right away!";
  };

  return (
    <div className="w-screen h-screen overflow-hidden" ref={containerRef}>
      <AuroraBackground>
        <LampContainer className="z-0">
          <div className="flex flex-col items-center justify-center space-y-8 md:space-y-12 relative mt-32 md:mt-48">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] pt-4">
              Thank You!
            </h1>

            <div className="text-xl md:text-3xl lg:text-4xl text-center bg-[rgba(35,33,57,0.5)] px-6 py-3 md:px-8 md:py-4 rounded-full backdrop-blur-sm text-white">
              You&apos;re Spark #{number}
              <span className="ml-2 inline-block">✨</span>
            </div>

            <p className="text-base md:text-lg lg:text-xl text-center text-gray-300 max-w-2xl px-4">
              {getResponseMessage()}
            </p>

            <div className="mt-6 md:mt-8">
              <Link
                href="/"
                className="text-purple-300 hover:text-white transition-all duration-300 flex items-center gap-2 bg-[rgba(35,33,57,0.5)] px-6 py-3 md:px-8 md:py-4 rounded-full hover:bg-[rgba(35,33,57,0.7)] group text-sm md:text-base"
              >
                <span className="group-hover:translate-x-[-4px] transition-transform duration-300">
                  &larr;
                </span>
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </LampContainer>
        <Footer />
      </AuroraBackground>
    </div>
  );
}
