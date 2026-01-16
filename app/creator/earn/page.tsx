"use client";

import {Suspense, useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {AnimatePresence, motion} from "framer-motion";
import {useTranslation} from "react-i18next";
import "@/lib/i18n"; // Initialize i18n
import Navigation from "@/components/creator/earn/Navigation";
import HeroSection from "@/components/creator/earn/HeroSection";
import ValueProposition from "@/components/creator/earn/ValueProposition";
import BenefitsSection from "@/components/creator/earn/BenefitsSection";
import AdvantageSection from "@/components/creator/earn/AdvantageSection";
import TestimonialsSection from "@/components/creator/earn/TestimonialsSection";
import VideoSection from "@/components/creator/earn/VideoSection";
import FAQSection from "@/components/creator/earn/FAQSection";
import CTASection from "@/components/creator/earn/CTASection";
import EarnFooter from "@/components/creator/earn/EarnFooter";
import StoriesContainer from "@/components/creator/earn/stories/StoriesContainer";
import FloatingCTA from "@/components/creator/earn/FloatingCTA";
import ReferralBanner from "@/components/creator/earn/ReferralBanner";

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

    if (storiesViewed === "true") {
      // Skip stories, show landing page directly
      setShowLandingPage(true);
      setShowStories(false);
    } else {
      // Show stories for first-time visitors
      setShowStories(true);
      setShowLandingPage(false);
    }

    setIsLoading(false);
  }, [searchParams, i18n]);

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
