"use client";

import {Suspense, useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {AnimatePresence, motion} from "framer-motion";
import {useTranslation} from "react-i18next";
import dynamic from "next/dynamic";
import "@/lib/i18n"; // Initialize i18n
import Navigation from "@/components/creator/earn/Navigation";
import HeroSection from "@/components/creator/earn/HeroSection";
import StoriesContainer from "@/components/creator/earn/stories/StoriesContainer";
import ReferralBanner from "@/components/creator/earn/ReferralBanner";

const ValueProposition = dynamic(() => import("@/components/creator/earn/ValueProposition"));
const BenefitsSection = dynamic(() => import("@/components/creator/earn/BenefitsSection"));
const AdvantageSection = dynamic(() => import("@/components/creator/earn/AdvantageSection"));
const TestimonialsSection = dynamic(() => import("@/components/creator/earn/TestimonialsSection"));
const VideoSection = dynamic(() => import("@/components/creator/earn/VideoSection"));
const FAQSection = dynamic(() => import("@/components/creator/earn/FAQSection"));
const CTASection = dynamic(() => import("@/components/creator/earn/CTASection"));
const EarnFooter = dynamic(() => import("@/components/creator/earn/EarnFooter"));
const FloatingCTA = dynamic(() => import("@/components/creator/earn/FloatingCTA"), { ssr: false });
const CreatorsWeekCelebration = dynamic(
  () => import("@/components/creator/earn/CreatorsWeekCelebration"),
  { ssr: false }
);

function CreatorEarnPageContent() {
  const {i18n} = useTranslation();
  const searchParams = useSearchParams();
  const [showStories, setShowStories] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set language from URL param only if present
    const langParam = searchParams.get("lang");
    if (langParam && ["en", "hi-Latn"].includes(langParam)) {
      i18n.changeLanguage(langParam);
    }
    // Don't force English - let the user's selection persist

    // Check if user has already viewed stories
    const storiesViewed = sessionStorage.getItem("storiesViewed");
    const referralCode = searchParams.get("ref");

    if (storiesViewed === "true" || referralCode) {
      // Skip stories for returning visitors OR referral visitors
      setShowLandingPage(true);
      setShowStories(false);
    } else {
      // Show stories for first-time visitors
      setShowStories(true);
      setShowLandingPage(false);
    }

    setIsLoading(false);
  }, [searchParams, i18n]);

  // Preload the Creators Week celebration image during idle time so slow
  // connections don't race the 4s auto-dismiss once the overlay starts playing.
  // Skipped on mobile — the 5 MB PNG is a major LCP/Speed-Index regression on
  // slow-4G phones, and the celebration still loads lazily when it mounts.
  // Also deferred past the hero's LCP so it doesn't compete for bandwidth
  // on first paint.
  useEffect(() => {
    const now = new Date();
    const start = new Date(2026, 3, 20);
    const end = new Date(2026, 3, 28);
    if (now < start || now >= end) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    let cancelled = false;
    let link: HTMLLinkElement | null = null;

    const inject = () => {
      if (cancelled) return;
      link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = "/images/creator/earn/PROMO.png";
      document.head.appendChild(link);
    };

    const ric = (window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback;
    const timeoutId = ric ? ric(inject, { timeout: 3000 }) : window.setTimeout(inject, 2000);

    return () => {
      cancelled = true;
      if (!ric) clearTimeout(timeoutId);
      if (link && link.parentNode) link.parentNode.removeChild(link);
    };
  }, []);

  const handleStoriesComplete = () => {
    setShowStories(false);
    setTimeout(() => {
      setShowLandingPage(true);
    }, 300);
  };

  // Show loading state briefly
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {/* Stories Experience */}
      {showStories && <StoriesContainer onComplete={handleStoriesComplete} />}

      {/* Main Landing Page */}
      <AnimatePresence>
        {showLandingPage && (
          <motion.main
            className="relative min-h-screen bg-black overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Background Gradients */}
            <div className="absolute -top-[400px] -left-[940px] inset-0 pointer-events-none">
              {/* Pink to Purple Gradient Blob */}
              <div className="mt-[500px] w-[2422px] h-[2422px] md:w-[4500px] gradient-blob" />
              <div className="-mt-[1000px] w-[2422px] h-[65%] md:w-[4500px] md:h-[62%] gradient-blob" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <Navigation />
              <Suspense fallback={null}>
                <ReferralBanner />
              </Suspense>
              <HeroSection />
              <ValueProposition />
              <BenefitsSection />
              <AdvantageSection />
              <TestimonialsSection />
              <VideoSection />
              <FAQSection />
              <CTASection />
              <EarnFooter />
            </div>

            {/* Floating CTA Button */}
            <FloatingCTA />

            {/* Creators Week Celebration */}
            <CreatorsWeekCelebration />
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}

export default function CreatorEarnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <CreatorEarnPageContent />
    </Suspense>
  );
}
