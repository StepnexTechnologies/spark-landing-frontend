"use client";

import {usePathname} from "next/navigation";
import type React from "react";
import {WebGLFluidBackground} from "@/components/webgl-fluid-background";
import Footer from "@/components/Footer";
import I18nProvider from "@/components/I18nProvider";

export function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLegalPage = pathname.startsWith("/legal");
  const isCreatorPage = pathname.startsWith("/creator");
  const isBlogPage = pathname.startsWith("/blogs") || pathname.startsWith("/blog");
  const isPreviewPage = pathname.startsWith("/preview");

  if (isLegalPage || isCreatorPage || isBlogPage || isPreviewPage) {
    // For legal, creator, and blog pages, render children without WebGL background or Footer
    return <I18nProvider>{children}</I18nProvider>;
  }

  // For non-legal pages, render with WebGL background and Footer
  return (
    <I18nProvider>
      <div className="relative min-h-[100dvh] w-full flex flex-col overflow-x-hidden touch-pan-y overflow-hidden">
        <div className="fixed inset-0 z-0">
          <WebGLFluidBackground />
        </div>
        {children}
        <Footer />
      </div>
    </I18nProvider>
  );
}