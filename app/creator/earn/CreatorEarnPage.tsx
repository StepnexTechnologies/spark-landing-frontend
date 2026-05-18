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
import { SignupProvider } from "@/components/creator/promo/SignupContext";
import {track} from "@/lib/analytics/track";

const ValueProposition = dynamic(() => import("@/components/creator/earn/ValueProposition"));
const ThreeStepSection = dynamic(() => import("@/components/creator/promo/ThreeStepSection"));
const PhoneMockupSection = dynamic(() => import("@/components/creator/promo/PhoneMockupSection"));
const AdvantageSection = dynamic(() => import("@/components/creator/earn/AdvantageSection"));
const TestimonialsSection = dynamic(() => import("@/components/creator/earn/TestimonialsSection"));
const FAQSection = dynamic(() => import("@/components/creator/earn/FAQSection"));
const EarnFooter = dynamic(() => import("@/components/creator/earn/EarnFooter"));
const FloatingCTA = dynamic(() => import("@/components/creator/earn/FloatingCTA"), { ssr: false });

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

    const storiesViewed = sessionStorage.getItem("storiesViewed");
    const referralCode = searchParams.get("ref");

    if (referralCode || storiesViewed === "true") {
      setShowLandingPage(true);
      setShowStories(false);
    } else {
      const variant = Math.random() < 0.5 ? "show_stories" : "no_stories";
      track("earn_stories_ab_exposure", {
        test_name: "earn_stories_50_50",
        variant,
      });

      if (variant === "show_stories") {
        setShowStories(true);
        setShowLandingPage(false);
      } else {
        sessionStorage.setItem("storiesViewed", "true");
        setShowLandingPage(true);
        setShowStories(false);
      }
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
    <SignupProvider>
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
            {/* Background Gradients — tuned to reach the end of the FAQ
                (the "View All" / "Show Less" toggle), so bg-black only
                shows behind the footer below it. */}
            <div className="absolute -top-[400px] -left-[940px] inset-0 pointer-events-none">
              <div className="mt-[900px] w-[2422px] h-[2422px] md:w-[4500px] gradient-blob" />
              <div className="-mt-[1000px] w-[2422px] h-[44%] md:w-[4500px] md:h-[41%] gradient-blob" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <Navigation />
              <Suspense fallback={null}>
                <ReferralBanner />
              </Suspense>
              <HeroSection />
              <ValueProposition />
              <ThreeStepSection namespace="creatorEarn" trackingId="earn_three_step" />
              <PhoneMockupSection />
              <TestimonialsSection
                namespace="creatorEarn"
                trackingId="earn_testimonials"
                disableSlideEntryAnimation
              />
              <AdvantageSection
                variant="promo"
                namespace="creatorEarn"
                trackingId="earn_advantage"
                analyticsEvent="earn_cta_click"
              />
              <FAQSection
                namespace="creatorEarn"
                trackingId="earn_faq"
                analyticsEvent="earn_faq_toggle"
                expandInline
              />
              <EarnFooter />
            </div>

            {/* Floating CTA — earn variant mirrors the hero card's pitch
                (dark surface, FlippingCoin, Win-Gold-Coin heading, inline
                checks, white phone pill, Win Now). Phone input is piped into
                the shared SignupContext so submitting from the bottom bar
                advances the hero card straight to OTP. triggerElementId
                hides the bar while the hero card is on-screen. */}
            <FloatingCTA
              variant="earn"
              namespace="creatorEarn"
              trackingPrefix="earn"
              triggerElementId="promo-hero-card"
            />
          </motion.main>
        )}
      </AnimatePresence>
    </SignupProvider>
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
