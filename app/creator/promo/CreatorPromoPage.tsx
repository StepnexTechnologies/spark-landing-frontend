"use client";

import {Suspense, useEffect} from "react";
import {useTranslation} from "react-i18next";
import dynamic from "next/dynamic";
import "@/lib/i18n"; // Initialize i18n
import Navigation from "@/components/creator/earn/Navigation";
import HeroSection from "@/components/creator/promo/HeroSection";
import ReferralBanner from "@/components/creator/earn/ReferralBanner";
import { SignupProvider } from "@/components/creator/promo/SignupContext";

// Below-the-fold sections are code-split. They still SSR (default
// dynamic = ssr:true) so crawlers and Lighthouse get the full DOM, but
// their JS chunks load on demand which keeps the hero TBT/JS budget tight.
const ThreeStepSection = dynamic(() => import("@/components/creator/promo/ThreeStepSection"));
const PhoneMockupSection = dynamic(() => import("@/components/creator/promo/PhoneMockupSection"));
const TestimonialsSection = dynamic(() => import("@/components/creator/earn/TestimonialsSection"));
const AdvantageSection = dynamic(() => import("@/components/creator/earn/AdvantageSection"));
const FAQSection = dynamic(() => import("@/components/creator/earn/FAQSection"));
const EarnFooter = dynamic(() => import("@/components/creator/earn/EarnFooter"));
const FloatingCTA = dynamic(() => import("@/components/creator/earn/FloatingCTA"), { ssr: false });

export default function CreatorPromoPage() {
  const {i18n} = useTranslation();

  useEffect(() => {
    // Promo page is Hinglish-only — always force hi-Latn regardless of any
    // ?lang= override or previously chosen language in localStorage. Both
    // 'en' and 'hi-Latn' resolve creatorPromo to the Hinglish bundle, so
    // SSR copy is correct even before this runs.
    if (i18n.language !== "hi-Latn") {
      i18n.changeLanguage("hi-Latn");
    }
  }, [i18n]);

  return (
    <SignupProvider>
      <main className="relative min-h-screen bg-black overflow-hidden">
        {/* Background Gradients — second blob's height is tuned so the gradient
            reaches the end of the FAQ (the "Sab Dekho" / View All button) and
            the page's bg-black only takes over behind the footer below it. */}
        <div className="absolute -top-[400px] -left-[940px] inset-0 pointer-events-none">
          <div className="mt-[500px] w-[2422px] h-[2422px] md:w-[4500px] gradient-blob" />
          <div className="-mt-[1000px] w-[2422px] h-[44%] md:w-[4500px] md:h-[41%] gradient-blob" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Navigation showLanguageSwitcher={false} namespace="creatorPromo" />
          <Suspense fallback={null}>
            <ReferralBanner namespace="creatorPromo" />
          </Suspense>
          <HeroSection />
          <ThreeStepSection />
          <PhoneMockupSection />
          <TestimonialsSection
            namespace="creatorPromo"
            trackingId="promo_testimonials"
            disableSlideEntryAnimation
          />
          <AdvantageSection variant="promo" namespace="creatorPromo" trackingId="promo_advantage" />
          <FAQSection
            namespace="creatorPromo"
            trackingId="promo_faq"
            analyticsEvent="promo_faq_toggle"
            expandInline
          />
          <EarnFooter />
        </div>

        {/* Floating CTA Button — promo variant: yellow voucher strip → OTP modal.
            Tied to the hero card so it only appears once that card scrolls out
            of view (and hides again if the user scrolls back up). */}
        <Suspense fallback={null}>
          <FloatingCTA
            variant="promo"
            namespace="creatorPromo"
            trackingPrefix="promo"
            triggerElementId="promo-hero-card"
          />
        </Suspense>
      </main>
    </SignupProvider>
  );
}
