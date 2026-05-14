"use client";

import { useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import PromoSignupCard from "@/components/creator/promo/PromoSignupCard";
import HeroStoryCarousel from "./HeroStoryCarousel";
import { useSectionViewTracking } from "@/lib/hooks/useSectionViewTracking";

// Script styling for the second line of the title ("Jaldi payment paayein!" /
// "Get paid faster!"). Solitreo at the spec'd 40px / weight 400 / -4% tracking.
// Kept as its own style object so the regular Roboto bold line above it stays
// untouched.
const TITLE_SCRIPT_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-solitreo), 'Brush Script MT', 'Snell Roundhand', cursive",
  fontWeight: 400,
  fontSize: "40px",
  letterSpacing: "-0.04em",
  lineHeight: 1.1,
  color: "#FFFFFF",
  display: "inline-block",
};

export default function HeroSection() {
  const { t } = useTranslation("creatorEarn");
  const sectionRef = useRef<HTMLElement>(null);
  useSectionViewTracking(sectionRef, "earn_hero", { event: "earn_hero_view" });

  return (
    <section
      ref={sectionRef}
      className="relative pt-6 md:pt-12 pb-8 md:pb-12 px-5 md:px-20 overflow-hidden"
    >
      <div className="max-w-[760px] mx-auto">
        {/* Headline — plain text leading line + yellow-highlighted script tail.
            i18nKey "hero.title" uses <0/> for the mobile line break and
            <1>...</1> to mark the portion that should get the highlight. */}
        <h1 className="text-[25px] font-bold text-white text-center leading-[1.2] tracking-[-0.04em] mb-6 md:mb-8 max-w-[640px] mx-auto">
          <Trans
            i18nKey="hero.title"
            t={t}
            components={[
              <br key="brk" />,
              <span key="hl" style={TITLE_SCRIPT_STYLE} />,
            ]}
          />
        </h1>

        {/* Auto-rotating story preview — cycles through the 4 Instagram-style
            stories every 2 seconds in a loop. Uses the same StoryContent1-4
            components as the full-screen onboarding so the chrome (avatar,
            handle, like/send) matches across both surfaces. */}
        <HeroStoryCarousel />

        {/* Signup card — earn variant draws gold coin + Win Now button + 3
            checks from the creatorEarn namespace. Static paint (no fade-in
            wrapper) so the card qualifies as the LCP element.
            Negative side-margins on mobile (-13px) cancel the section's
            px-5 (20px) so the card sits 7px from the screen edges; desktop
            keeps the original max-w-[420px] mx-auto centering. */}
        <div className="-mx-[13px] md:mx-0">
          <PromoSignupCard variant="earn" namespace="creatorEarn" />
        </div>
      </div>
    </section>
  );
}
