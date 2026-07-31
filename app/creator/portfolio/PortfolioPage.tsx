"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import "@/lib/i18n"; // Initialize i18n
import MotionProvider from "@/components/MotionProvider";
import Navigation from "@/components/creator/earn/Navigation";
import HeroSection from "@/components/creator/portfolio/HeroSection";
import HeroIntro from "@/components/creator/portfolio/HeroIntro";
import LandingBlobs from "@/components/creator/portfolio/LandingBlobs";
import { SignupProvider } from "@/components/creator/promo/SignupContext";
import { usePortfolioUserDetails } from "@/lib/hooks/usePortfolioUserDetails";

// Below-the-fold sections are lazy-loaded, mirroring the earn funnel. Advantage
// and FAQ come straight from the shared earn components (they already accept a
// `namespace` prop); the footer is the portfolio-namespaced copy.
const AdvantageSection = dynamic(() => import("@/components/creator/earn/AdvantageSection"));
const FAQSection = dynamic(() => import("@/components/creator/earn/FAQSection"));
const PortfolioFooter = dynamic(() => import("@/components/creator/portfolio/PortfolioFooter"));
const FloatingCTA = dynamic(() => import("@/components/creator/earn/FloatingCTA"), { ssr: false });

function CreatorPortfolioPageContent() {
  const { i18n, t } = useTranslation("creatorPortfolio");
  const searchParams = useSearchParams();

  useEffect(() => {
    // Honor ?lang= when present; otherwise let the detector / user selection
    // stand. i18next swaps strings in place (no remount) on change.
    const langParam = searchParams.get("lang");
    if (langParam && ["en", "hi-Latn"].includes(langParam)) {
      i18n.changeLanguage(langParam);
    }
  }, [searchParams, i18n]);

  // Two hero versions:
  //   • "Claim your portfolio"      → the creator's own media (from the API).
  //   • "Want a portfolio like @X"  → the placeholder clip.
  //
  // Creators land here as /creator/portfolio?portfolio_slug=<slug>. That slug is
  // the only input to the public portfolio API — the same `user_details` section
  // the creator app's portfolio hero reads (GET /v1/portfolios/{slug}/sections/
  // user_details). It carries the hero video, its poster, a still fallback, the
  // focal point, and the creator's display name.
  //
  // No slug, an unknown slug, or a creator with no hero media → the hook yields
  // null and HeroSection falls back to the bundled placeholder clip, which is
  // exactly the "want a portfolio like @X" version.
  //
  // TO CHECK: the happy path here is unverified. What's been confirmed is the
  // endpoint exists on both app-api-dev and app-api (unknown slug → 404), and
  // that CORS allows dev.sparkonomy.com / www.sparkonomy.com respectively. What
  // hasn't: an actual portfolio slug returning hero media, and that media
  // rendering in the band. Open /creator/portfolio?portfolio_slug=<real-slug>
  // and confirm the creator's own video plays instead of the placeholder.
  // Note the failure mode is silent by design — every error becomes the
  // placeholder clip, so a wrong field name or shape would look like a creator
  // who simply has no video. Check the network tab, not just the page.
  const portfolioSlug = searchParams.get("portfolio_slug");
  const { data: userDetails } = usePortfolioUserDetails(portfolioSlug);

  // ?video= / ?poster= stay as demo overrides so the hero can be previewed
  // without a real portfolio behind it. Absent → the API values win.
  const heroVideoUrl = searchParams.get("video") ?? userDetails?.hero_video_url;
  const heroPosterUrl =
    searchParams.get("poster") ?? userDetails?.hero_video_poster_url;

  return (
    <SignupProvider socialAuthAfterVerify namespace="creatorPortfolio">
      {/* Required: every section under components/creator/** renders `m.*`, which
          needs a LazyMotion ancestor. Without it the feature bundle never loads,
          `whileInView` never fires, and the below-the-fold sections stay stuck at
          their `initial` opacity: 0 (visible as an empty gap under the hero). */}
      <MotionProvider>
      <main className="relative min-h-screen bg-black overflow-hidden">
        {/* Decorative background blobs (config in components/creator/portfolio/blobConfig.ts). */}
        <LandingBlobs />

        {/* Content */}
        <div className="relative z-10">
          <Navigation
            namespace="creatorPortfolio"
            languageSwitcherVariant="segmented"
            className="py-2 md:py-2"
          />
          {/* Invitation-only strip directly below the header. */}
          {/* `backgroundImage` (not the `background` shorthand) so the warm glow
              layers over the bg-black/40 base rather than replacing it — the
              gradient is transparent at both ends and only lights the middle. */}
          <div
            className="relative z-40 border-y border-white/10 bg-black/40 px-5 py-1.5 text-center backdrop-blur-sm"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(254, 226, 176, 0) 0%, rgba(254, 226, 176, 0.475962) 52.4%, rgba(254, 226, 176, 0) 100%)",
            }}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-white">
              {t("nav.invitationStrip")}
            </p>
          </div>
          {/* Hero = video band only (relative, h-[60vh]). */}
          <HeroSection
            videoUrl={heroVideoUrl}
            posterUrl={heroPosterUrl}
            imageUrl={userDetails?.hero_image_url}
            focalPoint={userDetails?.hero_focal_point}
          />

          {/* Everything else — identity + card + ALL sections — in ONE
              container, positioned to start 100px from the top of the hero.
              The card and the sections share this single flow container, so the
              card can never overlap the sections (they stack naturally).

              This uses a negative margin rather than position:absolute on
              purpose: an absolute container would freeze the page height at the
              hero's 50vh, so the FAQ + footer couldn't be scrolled to. The
              margin gives the exact "one container, 100px from the hero top"
              layout while the page still scrolls. Change the 100px to shift the
              whole block up/down the video. */}
          <div className="relative z-30 -mt-[calc(60vh-400px)]">
            <HeroIntro displayName={userDetails?.display_name} />
            {/* 3. Your Advantage */}
            <AdvantageSection
              variant="promo"
              namespace="creatorPortfolio"
              trackingId="portfolio_advantage"
              analyticsEvent="portfolio_cta_click"
            />
            {/* 4. FAQ */}
            <FAQSection
              namespace="creatorPortfolio"
              trackingId="portfolio_faq"
              analyticsEvent="portfolio_faq_toggle"
              expandInline
            />
            <PortfolioFooter />
          </div>
        </div>

        {/* Floating CTA — kept a direct child of <main> (no motion wrapper) so
            position:fixed anchors to the viewport. Hidden while the hero card
            (id promo-hero-card) is on screen; submitting from here pipes the
            phone into the shared SignupContext. */}
        <FloatingCTA
          variant="earn"
          namespace="creatorPortfolio"
          trackingPrefix="portfolio"
          triggerElementId="promo-hero-card"
          hideCornerCoin
          centerHeading
          cardBackground="linear-gradient(171.03deg, #000000 -0.78%, rgba(221, 42, 123, 0.09) 100.02%)"
        />
      </main>
      </MotionProvider>
    </SignupProvider>
  );
}

export default function CreatorPortfolioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <CreatorPortfolioPageContent />
    </Suspense>
  );
}
