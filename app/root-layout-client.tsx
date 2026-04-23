"use client";

import {usePathname} from "next/navigation";
import type React from "react";
import {Suspense} from "react";
import dynamic from "next/dynamic";
import Footer from "@/components/Footer";

const WebGLFluidBackground = dynamic(
  () => import("@/components/webgl-fluid-background").then((m) => m.WebGLFluidBackground),
  { ssr: false }
);
import I18nProvider from "@/components/I18nProvider";
import {Toaster} from "react-hot-toast";
import ReferralClickTracker from "@/components/ReferralClickTracker";
import OpenReplayInit from "@/components/OpenReplayInit";
import PageViewTracker from "@/lib/hooks/usePageViewTracking";

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
  const isHomePage = pathname === "/";

  if (isLegalPage || isCreatorPage || isBlogPage || isPreviewPage) {
    // For legal, creator, and blog pages, render children without WebGL background or Footer
    return (
      <I18nProvider>
        <Suspense fallback={null}>
          <ReferralClickTracker />
          <PageViewTracker />
        </Suspense>
        <OpenReplayInit />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid rgba(108, 99, 255, 0.3)',
            },
            success: {
              iconTheme: {
                primary: '#6C63FF',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        {children}
      </I18nProvider>
    );
  }

  // For non-legal pages, render with WebGL background and Footer
  return (
    <I18nProvider>
      <Suspense fallback={null}>
        <ReferralClickTracker />
      </Suspense>
      <OpenReplayInit />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(108, 99, 255, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#6C63FF',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className={`relative min-h-[100dvh] w-full flex flex-col overflow-x-hidden ${isHomePage ? "touch-none" : "touch-pan-y"} overflow-hidden`}>
        <div className="fixed inset-0 z-0">
          <WebGLFluidBackground />
        </div>
        {children}
        <Footer minimal={!isHomePage} />
      </div>
    </I18nProvider>
  );
}