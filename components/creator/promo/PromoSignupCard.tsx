"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Trans, useTranslation } from "react-i18next";
import { ArrowRight, Check, Loader2, X } from "lucide-react";
import { parsePhoneNumber } from "libphonenumber-js";
import { ValidatedPhoneInput } from "@/components/creator/earn/ValidatedPhoneInput";
import OtpInput from "@/components/creator/otp/OtpInput";
import TextInput from "@/components/common/TextInput";
import FlippingCoin from "@/components/creator/earn/FlippingCoin";
import { PROMO_CONFIG } from "@/lib/promo/config";
import { useSignup } from "./SignupContext";
import GiftCardStackAnimation from "./GiftCardStackAnimation";
import CountUp from "./CountUp";

const SHEET_TRANSITION = { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const };

// Resting + lifted box-shadows for the "the card noticed you" cue on first
// scroll. Same two-layer composition (warm glow + soft drop), the lifted
// version just pushes both layers further out and darker.
const REST_SHADOW =
  "0 18px 40px rgba(245,166,35,0.25), 0 8px 20px rgba(0,0,0,0.25)";
const LIFT_SHADOW =
  "0 26px 52px rgba(245,166,35,0.4), 0 14px 28px rgba(0,0,0,0.35)";

// Static background — replaces the previous infinite 12s gradient interpolation
// (5 keyframes, full repaint each frame). Removing the loop drops PromoSignupCard
// out of the long-tasks list on mobile and gives back ~40% of the page's mid-scroll
// frame budget without any visible loss.
const CARD_GRADIENT =
  "linear-gradient(180deg, #FFCC00 0%, rgba(255, 204, 0, 0.7) 59.13%, rgba(255, 204, 0, 0.2) 100%)";

// Earn variant — dark plum so the gold-coin corners + the yellow CTA contrast
// against the rest of the card chrome. The page itself sits on a pink/purple
// gradient blob, so the card needs to be measurably darker to read as its own
// surface (otherwise it visually melts into the page bg).
const EARN_CARD_GRADIENT =
  "linear-gradient(180deg, #000000 0%, rgba(221, 42, 123, 0.09) 100%)";

interface PromoSignupCardProps {
  // When false, the gift-card bloom and ₹500 count-up are held in their
  // initial state. They only fire once `play` flips true, so the parent can
  // wait until the card is actually on-screen before starting the entry beat.
  play?: boolean;
  // "f" variant — used by /creator/promo-f only. ₹500 is rendered as a static
  // number (no count-up) and bounces in sync with the Get OTP button. Both
  // bounces start VARIANT_F_SECONDARY_DELAY_MS after card render, staggered
  // just behind the gift-card bloom (VARIANT_F_CARDS_DELAY_MS).
  // "w" variant — used by /creator/promo-w only. Entry animations are stripped
  // entirely: gift cards render in their final stack pose, ₹500 is static, the
  // rupee glyph does not pulse, and the card does not lift on first scroll.
  // Sparkles on the front voucher and the Get OTP button bounce are preserved.
  // "earn" variant — used by /creator/earn. Swaps the gift-card stack for a
  // pair of FlippingCoin images, renders the heading as plain text (no count-up
  // or rupee pulse), and flips the Send OTP button from purple/pink gradient
  // to a yellow "Win Now" button. Entry beats are stripped like the "w"
  // variant — the button bounce is preserved as a subtle attention cue.
  variant?: "f" | "w" | "earn";
  // i18n namespace the card reads from. Defaults to "creatorPromo" so the
  // existing /creator/promo and /creator/promo-{f,w} routes are unchanged.
  // /creator/earn passes "creatorEarn" so the same card draws Win-Gold-Coin
  // copy, 3 checks, and the "Win Now" CTA label from the earn locale.
  namespace?: string;
}

// Gift-card bloom + Send-OTP button bounce wait this long after `play` flips
// true. The counter starts immediately, so this is just the gap between the
// counter starting and the secondary entry beats kicking off. Keeps the entry
// visually staggered: card → counter → images + button.
const SECONDARY_REVEAL_DELAY_MS = 750;

// /promo-f variant — gift-card bloom kicks off this far after the card mounts.
const VARIANT_F_CARDS_DELAY_MS = 1800;
// /promo-f variant — ₹500 + Get OTP bounce kick off this far after the card
// mounts, staggered just behind the gift-card bloom so the eye lands on the
// cards first, then the bouncing CTA pair.
const VARIANT_F_SECONDARY_DELAY_MS = 2400;

export default function PromoSignupCard({
  play = true,
  variant,
  namespace = "creatorPromo",
}: PromoSignupCardProps = {}) {
  const { t } = useTranslation(namespace);
  const isEarn = variant === "earn";
  const {
    phone,
    setPhone,
    setCountry,
    stage,
    otp,
    setOtp,
    verifyStatus,
    profile,
    setProfileField,
    error,
    fieldErrors,
    requiresBasicInfo,
    resendIn,
    sendOtp,
    resendOtp,
    submitProfile,
    changeNumber,
    verifyOtp,
  } = useSignup();

  // Pretty-print the entered E.164 phone for the earn-variant OTP header
  // ("OTP sent to +91 98765 43210"). libphonenumber's formatInternational
  // handles the country-specific spacing; fall back to raw E.164 if parsing
  // fails so the user still sees something useful.
  const formattedPhone = (() => {
    if (!phone) return "";
    try {
      return parsePhoneNumber(phone)?.formatInternational() ?? phone;
    } catch {
      return phone;
    }
  })();

  // Gates the Send-OTP button bounce (and, on /promo-f, the ₹500 bounce).
  // Default variant: holds for SECONDARY_REVEAL_DELAY_MS so the counter gets
  // the spotlight first. /promo-f variant: holds for VARIANT_F_SECONDARY_DELAY_MS
  // so the bounce lands just after the gift-card bloom (1800ms).
  const [playSecondary, setPlaySecondary] = useState(false);
  useEffect(() => {
    if (!play) {
      setPlaySecondary(false);
      return;
    }
    const delay =
      variant === "f" ? VARIANT_F_SECONDARY_DELAY_MS : SECONDARY_REVEAL_DELAY_MS;
    const id = window.setTimeout(() => setPlaySecondary(true), delay);
    return () => window.clearTimeout(id);
  }, [play, variant]);

  const checks = (() => {
    const raw = t("hero.card.checks", { returnObjects: true });
    return Array.isArray(raw) ? (raw as string[]) : [];
  })();

  // Earn variant only — feature bullets that previously sat below the card,
  // now nested inside the card per the new design.
  const earnFeatures = (() => {
    if (!isEarn) return [];
    const raw = t("hero.features", { returnObjects: true });
    return Array.isArray(raw) ? (raw as string[]) : [];
  })();

  const otpVisible =
    stage === "otp" || stage === "profile" || stage === "submitting" || stage === "submitted";
  // Returning users (requires_basic_info=false) skip the profile sheet entirely;
  // /verify runs straight from the OTP stage with no name/email payload.
  const profileVisible =
    requiresBasicInfo &&
    (stage === "profile" || stage === "submitting" || stage === "submitted");
  // Once we move past Stage 1 the phone input is locked. The CTA button
  // toggles to "Edit" so the user can unlock it and pick a new number.
  const phoneLocked = stage !== "phone";

  const isFirstNameValid = profile.firstName.trim().length > 0;
  const isLastNameValid = profile.lastName.trim().length > 0;
  const emailTrimmed = profile.email.trim();
  const isEmailValid = emailTrimmed === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed);
  const canSubmitProfile = isFirstNameValid && isLastNameValid && isEmailValid;

  const submitButtonLabel =
    stage === "submitting"
      ? t("signupCard.creating")
      : stage === "submitted"
        ? t("signupCard.done")
        : t("signupCard.createAccount");

  // One-shot lift on first scroll — like the card is "noticing" the user.
  // Listener is { once: true } so it auto-detaches after the first event.
  // Skipped on variant="w" and variant="earn" (both strip entry animations).
  const [hasLifted, setHasLifted] = useState(false);
  useEffect(() => {
    if (variant === "w" || variant === "earn") return;
    if (hasLifted) return;
    const onScroll = () => setHasLifted(true);
    window.addEventListener("scroll", onScroll, { once: true, passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasLifted, variant]);

  // Forward-only progressive reveal in Stage 3: lastName appears once
  // firstName has any non-whitespace text, email + submit appear once
  // lastName does. Once revealed, fields stay revealed even if the user
  // clears the field — collapsing mid-edit would be jarring.
  const [hasTypedFirstName, setHasTypedFirstName] = useState(false);
  const [hasTypedLastName, setHasTypedLastName] = useState(false);
  useEffect(() => {
    if (!hasTypedFirstName && profile.firstName.trim().length > 0) {
      setHasTypedFirstName(true);
    }
  }, [profile.firstName, hasTypedFirstName]);
  useEffect(() => {
    if (!hasTypedLastName && profile.lastName.trim().length > 0) {
      setHasTypedLastName(true);
    }
  }, [profile.lastName, hasTypedLastName]);

  return (
    <motion.div
      id="promo-hero-card"
      layout
      style={{ background: isEarn ? EARN_CARD_GRADIENT : CARD_GRADIENT }}
      initial={{
        y: 0,
        boxShadow: isEarn ? "none" : REST_SHADOW,
      }}
      animate={{
        y: hasLifted ? [0, -4, 0] : 0,
        boxShadow: isEarn
          ? "none"
          : hasLifted
            ? [REST_SHADOW, LIFT_SHADOW, REST_SHADOW]
            : REST_SHADOW,
      }}
      transition={{
        layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
        y: { duration: 0.7, times: [0, 0.4, 1], ease: [0.34, 1.4, 0.64, 1] },
        boxShadow: { duration: 0.7, times: [0, 0.4, 1], ease: [0.4, 0, 0.2, 1] },
      }}
      className="relative mx-auto w-full max-w-[420px] rounded-[24px] px-2 py-4"
    >
      {/* Earn variant: top-right corner coin peeks above the card. Sibling of
          the voucher row so it's positioned relative to the outer card box
          rather than the content column. */}
      {isEarn && (
        <div className="absolute -top-5 right-3 z-20 pointer-events-none">
          <FlippingCoin size={52} />
        </div>
      )}

      {/* Voucher row */}
      {isEarn ? (
        <div className="pr-14">
          {/* Heading — "Send free invoice —" sits at 20px/semibold; the gold
              <0>Win Gold Coin</0> portion has its own weight/style. */}
          <h2 className="text-[20px] font-semibold tracking-[-0.04em] text-white leading-tight">
            <Trans
              i18nKey="hero.card.voucherHeading"
              t={t}
              components={[
                <span
                  key="gold"
                  className="italic"
                  style={{
                    color: "#FFCC00",
                    fontFamily:
                      "var(--font-solitreo), 'Brush Script MT', 'Snell Roundhand', cursive",
                    fontWeight: 700,
                    fontSize: "1.15em",
                    paddingLeft: "0.1em",
                  }}
                />,
              ]}
            />
          </h2>
        </div>
      ) : (
      <div className="flex items-start gap-3">
        <GiftCardStackAnimation
          play={variant === "f" ? play : playSecondary}
          startDelayMs={variant === "f" ? VARIANT_F_CARDS_DELAY_MS : undefined}
          skipBloom={variant === "w"}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-600" />
            </span>
            <span className="text-xs font-normal text-primary">
              {t("hero.card.livePromo")}
            </span>
          </div>
          <h2 className="mt-0.5 text-[20px] font-semibold tracking-[-0.04em] text-primary leading-tight">
            <Trans
              i18nKey="hero.card.voucherHeading"
              t={t}
              components={[
                variant === "f" ? (
                  // /promo-f: static "500" that bounces in sync with the
                  // Get OTP button once the user first scrolls or taps.
                  // Same keyframes/timing as the button below.
                  <motion.span
                    key="amount"
                    className="inline-block origin-center"
                    style={{
                      willChange: "transform",
                      transform: "translateZ(0)",
                    }}
                    animate={
                      playSecondary
                        ? { y: [0, -4, 0, -2, 0], scale: [1, 1.04, 1, 1.02, 1] }
                        : { y: 0, scale: 1 }
                    }
                    transition={
                      playSecondary
                        ? {
                            duration: 1.1,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatDelay: 0.9,
                          }
                        : { duration: 0 }
                    }
                  >
                    500
                  </motion.span>
                ) : variant === "w" ? (
                  // /promo-w: static "500" — no count-up, no bounce.
                  <span key="amount">500</span>
                ) : (
                  <CountUp key="amount" to={500} duration={2.5} delay={0} play={play} />
                ),
                variant === "w" ? (
                  // /promo-w: static rupee glyph — no scale pulse.
                  <span key="rupee" />
                ) : (
                  <motion.span
                    key="rupee"
                    className="inline-block origin-center"
                    style={{
                      verticalAlign: "baseline",
                      lineHeight: 1,
                      willChange: "transform",
                      transform: "translateZ(0)",
                    }}
                    animate={
                      variant === "f"
                        ? // /promo-f: bounce in lockstep with the static "500"
                          // and the Get OTP button. Same keyframes / timing so
                          // the whole "₹500" reads as a single bouncing unit.
                          playSecondary
                          ? { y: [0, -4, 0, -2, 0], scale: [1, 1.04, 1, 1.02, 1] }
                          : { y: 0, scale: 1 }
                        : { scale: [1, 1.12, 1] }
                    }
                    transition={
                      variant === "f"
                        ? playSecondary
                          ? {
                              duration: 1.1,
                              ease: "easeInOut",
                              repeat: Infinity,
                              repeatDelay: 0.9,
                            }
                          : { duration: 0 }
                        : {
                            duration: 1.6,
                            repeat: Infinity,
                            ease: [0.45, 0, 0.55, 1],
                            repeatDelay: 1.4,
                          }
                    }
                  />
                ),
              ]}
            />
          </h2>
          <p className="mt-1 text-xs font-normal text-primary leading-snug">
            {t("hero.card.voucherBody")}{" "}
            <a
              href={PROMO_CONFIG.terms.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 underline"
              style={{ color: "#8134A599" }}
            >
              {t("hero.card.voucherTerms")}
            </a>
          </p>
        </div>
      </div>
      )}

      {/* CTA label + checks. Default/f/w variants keep the "Get started" label
          plus a wrapping check list. Earn variant drops the label and renders
          the three checks inline on a single 10px row. */}
      {!isEarn ? (
        <div className="mt-2 px-2">
          <p className="text-xs font-semibold leading-4 text-primary">
            {t("hero.card.ctaLabel")}
          </p>
          <ul className="flex flex-wrap items-center gap-x-0.5 gap-y-1 text-xs font-normal text-primary">
            {checks.map((label, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <span aria-hidden="true">✅</span>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : !otpVisible ? (
        <ul className="mt-1 px-1 flex items-center justify-center text-[11px] font-normal text-white whitespace-nowrap">
          {checks.map((label, i) => (
            <li key={i} className="flex items-center gap-1">
              <span aria-hidden="true">✅</span>
              <span>{label}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {/* Phone input + Send OTP. Once we leave stage 'phone' the input is
          locked and the button flips to "Edit", which calls changeNumber
          to unlock the field. Earn variant hides this entirely once we move
          past Stage 1 — the OTP entry layout below replaces it. */}
      {(!isEarn || !otpVisible) && (
      <div className={isEarn ? "mt-1.5" : "mt-2.5"}>
        <div className="flex items-center w-full rounded-[16px] bg-white border border-black/10 p-[6px] pl-3 gap-2">
          <Suspense fallback={null}>
            <ValidatedPhoneInput
              id="promo-hero-phone"
              value={phone}
              onChange={setPhone}
              onCountryChange={(c) => c && setCountry(c)}
              placeholder={t("hero.card.phonePlaceholder")}
              disabled={phoneLocked}
              autoComplete="off"
              inputClassName="bg-transparent border-none outline-none text-base placeholder:text-[#999999] focus:outline-none focus:ring-0 w-full text-[#212529] disabled:bg-transparent"
            />
          </Suspense>
          {(() => {
            const isVerifying = verifyStatus === "verifying";
            const ctaDisabled =
              stage === "otpSending" ||
              isVerifying ||
              (phoneLocked &&
                (verifyStatus === "verified" ||
                  stage === "submitting" ||
                  stage === "submitted"));
            return (
              <motion.button
                type="button"
                onClick={phoneLocked ? changeNumber : sendOtp}
                disabled={ctaDisabled}
                animate={
                  playSecondary
                    ? { y: [0, -4, 0, -2, 0], scale: [1, 1.04, 1, 1.02, 1] }
                    : { y: 0, scale: 1 }
                }
                transition={
                  playSecondary
                    ? {
                        duration: 1.1,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 0.9,
                      }
                    : { duration: 0 }
                }
                whileTap={{ scale: 0.94 }}
                className={
                  isEarn
                    ? "flex-shrink-0 px-4 py-2 rounded-[8px] text-white text-sm font-bold whitespace-nowrap bg-[linear-gradient(180.27deg,#DD2A7B_-46.92%,#9747FF_80.1%)] hover:brightness-110 transition-[filter,opacity] duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(151,71,255,0.4)]"
                    : "flex-shrink-0 px-3 py-2 rounded-[8px] text-white text-sm font-semibold whitespace-nowrap bg-[linear-gradient(162deg,#dd2a7b_0%,#9747FF_64%)] hover:brightness-110 transition-[filter,opacity] duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                }
              >
                {stage === "otpSending" ? (
                  t("otp.sending")
                ) : isVerifying ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {t("signupCard.verifying")}
                  </span>
                ) : phoneLocked ? (
                  t("hero.card.edit")
                ) : (
                  t("hero.card.sendOtp")
                )}
              </motion.button>
            );
          })()}
        </div>

        {/* Phone-stage error — surfaces /authenticate failures (network,
            VALIDATION_ERROR) and the rollback path from /verify when we
            bumped back to phone (PHONE_ALREADY_IN_USE, USER_NOT_FOUND). */}
        <AnimatePresence initial={false}>
          {stage === "phone" && error && (
            <motion.p
              key="phone-error"
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 8 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={SHEET_TRANSITION}
              role="alert"
              className="overflow-hidden text-xs text-red-100 bg-red-600/20 px-2 py-1 rounded text-center"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Disclaimer — only shown in stage 1 (hidden once OTP is sent) */}
        <AnimatePresence initial={false}>
          {stage === "phone" && (
            <motion.p
              key="disclaimer"
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: isEarn ? 6 : 8 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={SHEET_TRANSITION}
              className={
                isEarn
                  ? "overflow-hidden text-[8.5px] text-white/90 text-center leading-snug px-1 whitespace-nowrap"
                  : "overflow-hidden text-[10px] md:text-[11px] text-white/90 text-center leading-snug px-1"
              }
            >
              <Trans
                i18nKey="hero.card.disclaimer"
                t={t}
                components={[
                  <a
                    key="terms"
                    href="/legal/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  />,
                  <a
                    key="privacy"
                    href="/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  />,
                ]}
              />
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      )}

      {/* Earn variant Stage 2 — replaces the phone input row once we move past
          Stage 1. Top header shows a "Change Number" affordance and the
          masked destination ("OTP sent to +91 …"); the white pill below
          mirrors the Stage 1 input chrome, swapping the phone field for 4
          OTP boxes + a Verify CTA. Auto-verify still fires on the 4th digit
          via SignupContext; the Verify button just exposes the same path
          for users who don't trust the auto-trigger. */}
      {isEarn && otpVisible && (
        <div className="mt-2">
          <div className="flex items-center justify-between px-1 mb-2 text-[12px] text-white">
            <button
              type="button"
              onClick={changeNumber}
              disabled={stage === "submitting" || stage === "submitted"}
              className="font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("hero.card.changeNumber")}
            </button>
            <span className="opacity-90">
              <Trans
                i18nKey="hero.card.otpSentTo"
                t={t}
                values={{ phone: formattedPhone }}
                components={[
                  <strong key="ph" className="font-semibold text-white" />,
                ]}
              />
            </span>
          </div>

          <div className="flex items-center w-full rounded-[16px] bg-white border border-black/10 p-[6px] gap-2">
            <div className="flex-1 flex items-center justify-center">
              <OtpInput
                length={4}
                value={otp}
                onChange={setOtp}
                autoFocus
                disabled={
                  stage === "submitting" ||
                  stage === "submitted" ||
                  verifyStatus === "verified"
                }
                variant="light"
              />
            </div>
            <button
              type="button"
              onClick={verifyOtp}
              disabled={
                otp.length !== 4 ||
                verifyStatus === "verifying" ||
                verifyStatus === "verified" ||
                stage === "submitting" ||
                stage === "submitted"
              }
              className={
                verifyStatus === "verified"
                  ? // Verified pill — swaps the purple→pink CTA for a solid green
                    // affirmation that locks until the user uses "Change Number"
                    // to restart. Cursor-default + disabled state below makes
                    // sure clicks don't re-fire verify.
                    "flex-shrink-0 px-4 py-2 rounded-[8px] text-white text-sm font-bold whitespace-nowrap bg-[#16A34A] shadow-[0_2px_8px_rgba(22,163,74,0.45)] cursor-default disabled:opacity-100"
                  : "flex-shrink-0 px-4 py-2 rounded-[8px] text-white text-sm font-bold whitespace-nowrap bg-[linear-gradient(180.27deg,#DD2A7B_-46.92%,#9747FF_80.1%)] hover:brightness-110 transition-[filter,opacity] duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(151,71,255,0.4)]"
              }
            >
              {verifyStatus === "verifying" ? (
                <span className="inline-flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </span>
              ) : verifyStatus === "verified" ? (
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4" strokeWidth={3} />
                  {t("hero.card.verified")}
                </span>
              ) : (
                t("hero.card.verify")
              )}
            </button>
          </div>

          {/* Non-error status messages (network failures the OTP-stage
              error handler couldn't route to a known code). Hidden when
              the verify succeeded or when the "Incorrect OTP" pill below
              is taking over. */}
          {error && verifyStatus !== "verified" && verifyStatus !== "error" && (
            <p className="mt-2 text-xs text-red-100 bg-red-600/20 px-2 py-1 rounded text-center">
              {error}
            </p>
          )}

          {/* "Incorrect OTP" pill — auto-hides after 2s (see verifyStatus
              watcher in SignupContext). */}
          <AnimatePresence initial={false}>
            {verifyStatus === "error" && (
              <motion.div
                key="earn-pill-error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="mt-2 flex justify-center"
              >
                <VerifiedBadge status={verifyStatus} t={t} />
              </motion.div>
            )}
          </AnimatePresence>

          {verifyStatus !== "verified" && (
            <div className="mt-2">
              <ResendRow
                resendIn={resendIn}
                resendOtp={resendOtp}
                disabled={verifyStatus === "verifying"}
                t={t}
              />
            </div>
          )}
        </div>
      )}

      {/* Earn variant — feature bullets moved inside the card. Yellow ★ + white
          text; lead word in each i18n string is wrapped in <0>…</0> for bold.
          Hidden once we move past Stage 1 so the OTP layout sits clean. */}
      {isEarn && !otpVisible && earnFeatures.length > 0 && (
        <ul className="mt-3 px-2 flex flex-col gap-1.5 text-white text-[12px] leading-snug">
          {earnFeatures.map((_, i) => (
            <li key={i} className="flex items-center gap-2">
              <span
                aria-hidden
                className="text-[#FFCC00] text-[14px] leading-none drop-shadow-[0_0_4px_rgba(255,204,0,0.85)]"
              >
                ★
              </span>
              <span>
                <Trans
                  i18nKey={`hero.features.${i}`}
                  t={t}
                  components={[<strong key="b" className="font-bold text-white" />]}
                />
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Stage 2: OTP block — default/f/w variants. Earn renders its own
          OTP entry layout above (inline with the Stage 1 input pill), so
          this block is suppressed for variant="earn". */}
      <AnimatePresence initial={false}>
        {!isEarn && otpVisible && (
          <motion.div
            key="otp-section"
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 12 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={SHEET_TRANSITION}
            className="overflow-hidden"
          >
            <div className="flex flex-col items-center gap-3 px-2">
              <p className="flex items-center justify-center gap-1.5 text-xs font-normal text-white text-center">
                <span>{t("signupCard.otpSentOverWhatsapp")}</span>
                <WhatsAppGlyph />
                <span className="font-medium text-white">
                  +91-{phone.replace(/^\+?91/, "").trim() || phone}
                </span>
              </p>

              <OtpInput
                length={4}
                value={otp}
                onChange={setOtp}
                autoFocus
                disabled={stage === "submitting" || stage === "submitted"}
                variant="light"
              />

              {verifyStatus === "verified" && (
                <VerifiedBadge status={verifyStatus} t={t} />
              )}

              {error && verifyStatus !== "verified" && verifyStatus !== "error" && (
                <p className="text-xs text-red-100 bg-red-600/20 px-2 py-0.5 rounded">{error}</p>
              )}

              {verifyStatus !== "verified" && (
                <ResendRow
                  resendIn={resendIn}
                  resendOtp={resendOtp}
                  disabled={verifyStatus === "verifying"}
                  t={t}
                />
              )}

              {/* "Incorrect OTP" pill drops to its own line under the resend
                  row and auto-hides after 2s — see the verifyStatus-watcher
                  effect in SignupContext. The verifying state is surfaced on
                  the Edit button itself, not here. */}
              <AnimatePresence initial={false}>
                {verifyStatus === "error" && (
                  <motion.div
                    key="pill-error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <VerifiedBadge status={verifyStatus} t={t} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 3: profile form */}
      <AnimatePresence initial={false}>
        {profileVisible && (
          <motion.div
            key="profile-section"
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={SHEET_TRANSITION}
            className="overflow-hidden"
          >
            <div className="flex flex-col px-2">
              <TextInput
                label={t("signupCard.firstNameLabel")}
                placeholder={t("signupCard.firstNamePlaceholder")}
                value={profile.firstName}
                onChange={(e) => setProfileField("firstName", e.target.value)}
                autoComplete="off"
              />

              {/* Progressive reveal: lastName appears once firstName has
                  content. Forward-only — see hasTypedFirstName state above. */}
              <AnimatePresence initial={false}>
                {hasTypedFirstName && (
                  <motion.div
                    key="last-name-row"
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={SHEET_TRANSITION}
                    className="overflow-hidden"
                  >
                    <TextInput
                      label={t("signupCard.lastNameLabel")}
                      placeholder={t("signupCard.lastNamePlaceholder")}
                      value={profile.lastName}
                      onChange={(e) => setProfileField("lastName", e.target.value)}
                      autoComplete="off"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email + submit + partner logos all arrive together once
                  lastName has been touched. */}
              <AnimatePresence initial={false}>
                {hasTypedLastName && (
                  <motion.div
                    key="email-and-submit"
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={SHEET_TRANSITION}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-2">
                      <TextInput
                        label={t("signupCard.emailLabel")}
                        placeholder={t("signupCard.emailPlaceholder")}
                        value={profile.email}
                        onChange={(e) => setProfileField("email", e.target.value)}
                        type="email"
                        autoComplete="off"
                        error={
                          // Server-reported "email already in use" wins over the
                          // client-side regex hint — the regex is just a typo guard.
                          fieldErrors.email ??
                          (emailTrimmed && !isEmailValid
                            ? "Please enter a valid email"
                            : undefined)
                        }
                      />

                      {/* Generic /verify failure surface (network, unmapped 4xx). The
                          documented codes are routed to the OTP stage or fieldErrors —
                          this catches everything else without losing the message. */}
                      {stage === "profile" && error && !fieldErrors.email && (
                        <p
                          role="alert"
                          className="text-xs text-red-100 bg-red-600/20 px-2 py-1 rounded text-center"
                        >
                          {error}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={submitProfile}
                        disabled={!canSubmitProfile || stage === "submitting" || stage === "submitted"}
                        className="relative mt-1 w-full inline-flex items-center justify-center overflow-hidden rounded-full p-[1px] shadow-[0_4px_12px_rgba(129,52,165,0.18)] transition-[opacity] duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffffff_0%,rgba(221,42,123,1)_10%,rgba(151,71,255,1)_50%,rgba(221,42,123,0.5)_90%,#ffffff_100%)]"
                        />
                        <span className="relative z-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-semibold">
                          <span className="bg-[linear-gradient(162.34deg,#DD2A7B_4.78%,#9747FF_89.95%)] bg-clip-text text-transparent">
                            {submitButtonLabel}
                          </span>
                          <motion.span
                            aria-hidden="true"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.1, ease: "easeInOut", repeat: Infinity }}
                            className="inline-flex"
                          >
                            <ArrowRight className="h-4 w-4 text-[#DD2A7B]" strokeWidth={2.5} />
                          </motion.span>
                        </span>
                      </button>

                      <PartnerFooter
                        builtWithLabel={
                          isEarn ? t("signupCard.builtWith") : undefined
                        }
                        developedWithLabel={
                          isEarn ? t("signupCard.developedWith") : undefined
                        }
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function VerifiedBadge({
  status,
  t,
}: {
  status: "idle" | "verifying" | "verified" | "error";
  t: ReturnType<typeof useTranslation>["t"];
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

function ResendRow({
  resendIn,
  resendOtp,
  disabled,
  t,
}: {
  resendIn: number;
  resendOtp: () => Promise<void>;
  disabled: boolean;
  t: ReturnType<typeof useTranslation>["t"];
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

function PartnerFooter({
  builtWithLabel,
  developedWithLabel,
}: {
  builtWithLabel?: string;
  developedWithLabel?: string;
} = {}) {
  // Earn variant renders "Built with" / "Developed with" labels above each
  // logo (per /creator/earn design); the original promo variants pass no
  // labels and get the side-by-side logos with a vertical divider between.
  const labeled = Boolean(builtWithLabel && developedWithLabel);

  if (labeled) {
    return (
      <div className="mt-3 flex items-end justify-center gap-6 text-[11px] text-white/85">
        <div className="flex flex-col items-center gap-1">
          <span>{builtWithLabel}</span>
          <Image src="/logos/Meta_White.png" alt="Meta" width={85} height={30} />
        </div>
        <span aria-hidden className="h-9 w-px bg-white/30" />
        <div className="flex flex-col items-center gap-1">
          <span>{developedWithLabel}</span>
          <Image
            src="/logos/Yt_White.png"
            alt="YouTube"
            width={85}
            height={30}
          />
        </div>
      </div>
    );
  }

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

function WhatsAppGlyph() {
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
