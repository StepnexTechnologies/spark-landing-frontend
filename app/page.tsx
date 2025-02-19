"use client";

import type React from "react";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import {WebGLFluidBackground} from "@/components/webgl-fluid-background";

export default function Home() {

  return (
    <main className="overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-10">
        <WebGLFluidBackground/>
      </div>

      {/* Content */}
      <div className="bg-none">
        <div className="flex-grow">
          <HeroSection/>
        </div>
        <Footer/>
      </div>
    </main>

  );
}
