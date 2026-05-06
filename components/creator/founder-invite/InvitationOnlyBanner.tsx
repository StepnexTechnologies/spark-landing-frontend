"use client";

import { useTranslation } from "react-i18next";

// Thin pink strip that sits between the nav and the hero. The dot separator is
// a literal middot character so it doesn't depend on a custom font.
export default function InvitationOnlyBanner() {
  const { t } = useTranslation("creatorFounderInvite");
  return (
    <div
      className="w-full text-center text-[11px] tracking-[0.18em] font-medium text-[#FFB1D8] py-1.5 px-4"
      style={{
        background:
          "linear-gradient(90deg, rgba(221,42,123,0) 0%, rgba(221,42,123,0.18) 50%, rgba(151,71,255,0) 100%)",
      }}
    >
      <span>{t("banner.left")}</span>
      <span className="mx-2 text-[#FFB1D8]/70">·</span>
      <span>{t("banner.right")}</span>
    </div>
  );
}
