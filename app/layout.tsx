import "./globals.css";
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type React from "react";
import { WebGLFluidBackground } from "@/components/webgl-fluid-background";
import Footer from "@/components/Footer";

const inter = Montserrat({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-[100dvh]">
      <body
        className={`${inter.className} min-h-[100dvh] w-full relative overflow-x-hidden touch-pan-y`}
      >
        <div className="relative min-h-[100dvh] w-full flex flex-col">
          <div className="fixed inset-0 z-0">
            <WebGLFluidBackground />
          </div>
          {children}
          <Analytics />
          <SpeedInsights />
          <Footer />
        </div>
      </body>
    </html>
  );
}
