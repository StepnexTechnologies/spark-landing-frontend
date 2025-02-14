import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react"; // Added import for React
import InteractiveBackground from "@/components/interactive-background";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sparkonomy - Igniting Now",
  description: "Developing AI to spark livelihoods globally",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <InteractiveBackground />
        {children}
      </body>
    </html>
  );
}
