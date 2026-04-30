"use client";

import {Suspense, useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {AnimatePresence, motion} from "framer-motion";
import {useTranslation} from "react-i18next";
import dynamic from "next/dynamic";
import "@/lib/i18n"; // Initialize i18n
import Navigation from "@/components/creator/earn/Navigation";
import HeroSection from "@/components/creator/promo/HeroSection";
import ReferralBanner from "@/components/creator/earn/ReferralBanner";
import { SignupProvider } from "@/components/creator/promo/SignupContext";

// Sections reused via earn's variant-aware orchestrators (namespace + variant
// props swap copy/layout without forking files). HeroSection and the 3-step
// section are kept forked because their layouts diverge structurally.
const ThreeStepSection = dynamic(() => import("@/components/creator/promo/ThreeStepSection"));
const TestimonialsSection = dynamic(() => import("@/components/creator/earn/TestimonialsSection"));
const AdvantageSection = dynamic(() => import("@/components/creator/earn/AdvantageSection"));
const FAQSection = dynamic(() => import("@/components/creator/earn/FAQSection"));
const EarnFooter = dynamic(() => import("@/components/creator/earn/EarnFooter"));
const FloatingCTA = dynamic(() => import("@/components/creator/earn/FloatingCTA"), { ssr: false });

function CreatorPromoPageContent() {
  const {i18n} = useTranslation();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Language priority on this route:
    //   1. ?lang= URL param (explicit override always wins)
    //   2. previously chosen language in localStorage (respect user's choice from /creator/earn etc.)
    //   3. default to hi-Latn (this is a Hinglish-first promo page)
    const langParam = searchParams.get("lang");
    if (langParam && ["en", "hi-Latn"].includes(langParam)) {
      i18n.changeLanguage(langParam);
    } else if (typeof window !== "undefined" && !localStorage.getItem("i18nextLng")) {
      i18n.changeLanguage("hi-Latn");
    }

    setIsLoading(false);
  }, [searchParams, i18n]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <SignupProvider>
      <AnimatePresence>
        <motion.main
          className="relative min-h-screen bg-black overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Background Gradients — second blob's height is tuned so the gradient
              reaches the end of the FAQ (the "Sab Dekho" / View All button) and
              the page's bg-black only takes over behind the footer below it. */}
          <div className="absolute -top-[400px] -left-[940px] inset-0 pointer-events-none">
            <div className="mt-[500px] w-[2422px] h-[2422px] md:w-[4500px] gradient-blob" />
            <div className="-mt-[1000px] w-[2422px] h-[44%] md:w-[4500px] md:h-[41%] gradient-blob" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <Navigation />
            <Suspense fallback={null}>
              <ReferralBanner namespace="creatorPromo" />
            </Suspense>
            <HeroSection />
            <ThreeStepSection />
            <TestimonialsSection
              namespace="creatorPromo"
              trackingId="promo_testimonials"
              disableSlideEntryAnimation
            />
            <AdvantageSection variant="promo" namespace="creatorPromo" trackingId="promo_advantage" />
            <FAQSection
              namespace="creatorPromo"
              trackingId="promo_faq"
              viewAllHref="/creator/earn/faqs"
              analyticsEvent="promo_cta_click"
            />
            <EarnFooter />
          </div>

          {/* Floating CTA Button — promo variant: yellow voucher strip → OTP modal.
              Tied to the hero card so it only appears once that card scrolls out
              of view (and hides again if the user scrolls back up). */}
          <FloatingCTA
            variant="promo"
            namespace="creatorPromo"
            trackingPrefix="promo"
            triggerElementId="promo-hero-card"
          />
        </motion.main>
      </AnimatePresence>
    </SignupProvider>
  );
}

export default function CreatorPromoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <CreatorPromoPageContent />
    </Suspense>
  );
}
