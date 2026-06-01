"use client";

import {Suspense, useEffect} from "react";
import {useSearchParams} from "next/navigation";
import {useTranslation} from "react-i18next";
import dynamic from "next/dynamic";
import "@/lib/i18n"; // Initialize i18n
import Navigation from "@/components/creator/earn/Navigation";
import HeroSection from "@/components/creator/earn/HeroSection";
import ReferralBanner from "@/components/creator/earn/ReferralBanner";
import { SignupProvider } from "@/components/creator/promo/SignupContext";

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

  useEffect(() => {
    // Set language from URL param only if present. Runs after the first paint
    // so the server-rendered English content hydrates cleanly; i18next then
    // swaps the strings in place (no remount) when ?lang=hi-Latn is set.
    // Don't force English - let the user's selection persist.
    const langParam = searchParams.get("lang");
    if (langParam && ["en", "hi-Latn"].includes(langParam)) {
      i18n.changeLanguage(langParam);
    }
  }, [searchParams, i18n]);

  // No loading gate: rendering real content on the server (instead of a
  // "Loading..." placeholder behind a client-only state flip) lets the hero
  // and LCP element paint from the SSR HTML rather than waiting on hydration.

  return (
    <SignupProvider>
      <main className="relative min-h-screen bg-black overflow-hidden">
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
            hides the bar while the hero card is on-screen.
            Kept as a direct child of <main> (no motion wrapper) so
            position:fixed anchors to the viewport — wrapping in motion.*
            can promote the ancestor to a containing block on some mobile
            browsers and pin the bar mid-page. */}
        <FloatingCTA
          variant="earn"
          namespace="creatorEarn"
          trackingPrefix="earn"
          triggerElementId="promo-hero-card"
        />
      </main>
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
