"use client";

import type React from "react";
import HeroSection from "@/components/HeroSection";

export default function Home() {

  return (
    <main className="overflow-hidden">

      {/* Content */}
      <div className="">
        <div className="flex-grow">
          <HeroSection/>
        </div>
      </div>
    </main>

  );
}
