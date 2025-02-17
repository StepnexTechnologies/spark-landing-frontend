import "./globals.css";
import { Montserrat } from "next/font/google";
import type React from "react";

const inter = Montserrat({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>

        {children}
      </body>
    </html>
  );
}
