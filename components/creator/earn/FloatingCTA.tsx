"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Trans, useTranslation } from "react-i18next";
import { ValidatedPhoneInput } from "./ValidatedPhoneInput";
import FlippingCoin from "./FlippingCoin";
import { useSignup } from "@/components/creator/promo/SignupContext";
import GiftCardStackAnimation from "@/components/creator/promo/GiftCardStackAnimation";
import { PROMO_CONFIG } from "@/lib/promo/config";
import { track } from "@/lib/analytics/track";

// Module-level rAF id so overlapping clicks cancel the previous scroll
// instead of fighting it (each animation re-reads window.scrollY at start).
let promoScrollRafId: number | null = null;

function smoothScrollToCenter(el: HTMLElement, durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    const rect = el.getBoundingClientRect();
    const startY = window.scrollY;
    const targetY = startY + rect.top + rect.height / 2 - window.innerHeight / 2;
    const distance = targetY - startY;
    if (Math.abs(distance) < 1) {
      resolve();
      return;
    }
    if (promoScrollRafId !== null) {
      cancelAnimationFrame(promoScrollRafId);
      promoScrollRafId = null;
    }
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      window.scrollTo(0, startY + distance * eased);
      if (t < 1) {
        promoScrollRafId = requestAnimationFrame(step);
      } else {
        promoScrollRafId = null;
        resolve();
      }
    };
    promoScrollRafId = requestAnimationFrame(step);
  });
}

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
  const { t } = useTranslation(namespace);
  const [isVisible, setIsVisible] = useState(false);
  // Gate visibility on the hero card having been seen at least once. The
  // observer's initial callback fires synchronously on observe(), so without
  // this guard the bar pops up on first paint whenever the card starts below
  // the fold (e.g. /creator/earn, where the story carousel pushes it down).
  const hasBeenSeenRef = useRef(false);

  useEffect(() => {
    const target = triggerElementId ? document.getElementById(triggerElementId) : null;
    if (target) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            hasBeenSeenRef.current = true;
            setIsVisible(false);
          } else {
            setIsVisible(hasBeenSeenRef.current);
          }
        },
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

  return variant === "promo" ? (
    <PromoFloatingCTA isVisible={isVisible} t={t} trackingPrefix={trackingPrefix} />
  ) : (
    <EarnFloatingCTA isVisible={isVisible} t={t} trackingPrefix={trackingPrefix} />
  );
}

// ---------- Earn variant ---------------------------------------------------
// Sticky bottom bar mirroring the hero card's Win-Gold-Coin pitch: dark
// gradient surface, FlippingCoin peeking out of the top-right corner, the
// shared voucher heading (white + gold script), an inline 3-up checks row,
// the same white phone input pill, and the Terms/Privacy disclaimer. Submit
// hands the phone number off to the hero card via SignupContext (same path
// as the promo variant) so the OTP step happens inline on the card.

interface EarnVariantProps {
  isVisible: boolean;
  t: ReturnType<typeof useTranslation>["t"];
  trackingPrefix: string;
}

function EarnFloatingCTA({ isVisible, t, trackingPrefix }: EarnVariantProps) {
  const { phone, setPhone, sendOtp, stage } = useSignup();
  const prefersReducedMotion = useReducedMotion();

  const checks = (() => {
    const raw = t("hero.card.checks", { returnObjects: true });
    return Array.isArray(raw) ? (raw as string[]) : [];
  })();

  const handleSubmit = async () => {
    track(`${trackingPrefix}_floating_cta_phone_submit`, { has_phone: Boolean(phone) });
    const target = document.getElementById("promo-hero-card");

    if (target) {
      if (prefersReducedMotion) {
        target.scrollIntoView({ block: "center" });
      } else {
        await smoothScrollToCenter(target, 1200);
      }
    }

    if (!phone || stage !== "phone") return;

    await new Promise((r) => window.setTimeout(r, 350));
    void sendOtp();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        // -bottom-px on the fixed wrapper (and the matching +1px on the
        // inner pb) overshoots the viewport by 1px to cover the sub-pixel
        // gap left by framer-motion's translateY(0) on fractional-DPR screens.
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="fixed -bottom-px left-0 right-0 z-40"
        >
          <div
            className="relative w-full md:max-w-md md:mx-auto rounded-t-[20px] px-4 pt-3 pb-[max(calc(0.5rem+1px),calc(env(safe-area-inset-bottom)+1px))] shadow-[0_-10px_30px_rgba(0,0,0,0.45),0_-2px_8px_rgba(221,42,123,0.2)]"
            style={{
              background:
                "linear-gradient(180deg, #000000 0%, rgba(221, 42, 123, 0.09) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Top-right coin peeks above the bar edge — sibling of the
                content column so it pins to the outer surface rather than
                being affected by the inner padding. */}
            <div className="absolute -top-5 right-3 z-20 pointer-events-none">
              <FlippingCoin size={48} />
            </div>

            {/* Heading — "Send free invoice —" white, "Win Gold Coin" gold
                Solitreo script. Right padding clears the coin. */}
            <h3 className="pr-12 text-[18px] font-semibold tracking-[-0.04em] text-white leading-tight">
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
            </h3>

            {/* Inline checks — single row mirroring the hero card's earn
                layout. 10.5px so all three fit on a 360px viewport. */}
            {checks.length > 0 && (
              <ul className="mt-1.5 flex items-center text-[10.5px] font-normal text-white whitespace-nowrap gap-x-2">
                {checks.map((label, i) => (
                  <li key={i} className="flex items-center gap-1">
                    <span aria-hidden="true">✅</span>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Phone input + Win Now — hands off to the hero card */}
            <div className="mt-2.5 flex items-center w-full rounded-[16px] bg-white border border-black/10 p-[6px] pl-3 gap-2">
              <Suspense fallback={null}>
                <ValidatedPhoneInput
                  id="earn-floating-phone"
                  value={phone}
                  onChange={setPhone}
                  placeholder={t("hero.card.phonePlaceholder")}
                  theme="light"
                  inputClassName="bg-transparent border-none outline-none text-base placeholder:text-[#999999] focus:outline-none focus:ring-0 w-full text-[#212529]"
                />
              </Suspense>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={stage === "otpSending"}
                aria-label={t("floatingCta.ariaLabel")}
                className="flex-shrink-0 px-4 py-2 rounded-[8px] text-white text-sm font-bold whitespace-nowrap bg-[linear-gradient(180.27deg,#DD2A7B_-46.92%,#9747FF_80.1%)] hover:brightness-110 transition-[filter,opacity] duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(151,71,255,0.4)]"
              >
                {stage === "otpSending" ? t("otp.sending") : t("hero.card.sendOtp")}
              </button>
            </div>

            {/* Disclaimer */}
            <p className="mt-1.5 text-[8.5px] text-white/90 text-center leading-snug px-1">
              <Trans
                i18nKey="hero.card.disclaimer"
                t={t}
                components={[
                  <a
                    key="terms"
                    href="/legal/terms"
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
  const prefersReducedMotion = useReducedMotion();

  const handleSubmit = async () => {
    track(`${trackingPrefix}_floating_cta_phone_submit`, { has_phone: Boolean(phone) });
    const target = document.getElementById("promo-hero-card");

    // Always scroll the user to the hero card, even with an empty phone
    // input — the floating bar's role is to surface the offer; the hero
    // takes over for the actual signup. Custom rAF scroll because native
    // smooth-scroll completes in ~300ms and felt jumpy.
    if (target) {
      if (prefersReducedMotion) {
        target.scrollIntoView({ block: "center" });
      } else {
        await smoothScrollToCenter(target, 1200);
      }
    }

    // Only advance the signup state if the user has actually typed a
    // number and we're still on the phone step.
    if (!phone || stage !== "phone") return;

    // Brief hold so the user sees their number populated on the hero card
    // before stage flips to OTP and the layout shifts.
    await new Promise((r) => window.setTimeout(r, 350));
    void sendOtp();
  };

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
            {/* Crossfading orange overlay — only the yellow stops appear to "breathe". */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-t-[20px] pointer-events-none animate-floater-hue motion-reduce:animate-none"
              style={{
                background:
                  "linear-gradient(180deg, #FF8C42 0%, #FF8C42 50%, #806600 80%, #000000 100%)",
              }}
            />

            <div className="relative z-10">
              {/* Voucher row */}
              <div className="flex items-center gap-3 mb-1">
                <div className="-mt-14 -ml-3 shrink-0">
                  <GiftCardStackAnimation scale={0.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-primary font-medium text-sm leading-tight">
                    <motion.span
                      aria-hidden
                      animate={
                        prefersReducedMotion
                          ? undefined
                          : {
                              opacity: [1, 0.25, 1, 0.55, 1, 0.35, 1],
                              scale: [1.15, 0.95, 1.2, 1, 1.25, 0.95, 1.1],
                              filter: [
                                "drop-shadow(0 0 6px rgba(255,235,59,1)) drop-shadow(0 0 14px rgba(255,255,255,0.9))",
                                "drop-shadow(0 0 0px rgba(255,235,59,0))",
                                "drop-shadow(0 0 8px rgba(255,235,59,1)) drop-shadow(0 0 18px rgba(255,255,255,0.95))",
                                "drop-shadow(0 0 3px rgba(255,235,59,0.5))",
                                "drop-shadow(0 0 10px rgba(255,235,59,1)) drop-shadow(0 0 22px rgba(255,255,255,1))",
                                "drop-shadow(0 0 0px rgba(255,235,59,0))",
                                "drop-shadow(0 0 6px rgba(255,235,59,0.9)) drop-shadow(0 0 12px rgba(255,255,255,0.7))",
                              ],
                            }
                      }
                      transition={
                        prefersReducedMotion
                          ? undefined
                          : {
                              duration: 0.4,
                              times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1],
                              repeat: Infinity,
                              repeatDelay: 4.2,
                              ease: "linear",
                            }
                      }
                      className="inline-block mr-1"
                    >
                      ⚡
                    </motion.span>
                    <Trans
                      i18nKey="floatingCta.heading"
                      t={t}
                      components={[
                        <motion.span
                          key="rupee"
                          className="inline-block origin-center"
                          animate={
                            prefersReducedMotion
                              ? undefined
                              : { scale: [1, 1.18, 1] }
                          }
                          transition={
                            prefersReducedMotion
                              ? undefined
                              : {
                                  duration: 1.3,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  repeatDelay: 0.4,
                                }
                          }
                        />,
                      ]}
                    />
                  </h3>
                  <p className="mt-1 text-primary font-semibold text-xs leading-snug">
                    {t("floatingCta.body")}{" "}
                    <a
                      href={PROMO_CONFIG.terms.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 underline"
                      style={{ color: "#8134A599", fontWeight: 400 }}
                    >
                      {t("floatingCta.terms")}
                    </a>
                  </p>
                </div>
              </div>

              {/* Phone input + Get OTP — hand-off to the hero card on submit */}
              <div className="flex items-center w-full rounded-[16px] bg-white border border-black/10 p-[6px] pl-3 gap-2">
                <Suspense fallback={null}>
                  <ValidatedPhoneInput
                    id="promo-floating-phone"
                    value={phone}
                    onChange={setPhone}
                    placeholder={t("floatingCta.placeholder")}
                    theme="light"
                    inputClassName="bg-transparent border-none outline-none text-base placeholder:text-[#999999] focus:outline-none focus:ring-0 w-full text-[#212529]"
                  />
                </Suspense>
                <AnimatedOtpButton
                  disabled={stage === "otpSending"}
                  isSending={stage === "otpSending"}
                  onClick={handleSubmit}
                  staticPrefix={t("floatingCta.staticPrefix")}
                  primaryLabel={t("floatingCta.primaryLabel")}
                  swapLabel={t("floatingCta.swapLabel")}
                  sendingLabel={t("otp.sending")}
                  ariaLabel={t("floatingCta.ariaLabel")}
                />
              </div>

              {/* Disclaimer */}
              <p className="mt-1 text-[10px] text-white text-center leading-snug px-1">
                <Trans
                  i18nKey="hero.card.disclaimer"
                  t={t}
                  components={[
                    <a
                      key="terms"
                      href="/legal/terms"
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// "Get" stays static; the trailing word swaps OTP ↔ ₹500 on a 1.5s tick for
// 4 round-trip cycles (8 swaps), then settles on "OTP". Stops early on the
// first pointerdown anywhere, on prefers-reduced-motion, while the parent is
// sending OTP, or when the button is disabled.
interface AnimatedOtpButtonProps {
  disabled: boolean;
  isSending: boolean;
  onClick: () => void;
  staticPrefix: string;
  primaryLabel: string;
  swapLabel: string;
  sendingLabel: string;
  ariaLabel: string;
}

function AnimatedOtpButton({
  disabled,
  isSending,
  onClick,
  staticPrefix,
  primaryLabel,
  swapLabel,
  sendingLabel,
  ariaLabel,
}: AnimatedOtpButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  const [current, setCurrent] = useState<"primary" | "swap">("primary");
  const [stopped, setStopped] = useState(false);
  const swapsRef = useRef(0);
  const animatable = !prefersReducedMotion && !disabled && !isSending && !stopped;

  useEffect(() => {
    if (!animatable) return;
    const id = window.setInterval(() => {
      swapsRef.current += 1;
      setCurrent((c) => (c === "primary" ? "swap" : "primary"));
      if (swapsRef.current >= 8) {
        window.clearInterval(id);
        setStopped(true);
        setCurrent("primary");
      }
    }, 1500);
    return () => window.clearInterval(id);
  }, [animatable]);

  useEffect(() => {
    if (stopped || !animatable) return;
    const onTap = () => {
      setStopped(true);
      setCurrent("primary");
    };
    document.addEventListener("pointerdown", onTap, { once: true, capture: true });
    return () => document.removeEventListener("pointerdown", onTap, true);
  }, [stopped, animatable]);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="flex-shrink-0 px-3 py-2 rounded-[8px] text-white text-sm font-semibold whitespace-nowrap bg-[linear-gradient(162deg,#dd2a7b_0%,#9747FF_64%)] hover:brightness-110 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-1"
    >
      {isSending ? (
        sendingLabel
      ) : (
        <>
          <span className="leading-5">{staticPrefix}</span>
          <span className="relative inline-block overflow-hidden h-5 min-w-[4ch] text-center leading-5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={current}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                className="block leading-5"
              >
                {current === "primary" ? primaryLabel : swapLabel}
              </motion.span>
            </AnimatePresence>
          </span>
        </>
      )}
    </button>
  );
}
