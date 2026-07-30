"use client";

import { Trans, useTranslation } from "react-i18next";
import { ChevronDown, Clock } from "lucide-react";
import PromoSignupCard from "@/components/creator/promo/PromoSignupCard";
import PortfolioName from "./PortfolioName";

// Identity lines + signup/claim card. Lives at the top of the content stack
// (above the Advantage/FAQ sections) so the card and the sections share one
// normal-flow container — that's what keeps the card from overlapping the
// sections as it expands.
export default function HeroIntro() {
  const { t } = useTranslation("creatorPortfolio");

  return (
    <div className="mx-auto flex w-full max-w-[520px] flex-col items-center px-4">
      {/* Identity — name + tagline + claim line. name/@handle come from the API
          alongside the video; these are the placeholders. */}
      <div className="mb-6 text-center text-white">
        {/* Name rendered with the portfolio hero's fit-to-width / two-line /
            truncate logic. */}
        <PortfolioName displayName={t("hero.name")} />
        <p className="mt-4 text-[32px] font-bold leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
          <Trans i18nKey="hero.tagline" t={t} components={[<span key="h" className="text-white/90" />]} />
        </p>
        {/* Three stacked chevrons, fading toward the bottom. */}
        <div className="my-2 flex flex-col items-center -space-y-[18px]" aria-hidden="true">
          <ChevronDown className="h-6 w-6 text-white/90" />
          <ChevronDown className="h-6 w-6 text-white/50" />
          <ChevronDown className="h-6 w-6 text-white/25" />
        </div>
        <p className="text-[32px] font-bold leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
          {t("hero.claimLine")}
        </p>
      </div>

      {/* Signup / claim card. Carries id="promo-hero-card" internally; the
          page's FloatingCTA hides while it's on screen. */}
      <div className="w-full max-w-[468px]">
        <PromoSignupCard
          variant="earn"
          namespace="creatorPortfolio"
          hideCornerCoin
          centerHeading
          cardBackground="linear-gradient(171.03deg, #000000 -0.78%, rgba(221, 42, 123, 0.09) 100.02%)"
        />
      </div>

      {/* Process line + time estimate below the card. */}
      <div className="mt-6 w-full max-w-[468px] text-center">
        <p className="text-lg md:text-xl font-bold text-white">{t("hero.steps")}</p>
        <div className="mt-3 flex items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#DD2A7B]" />
          <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm text-white/60">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {t("hero.timeEstimate")}
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#DD2A7B]" />
        </div>
      </div>
    </div>
  );
}
