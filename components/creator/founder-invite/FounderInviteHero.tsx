"use client";

import Image from "next/image";
import { Trans, useTranslation } from "react-i18next";
import type { FounderReferral } from "@/lib/data/founder-referrals";
import FounderInviteSignupCard from "@/components/creator/promo/FounderInviteSignupCard";

// Yellow-highlight style — same trick as the promo HeroSection so the
// "gift for you" run keeps a consistent visual treatment across the funnel.
// boxDecorationBreak: clone keeps the highlight intact across line wraps.
const HIGHLIGHT_STYLE: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(100deg, transparent 0, transparent 0.2em, #FFCC00 0.35em, #FFCC00 calc(100% - 0.35em), transparent calc(100% - 0.2em), transparent 100%)",
  padding: "0.05em 0.4em",
  boxDecorationBreak: "clone",
  WebkitBoxDecorationBreak: "clone",
  color: "#000",
};

const CREATORS_HIGHLIGHT_STYLE: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(162.34deg, #DD2A7B 4.78%, #9747FF 89.95%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

interface Props {
  data: FounderReferral;
}

export default function FounderInviteHero({ data }: Props) {
  const { t } = useTranslation("creatorFounderInvite");

  return (
    <section className="px-5 pt-4 pb-8 max-w-[440px] mx-auto">
      {/* Friend avatar — circular pill above the "Invited you" line */}
      <div className="flex flex-col items-center">
        <div className="relative h-[72px] w-[72px] rounded-full overflow-hidden ring-2 ring-white/30">
          <Image
            src={data.friend.image}
            alt={data.friend.name}
            fill
            sizes="72px"
            className="object-cover"
            priority
            fetchPriority="high"
          />
        </div>
        <p className="mt-3 inline-flex items-center rounded-full bg-white/8 px-4 py-1 text-sm text-white">
          <span className="font-semibold">{data.friend.name}</span>
          <span className="ml-1 font-light">{t("hero.invitedYou")}</span>
        </p>
      </div>

      {/* Divider — gradient hairlines on either side of the small caps label */}
      <div className="mt-5 flex items-center gap-3 text-[10px] tracking-[0.22em] text-white/85">
        <span
          className="h-px flex-1"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #DD2A7B 60%, #9747FF 100%)",
          }}
        />
        <span className="font-semibold whitespace-nowrap">
          {t("hero.exclusiveDivider")}
        </span>
        <span
          className="h-px flex-1"
          style={{
            background:
              "linear-gradient(90deg, #9747FF 0%, #DD2A7B 40%, transparent 100%)",
          }}
        />
      </div>

      {/* Headline — yellow highlight on the "gift for you" run */}
      <h1 className="mt-5 text-[32px] font-bold text-white text-center leading-tight tracking-[-0.01em]">
        <Trans
          i18nKey="hero.headline"
          t={t}
          components={[<mark key="hl" style={HIGHLIGHT_STYLE} />]}
        />
      </h1>

      {/* Founder quote card */}
      <div
        className="mt-6 rounded-[20px] border border-white/10 px-4 py-4 backdrop-blur-sm"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
        }}
      >
        <div className="flex items-start gap-3">
          <div className="relative h-[44px] w-[44px] flex-shrink-0 rounded-full overflow-hidden ring-1 ring-white/30">
            <Image
              src={data.founder.image}
              alt={data.founder.name}
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <blockquote className="text-[14px] italic text-white leading-snug">
              &ldquo;{data.founder.quote}&rdquo;
            </blockquote>
            <p className="mt-2 text-[12px] text-white/80">
              <span className="font-semibold">{data.founder.name}</span>
              <span className="mx-1.5">•</span>
              <span>{t("hero.founderTitle")}</span>
            </p>
          </div>
        </div>
      </div>

      {/* WHAT IS SPARKONOMY? intro */}
      <div className="mt-7">
        <p className="text-[10px] tracking-[0.22em] font-semibold text-white/85">
          {t("hero.whatIs")}
        </p>
        <h2 className="mt-1 text-[22px] font-bold text-white leading-snug">
          <Trans
            i18nKey="hero.whatIsHeadline"
            t={t}
            components={[<span key="creators" style={CREATORS_HIGHLIGHT_STYLE} />]}
          />
        </h2>
        <p className="mt-3 text-[14px] text-white/90 leading-relaxed">
          {t("hero.whatIsBody")}
        </p>
        <p className="mt-3 text-[12px] text-white/70 leading-relaxed">
          {t("hero.whatIsFootnote")}
        </p>
      </div>

      {/* Signup card */}
      <div className="mt-6">
        <FounderInviteSignupCard
          founderName={data.founder.name}
          friendName={data.friend.name}
        />
      </div>
    </section>
  );
}
