import "../globals.css";
import {Roboto} from "next/font/google";
import type React from "react";

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className={`${roboto.className} min-h-screen bg-custom`}>
          {children}
      </div>
  );
}
