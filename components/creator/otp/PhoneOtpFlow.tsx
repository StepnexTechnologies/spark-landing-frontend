"use client";

import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { ValidatedPhoneInput } from "@/components/creator/earn/ValidatedPhoneInput";
import { track } from "@/lib/analytics/track";
import { sendOtp, verifyOtp } from "./api";
import OtpInput from "./OtpInput";

type Stage = "phone" | "sending" | "otp" | "verifying";

// "inline-light" — for use on light/yellow backgrounds (hero card). Darker
// text, white input chrome, purple gradient button.
// "inline-dark" — for use on dark backgrounds (floating CTA bar, modal). White
// text, glassy input chrome, pink/purple gradient button. (Default.)
export type PhoneOtpFlowVariant = "inline-dark" | "inline-light";

interface PhoneOtpFlowProps {
  // Prefix used for analytics events (`{prefix}_send_otp_click`,
  // `{prefix}_verified`). Lets us tell hero submissions apart from floating-CTA
  // submissions in tracking.
  analyticsPrefix: string;
  // Where to redirect on successful verification. Defaults to the existing
  // beta auth URL used by FloatingCTA. Phone, lang and ref are appended.
  redirectBaseUrl?: string;
  otpLength?: number;
  // Override the CTA button label. Defaults to the i18n key `floatingCta.signup`.
  ctaLabel?: string;
  variant?: PhoneOtpFlowVariant;
}

const RESEND_SECONDS = 30;
const DEFAULT_REDIRECT = "https://beta.creator.sparkonomy.com/auth?service=earn";

export default function PhoneOtpFlow({
  analyticsPrefix,
  redirectBaseUrl = DEFAULT_REDIRECT,
  otpLength = 4,
  ctaLabel,
  variant = "inline-dark",
}: PhoneOtpFlowProps) {
  const isLight = variant === "inline-light";
  const containerClass = isLight
    ? "flex items-center w-full rounded-[16px] bg-white border border-black/10 p-[6px] pl-3 gap-2"
    : "flex items-center w-full rounded-full bg-white/10 backdrop-blur-[16px] border border-white/20 px-3 py-2 gap-2";
  const buttonClass = isLight
    ? "flex-shrink-0 p-2 rounded-[8px] text-white text-sm font-semibold whitespace-nowrap bg-[linear-gradient(162deg,#dd2a7b_0%,#9747FF_64%)] hover:brightness-110 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
    : "flex-shrink-0 px-5 py-2.5 rounded-full text-white text-sm font-semibold whitespace-nowrap bg-[linear-gradient(162deg,rgba(221,42,123,0.8)_0%,rgba(151,71,255,0.8)_64%)] hover:bg-[linear-gradient(162deg,rgba(221,42,123,1)_0%,rgba(151,71,255,1)_64%)] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed";
  const verifyButtonClass = isLight
    ? "w-full px-5 py-3 rounded-full text-white text-sm font-semibold bg-[linear-gradient(162deg,#dd2a7b_0%,#9747FF_64%)] hover:brightness-110 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
    : "w-full px-5 py-3 rounded-full text-white text-sm font-semibold bg-[linear-gradient(162deg,rgba(221,42,123,0.9)_0%,rgba(151,71,255,0.9)_64%)] hover:bg-[linear-gradient(162deg,rgba(221,42,123,1)_0%,rgba(151,71,255,1)_64%)] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed";
  const otpHeadingClass = isLight ? "text-[#5C2E0B] text-sm font-semibold" : "text-white/90 text-sm";
  const otpSubClass = isLight ? "text-[#5C2E0B]/70 text-xs" : "text-white/60 text-xs";
  const otpFooterClass = isLight
    ? "flex items-center justify-between w-full text-xs text-[#5C2E0B]/80"
    : "flex items-center justify-between w-full text-xs text-white/70";
  const linkHoverClass = isLight ? "underline hover:text-[#5C2E0B]" : "underline hover:text-white";

  const { t, i18n } = useTranslation("creatorPromo");
  const searchParams = useSearchParams();

  const [stage, setStage] = useState<Stage>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);

  const referralCode = searchParams.get("ref");
  const currentLang = i18n.language?.startsWith("hi") ? "hi-Latn" : "en";

  useEffect(() => {
    if (stage !== "otp" || resendIn <= 0) return;
    const id = setInterval(() => {
      setResendIn((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [stage, resendIn]);

  const handleSendOtp = async () => {
    if (!phone || stage === "sending") return;
    setError(null);
    setStage("sending");
    track(`${analyticsPrefix}_send_otp_click`, { has_phone: Boolean(phone), referral_code: referralCode ?? null });
    try {
      await sendOtp(phone);
      setStage("otp");
      setOtp("");
      setResendIn(RESEND_SECONDS);
    } catch {
      setError(t("otp.errorNetwork"));
      setStage("phone");
    }
  };

  const handleResend = async () => {
    if (resendIn > 0) return;
    setError(null);
    track(`${analyticsPrefix}_resend_otp`, { referral_code: referralCode ?? null });
    try {
      await sendOtp(phone);
      setOtp("");
      setResendIn(RESEND_SECONDS);
    } catch {
      setError(t("otp.errorNetwork"));
    }
  };

  const handleVerify = async () => {
    if (otp.length !== otpLength || stage === "verifying") return;
    setError(null);
    setStage("verifying");
    try {
      const result = await verifyOtp(phone, otp);
      if (!result.ok) {
        setError(t("otp.errorInvalid"));
        setStage("otp");
        return;
      }
      track(`${analyticsPrefix}_verified`, { referral_code: referralCode ?? null });
      const url = new URL(result.redirectUrl ?? redirectBaseUrl);
      url.searchParams.set("lang", currentLang);
      url.searchParams.set("phone", phone);
      if (referralCode) url.searchParams.set("ref", referralCode);
      window.location.href = url.toString();
    } catch {
      setError(t("otp.errorNetwork"));
      setStage("otp");
    }
  };

  const handleChangeNumber = () => {
    setOtp("");
    setError(null);
    setResendIn(0);
    setStage("phone");
  };

  const submitLabel = ctaLabel ?? t("floatingCta.signup");

  if (stage === "phone" || stage === "sending") {
    return (
      <div className="flex flex-col gap-2 w-full">
        <div className={containerClass}>
          <Suspense fallback={null}>
            <ValidatedPhoneInput
              id={`${analyticsPrefix}-phone`}
              value={phone}
              onChange={setPhone}
              placeholder={t("hero.card.phonePlaceholder")}
              theme={isLight ? "light" : "dark"}
              inputClassName={
                isLight
                  ? "bg-transparent border-none outline-none text-base placeholder:text-[#999999] focus:outline-none focus:ring-0 w-full text-[#212529]"
                  : undefined
              }
            />
          </Suspense>
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={!phone || stage === "sending"}
            className={buttonClass}
          >
            {stage === "sending" ? t("otp.sending") : submitLabel}
          </button>
        </div>
        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full px-2 py-2">
      <p className={otpHeadingClass}>{t("otp.title")}</p>
      <p className={otpSubClass}>{t("otp.sentTo", { phone })}</p>

      <OtpInput
        length={otpLength}
        value={otp}
        onChange={setOtp}
        autoFocus
        disabled={stage === "verifying"}
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <button
        type="button"
        onClick={handleVerify}
        disabled={otp.length !== otpLength || stage === "verifying"}
        className={verifyButtonClass}
      >
        {stage === "verifying" ? t("otp.verifying") : t("otp.verify")}
      </button>

      <div className={otpFooterClass}>
        {resendIn > 0 ? (
          <span>{t("otp.resendIn", { seconds: resendIn })}</span>
        ) : (
          <button type="button" onClick={handleResend} className={linkHoverClass}>
            {t("otp.resend")}
          </button>
        )}
        <button type="button" onClick={handleChangeNumber} className={linkHoverClass}>
          {t("otp.changeNumber")}
        </button>
      </div>
    </div>
  );
}
