"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import HeroSection from "../components/HeroSection";
// import { AuroraBackgroundDemo } from "@/components/AuroraBackgroundDemo";
import InteractiveBackground from "@/components/interactive-background";
import Footer from "@/components/Footer";
import {AuroraBackground} from "@/components/ui/aurora-background";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Single fade in animation for the entire container
    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" }
    ).fromTo(
      ".hero-content",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      "-=0.5"
    );
  }, []);

  return (
    <div ref={containerRef} className="opacity-0">
      <AuroraBackground>
        <InteractiveBackground />
        <div className="min-h-screen w-full">
          <HeroSection />
          <Footer />
        </div>
      </AuroraBackground>
    </div>
  );
}
