"use client";

import type React from "react";
import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import WebGLFluidBackground from "@/components/webgl-fluid-background";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  return (
    <main
      onMouseMove={handleMouseMove}
      className="h-screen w-screen overflow-hidden relative bg-black"
    >
      {/* Background */}
      <WebGLFluidBackground mousePosition={mousePosition} />

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col h-full">
        <div className="flex-grow">
          <HeroSection />
        </div>
        <Footer />
      </div>
    </main>
  );
}
