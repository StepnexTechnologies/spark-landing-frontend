"use client";

import {usePathname} from "next/navigation";
import type React from "react";
import {Suspense, useEffect, useState} from "react";
import dynamic from "next/dynamic";
import Footer from "@/components/Footer";

const WebGLFluidBackground = dynamic(
  () => import("@/components/webgl-fluid-background").then((m) => m.WebGLFluidBackground),
  { ssr: false }
);
const I18nProvider = dynamic(() => import("@/components/I18nProvider"));
const Toaster = dynamic(
  () => import("react-hot-toast").then((m) => m.Toaster),
  { ssr: false }
);
import ReferralClickTracker from "@/components/ReferralClickTracker";
import OpenReplayInit from "@/components/OpenReplayInit";
import PageViewTracker from "@/lib/hooks/usePageViewTracking";

export function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isDesktopDevice, setIsDesktopDevice] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    setIsDesktopDevice(!isMobileUA);
  }, []);

  const isLegalPage = pathname.startsWith("/legal");
  const isCreatorPage = pathname.startsWith("/creator");
  const isBlogPage = pathname.startsWith("/blogs") || pathname.startsWith("/blog");
  const isPreviewPage = pathname.startsWith("/preview");
  const isHomePage = pathname === "/";

  // i18n is only used on /creator routes — avoid loading i18next/react-i18next
  // chunks on blog/legal/home/etc.
  const withI18n = (node: React.ReactNode) =>
    isCreatorPage ? <I18nProvider>{node}</I18nProvider> : <>{node}</>;

  // Toaster is only used by /contact, /blogs (listing + post detail via
  // NewsletterSection), and /preview (+ [slug]). Skip on every other route so
  // react-hot-toast's chunk never downloads there.
  const needsToaster =
    pathname === "/contact" ||
    pathname === "/blogs" ||
    pathname === "/preview" ||
    pathname.startsWith("/preview/") ||
    (pathname.startsWith("/blogs/") &&
      !pathname.startsWith("/blogs/author") &&
      !pathname.startsWith("/blogs/brand") &&
      !pathname.startsWith("/blogs/creators") &&
      !pathname.startsWith("/blogs/company") &&
      !pathname.startsWith("/blogs/subscribe"));

  const toasterNode = needsToaster ? (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "#1a1a1a",
          color: "#fff",
          border: "1px solid rgba(108, 99, 255, 0.3)",
        },
        success: {
          iconTheme: {
            primary: "#6C63FF",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
  ) : null;

  if (isLegalPage || isCreatorPage || isBlogPage || isPreviewPage) {
    // For legal, creator, and blog pages, render children without WebGL background or Footer
    return withI18n(
      <>
        <Suspense fallback={null}>
          <ReferralClickTracker />
          <PageViewTracker />
        </Suspense>
        <OpenReplayInit />
        {toasterNode}
        {children}
      </>
    );
  }

  // For non-legal pages, render with WebGL background and Footer
  return withI18n(
    <>
      <Suspense fallback={null}>
        <ReferralClickTracker />
      </Suspense>
      <OpenReplayInit />
      {toasterNode}
      <div className={`relative min-h-[100dvh] w-full flex flex-col overflow-x-hidden ${isHomePage ? "touch-none" : "touch-pan-y"} overflow-hidden`}>
        {isDesktopDevice && (
          <div className="fixed inset-0 z-0">
            <WebGLFluidBackground />
          </div>
        )}
        {children}
        <Footer minimal={!isHomePage} />
      </div>
    </>
  );
}