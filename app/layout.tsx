"use client";

import "./globals.css";
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type React from "react";
import { WebGLFluidBackground } from "@/components/webgl-fluid-background";
import Footer from "@/components/Footer";
import { FluidProvider, useFluid } from "@/app/FluidContext";

const inter = Montserrat({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fluidRef = useFluid();

  return (
    <FluidProvider>
      <html lang="en">
      <body className={`${inter.className} min-h-screen relative`}>
      <div className="relative">
        <div className="absolute inset-0 -z-10">
          <WebGLFluidBackground ref={fluidRef} />
        </div>

        {children}

        <Analytics />
        <SpeedInsights />
        <Footer />
      </div>
      </body>
      </html>
    </FluidProvider>
  );
}
