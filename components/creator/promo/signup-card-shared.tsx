"use client";

import Image from "next/image";
import { Check, Loader2, X } from "lucide-react";
import type { useTranslation } from "react-i18next";

// Shared spring used for the OTP/profile sheet reveals on both the promo and
// founder-invite signup cards. Kept here so both cards open and close in the
// same beat.
export const SHEET_TRANSITION = { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const };

// Static yellow card background — replaces the previous infinite gradient
// interpolation (which kept the card on the long-tasks list during scroll).
// Reused by FounderInviteSignupCard so the two cards stay visually identical.
export const CARD_GRADIENT =
  "linear-gradient(180deg, #FFCC00 0%, rgba(255, 204, 0, 0.7) 59.13%, rgba(255, 204, 0, 0.2) 100%)";

type TFn = ReturnType<typeof useTranslation>["t"];

export function VerifiedBadge({
  status,
  t,
}: {
  status: "idle" | "verifying" | "verified" | "error";
  t: TFn;
}) {
  let icon: React.ReactNode;
  let label: string;
  let cls: string;

  if (status === "verifying") {
    icon = <Loader2 className="w-3.5 h-3.5 animate-spin" />;
    label = t("signupCard.verifying");
    cls = "border-primary/40 text-primary/80 bg-white/70";
  } else if (status === "verified") {
    icon = <Check className="w-3.5 h-3.5" style={{ color: "#01F93F" }} />;
    label = t("signupCard.verified");
    cls = "border-primary text-primary bg-black/10";
  } else if (status === "error") {
    icon = <X className="w-3.5 h-3.5" />;
    label = t("signupCard.invalid");
    cls = "border-red-500 text-red-600 bg-white";
  } else {
    icon = <X className="w-3.5 h-3.5" />;
    label = t("signupCard.notVerified");
    cls = "border-primary/40 text-primary/70 bg-[linear-gradient(162.34deg,_rgba(221,42,123,0.2)_4.78%,_rgba(151,71,255,0.2)_89.95%)]";
  }

  return (
    <span
      className={`inline-flex flex-shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${cls}`}
    >
      {icon}
      {label}
    </span>
  );
}

export function ResendRow({
  resendIn,
  resendOtp,
  disabled,
  t,
}: {
  resendIn: number;
  resendOtp: () => Promise<void>;
  disabled: boolean;
  t: TFn;
}) {
  const m = Math.floor(resendIn / 60)
    .toString()
    .padStart(2, "0");
  const s = (resendIn % 60).toString().padStart(2, "0");
  const ticking = resendIn > 0;
  const channelClass = ticking
    ? "font-semibold underline opacity-60"
    : "font-semibold underline hover:text-white disabled:opacity-50";

  return (
    <div className="flex items-center justify-center gap-1.5 w-full text-[11px] text-white/90 text-center">
      {ticking && (
        <span className="font-medium tabular-nums">{`${m}:${s}`}</span>
      )}
      <span>{t("otp.resendViaPrefix")}</span>
      <button
        type="button"
        onClick={resendOtp}
        disabled={disabled || ticking}
        className={channelClass}
      >
        {t("otp.smsChannel")}
      </button>
      <span>&amp;</span>
      <button
        type="button"
        onClick={resendOtp}
        disabled={disabled || ticking}
        className={channelClass}
      >
        {t("otp.whatsappChannel")}
      </button>
    </div>
  );
}

export function PartnerFooter() {
  return (
    <div className="mt-3 flex items-center justify-center text-[11px] text-[#5C2E0B]/85">
      <Image
        src="/logos/Meta_White.png"
        alt="Meta"
        width={85}
        height={30}
        className="mr-3 border-r border-white pr-3"
      />
      <Image
        src="/logos/Yt_White.png"
        alt="YouTube"
        width={85}
        height={30}
        className="ml-3"
      />
    </div>
  );
}

export function WhatsAppGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="text-white"
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.711.307 1.265.49 1.697.626.713.226 1.362.194 1.875.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}
