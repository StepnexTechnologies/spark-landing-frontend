"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import HeroSection from "../components/HeroSection";
import { SparklesCore } from "@/components/sparkles";

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
    <main
      ref={containerRef}
      className="min-h-screen bg-black text-white opacity-0"
    >
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <div className="relative z-10 hero-content">
        <HeroSection />
      </div>
    </main>
  );
}
