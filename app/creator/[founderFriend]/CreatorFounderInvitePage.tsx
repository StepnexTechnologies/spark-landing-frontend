"use client";

import { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import "@/lib/i18n";
import Navigation from "@/components/creator/earn/Navigation";
import ReferralBanner from "@/components/creator/earn/ReferralBanner";
import FounderInviteHero from "@/components/creator/founder-invite/FounderInviteHero";
import FounderInviteBackdrop from "@/components/creator/founder-invite/FounderInviteBackdrop";
import InvitationOnlyBanner from "@/components/creator/founder-invite/InvitationOnlyBanner";
import { SignupProvider } from "@/components/creator/promo/SignupContext";
import type { FounderReferral } from "@/lib/data/founder-referrals";

// Below-the-fold sections are code-split. Mirrors /creator/promo so the
// founder-invite page reuses the same JS chunks once the user navigates
// between funnels.
const ThreeStepSection = dynamic(() => import("@/components/creator/promo/ThreeStepSection"));
const PhoneMockupSection = dynamic(() => import("@/components/creator/promo/PhoneMockupSection"));
const TestimonialsSection = dynamic(() => import("@/components/creator/earn/TestimonialsSection"));
const AdvantageSection = dynamic(() => import("@/components/creator/earn/AdvantageSection"));
const FAQSection = dynamic(() => import("@/components/creator/earn/FAQSection"));
const EarnFooter = dynamic(() => import("@/components/creator/earn/EarnFooter"));

interface Props {
  data: FounderReferral;
}

export default function CreatorFounderInvitePage({ data }: Props) {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Founder-invite copy is Hinglish across both locales (per the project
    // memory rule). Force hi-Latn at mount so the blogs/earn detector chain
    // doesn't bounce back to en mid-render.
    if (i18n.language !== "hi-Latn") {
      i18n.changeLanguage("hi-Latn");
    }
  }, [i18n]);

  return (
    <SignupProvider>
      <main className="relative min-h-screen bg-black overflow-hidden">
        <FounderInviteBackdrop />

        <div className="relative z-10">
          <Navigation
            showLanguageSwitcher
            showCTA={false}
            namespace="creatorPromo"
          />
          <InvitationOnlyBanner />
          <Suspense fallback={null}>
            <ReferralBanner namespace="creatorPromo" />
          </Suspense>
          <FounderInviteHero data={data} />
          <ThreeStepSection />
          <PhoneMockupSection />
          <TestimonialsSection
            namespace="creatorPromo"
            trackingId="founder_invite_testimonials"
            disableSlideEntryAnimation
          />
          <AdvantageSection
            variant="promo"
            namespace="creatorPromo"
            trackingId="founder_invite_advantage"
          />
          {/* Marker picked up by FounderInviteBackdrop — once this wrapper
              enters the viewport, the backdrop fades in a black overlay so
              the FAQ + footer area sits on a solid black ground. */}
          <div data-backdrop-fade-trigger>
            <FAQSection
              namespace="creatorPromo"
              trackingId="founder_invite_faq"
              analyticsEvent="founder_invite_faq_toggle"
              expandInline
            />
          </div>
          <EarnFooter />
        </div>
      </main>
    </SignupProvider>
  );
}
