"use client";

import { Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trans, useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { ValidatedPhoneInput } from "./ValidatedPhoneInput";
import { useSignup } from "@/components/creator/promo/SignupContext";
import { track } from "@/lib/analytics/track";
import { PROMO_CONFIG } from "@/lib/promo/config";

interface FloatingCTAProps {
  // "earn"  → existing inline phone input + Sign Up button on the dark glass bar.
  // "promo" → yellow voucher card with embedded phone → OTP verification flow.
  variant?: "earn" | "promo";
  namespace?: string;
  // Analytics event prefix. Earn fires "earn_cta_click" / "earn_floating_cta_phone_submit".
  // Pass "promo" to fire "promo_cta_click" / "promo_floating_cta_*" instead.
  trackingPrefix?: string;
  // If provided, the bar is shown only when this element is out of viewport
  // (and hidden again when it scrolls back in). Used by the promo page so the
  // floating CTA doesn't overlap the identical hero OTP card. Falls back to
  // the default "show on any scroll" behavior when omitted or not found.
  triggerElementId?: string;
}

export default function FloatingCTA({
  variant = "earn",
  namespace = "creatorEarn",
  trackingPrefix = "earn",
  triggerElementId,
}: FloatingCTAProps = {}) {
  const { t, i18n, ready } = useTranslation(namespace);
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const target = triggerElementId ? document.getElementById(triggerElementId) : null;
    if (target) {
      const observer = new IntersectionObserver(
        ([entry]) => setIsVisible(!entry.isIntersecting),
        { threshold: 0 },
      );
      observer.observe(target);
      return () => observer.disconnect();
    }

    const handleScroll = () => {
      if (window.scrollY > 0) setIsVisible(true);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [triggerElementId]);

  if (!mounted || !ready) {
    return null;
  }

  return variant === "promo" ? (
    <PromoFloatingCTA isVisible={isVisible} t={t} trackingPrefix={trackingPrefix} />
  ) : (
    <EarnFloatingCTA
      isVisible={isVisible}
      t={t}
      i18n={i18n}
      searchParams={searchParams}
      trackingPrefix={trackingPrefix}
    />
  );
}

// ---------- Earn variant ---------------------------------------------------

interface EarnVariantProps {
  isVisible: boolean;
  t: (key: string) => string;
  i18n: { language?: string };
  searchParams: ReturnType<typeof useSearchParams>;
  trackingPrefix: string;
}

function EarnFloatingCTA({ isVisible, t, i18n, searchParams, trackingPrefix }: EarnVariantProps) {
  const [phone, setPhone] = useState("");

  const referralCode = searchParams.get("ref");
  const currentLang = i18n.language?.startsWith("hi") ? "hi-Latn" : "en";

  const handleSignup = () => {
    const url = new URL("https://beta.creator.sparkonomy.com/auth?service=earn");
    url.searchParams.set("lang", currentLang);
    if (referralCode) url.searchParams.set("ref", referralCode);
    if (phone) url.searchParams.set("phone", phone);
    track(`${trackingPrefix}_cta_click`, {
      cta: "floating_beta_signup",
      has_phone: Boolean(phone),
      referral_code: referralCode ?? null,
    });
    if (phone) {
      track(`${trackingPrefix}_floating_cta_phone_submit`, { referral_code: referralCode ?? null });
    }
    window.location.href = url.toString();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-4 left-0 right-0 z-50 flex justify-center items-center px-4"
        >
          <div className="flex items-center w-full max-w-md rounded-full bg-white/10 backdrop-blur-[16px] backdrop-brightness-[100%] shadow-[0_8px_32px_rgba(221,42,123,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] border border-white/20 px-3 py-2 gap-2">
            <Suspense fallback={null}>
              <ValidatedPhoneInput
                id="floating-cta-phone"
                value={phone}
                onChange={setPhone}
                placeholder={t("floatingCta.placeholder")}
              />
            </Suspense>
            <button
              onClick={handleSignup}
              className="flex-shrink-0 px-5 py-2.5 rounded-full text-white text-sm font-semibold whitespace-nowrap bg-[linear-gradient(162deg,rgba(221,42,123,0.8)_0%,rgba(151,71,255,0.8)_64%)] hover:bg-[linear-gradient(162deg,rgba(221,42,123,1)_0%,rgba(151,71,255,1)_64%)] transition-all duration-200"
            >
              {t("floatingCta.signup")}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------- Promo variant --------------------------------------------------

interface PromoVariantProps {
  isVisible: boolean;
  t: ReturnType<typeof useTranslation>["t"];
  trackingPrefix: string;
}

function PromoFloatingCTA({ isVisible, t, trackingPrefix }: PromoVariantProps) {
  // Signup state lives at the page level so the floating bar can hand its
  // phone number off to the hero card. On Send OTP we advance the shared
  // stage to 'otp' and smooth-scroll to the hero — by the time the scroll
  // settles, the user is already looking at the OTP step.
  const { phone, setPhone, sendOtp, stage } = useSignup();

  const handleSubmit = () => {
    track(`${trackingPrefix}_floating_cta_phone_submit`, { has_phone: Boolean(phone) });
    const target = document.getElementById("promo-hero-card");
    target?.scrollIntoView({ behavior: "smooth", block: "center" });

    if (stage !== "phone") return;

    // Sequence: smooth-scroll to stage 1 → brief hold so the user sees their
    // number populated on the hero card → then advance to stage 2. We wait for
    // `scrollend` because flipping the stage mid-scroll collapses the
    // disclaimer / unfolds the OTP section, and Chrome cancels the in-flight
    // smooth scroll on those layout shifts — making it look like an instant
    // jump straight to stage 2.
    const STAGE_ONE_HOLD_MS = 350;
    const fireSendOtp = () => void sendOtp();
    const supportsScrollEnd = "onscrollend" in window;
    if (!supportsScrollEnd || !target) {
      window.setTimeout(fireSendOtp, 650 + STAGE_ONE_HOLD_MS);
      return;
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.removeEventListener("scrollend", finish);
      window.setTimeout(fireSendOtp, STAGE_ONE_HOLD_MS);
    };
    window.addEventListener("scrollend", finish);
    // Safety net: if the page didn't actually need to scroll (target already
    // centered) `scrollend` may never fire.
    window.setTimeout(finish, 900);
  };

  const buttonLabel = stage === "otpSending" ? t("otp.sending") : t("floatingCta.sendOtp");

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40"
        >
          <div
            className="relative w-full md:max-w-md md:mx-auto rounded-t-[20px] py-2 px-6 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-12px_30px_rgba(245,166,35,0.35),0_-4px_12px_rgba(0,0,0,0.25)]"
            style={{
              background:
                "linear-gradient(180deg, #FFCC00 0%, #FFCC00 50%, #806600 80%, #000000 100%)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
            }}
          >
            {/* Voucher row */}
            <div className="flex items-center gap-3 mb-1">
              <Image
                src="/promo/landing-promo/giftCard.png"
                alt=""
                width={39}
                height={32}
                className="w-[39px] h-[32px] shrink-0 object-contain"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-primary font-medium text-sm leading-tight">
                  {t("hero.card.voucherHeading")}
                </h3>
                <p className="mt-1 text-primary font-normal text-xs leading-snug">
                  {t("hero.card.voucherBody")}
                </p>
              </div>
            </div>

            {/* Phone input + Send OTP — hand-off to the hero card on submit */}
            <div className="flex items-center w-full rounded-[16px] bg-white border border-black/10 p-[6px] pl-3 gap-2">
              <Suspense fallback={null}>
                <ValidatedPhoneInput
                  id="promo-floating-phone"
                  value={phone}
                  onChange={setPhone}
                  placeholder={t("floatingCta.placeholder")}
                  inputClassName="bg-transparent border-none outline-none text-base placeholder:text-[#999999] focus:outline-none focus:ring-0 w-full text-[#212529]"
                />
              </Suspense>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!phone || stage === "otpSending"}
                className="flex-shrink-0 px-3 py-2 rounded-[8px] text-white text-sm font-semibold whitespace-nowrap bg-[linear-gradient(162deg,#dd2a7b_0%,#9747FF_64%)] hover:brightness-110 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {buttonLabel}
              </button>
            </div>

            {/* Disclaimer */}
            <p className="mt-1 text-[11px] text-white text-center leading-snug px-1">
              <Trans
                i18nKey="hero.card.disclaimer"
                t={t}
                components={[
                  <a
                    key="terms"
                    href={PROMO_CONFIG.terms.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 font-medium"
                  />,
                  <a
                    key="privacy"
                    href="/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 font-medium"
                  />,
                ]}
              />
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
