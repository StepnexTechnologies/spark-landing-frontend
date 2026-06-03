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
//
// Each section's import is hoisted into a shared thunk so the same chunk can
// be both code-split via dynamic() *and* warmed during the hero typewriter
// window (see prefetchBelowFold below). Reusing one thunk per section keeps
// the split and the prefetch pointed at the exact same chunk, so warming
// dedupes against dynamic()'s own load instead of double-fetching.
const loadThreeStep = () => import("@/components/creator/promo/ThreeStepSection");
const loadPhoneMockup = () => import("@/components/creator/promo/PhoneMockupSection");
const loadTestimonials = () => import("@/components/creator/earn/TestimonialsSection");
const loadAdvantage = () => import("@/components/creator/earn/AdvantageSection");
const loadFAQ = () => import("@/components/creator/earn/FAQSection");
const loadFooter = () => import("@/components/creator/earn/EarnFooter");
const loadFloatingCTA = () => import("@/components/creator/earn/FloatingCTA");

const ThreeStepSection = dynamic(loadThreeStep);
const PhoneMockupSection = dynamic(loadPhoneMockup);
const TestimonialsSection = dynamic(loadTestimonials);
const AdvantageSection = dynamic(loadAdvantage);
const FAQSection = dynamic(loadFAQ);
const EarnFooter = dynamic(loadFooter);
const FloatingCTA = dynamic(loadFloatingCTA, { ssr: false });

// Warm every below-the-fold chunk in one shot. Kicked off on idle (see the
// effect in CreatorPromoPage) so it overlaps the hero typewriter rather than
// competing with the hero card for bandwidth on first paint. import() dedupes
// with dynamic()'s own loading, so this only pulls a chunk forward if it
// hasn't started yet.
function prefetchBelowFold() {
  loadThreeStep();
  loadPhoneMockup();
  loadTestimonials();
  loadAdvantage();
  loadFAQ();
  loadFooter();
  loadFloatingCTA();
}

interface CreatorPromoPageProps {
  // Threaded into HeroSection. "f" variant is used by /creator/promo-f only
  // and changes hero-card animation behavior — see PromoSignupCard.
  // "w" variant is used by /creator/promo-w — strips all entry animations
  // on the signup card (gift-card bloom, count-up, rupee pulse, lift-on-scroll)
  // while keeping the sparkles and Get OTP button bounce.
  variant?: "f" | "w";
  // When true, HeroSection plays the staged title→subtitle typewriter →
  // card fade-in sequence. Only /creator/promo enables this; /creator/promo-f
  // and /creator/promo-w leave it off so their hero paints statically and
  // mobile LCP stays low.
  enableTypewriter?: boolean;
}

export default function CreatorPromoPage({ variant, enableTypewriter }: CreatorPromoPageProps = {}) {
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

  // Overlap the rest of the page's JS with the hero typewriter. On idle (so the
  // hero card hydrates first and gets bandwidth priority) we warm the
  // below-the-fold chunks, so 4G / low-end users have them cached by the time
  // they scroll. requestIdleCallback is missing on older iOS Safari, so we fall
  // back to a short timeout — which still lands inside the typewriter window.
  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(prefetchBelowFold, { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(prefetchBelowFold, 800);
    return () => window.clearTimeout(t);
  }, []);

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
          <Navigation showLanguageSwitcher={false} showCTA={false} namespace="creatorPromo" />
          <Suspense fallback={null}>
            <ReferralBanner namespace="creatorPromo" />
          </Suspense>
          <HeroSection variant={variant} enableTypewriter={enableTypewriter} />
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
